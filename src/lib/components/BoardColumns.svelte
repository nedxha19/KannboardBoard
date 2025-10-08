<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getUserCountry } from '$lib/utils/geo';
  import { DEFAULT_PRIORITY, DEFAULT_STORY_POINTS } from '$lib/constants';

  export let lanes = [];
  export let logoSrc = `${base}/task-management.png`;
  export let logoAlt = 'Kanban';

  const dispatch = createEventDispatcher();
  let dialog;
  let userLocation = null;

  const blank = () => ({
    id: crypto.randomUUID(),
    title: '',
    description: '',
    createdAt: new Date().toISOString(),
    dueDate: '',
    points: DEFAULT_STORY_POINTS,
    priority: DEFAULT_PRIORITY,
    lane: lanes[0] ?? 'Do'
  });
  let model = blank();

  const openDialog = () => { model = blank(); dialog?.showModal(); };
  const submit = (e) => {
    e.preventDefault();
    if (!model.title.trim()) return;
    if (model.dueDate && !/Z$/.test(model.dueDate)) model.dueDate = new Date(model.dueDate).toISOString();
    dispatch('create', structuredClone(model));
    dialog?.close();
  };

  onMount(() => getUserCountry().then(loc => userLocation = loc));
</script>

<header class="sticky top-0 z-10 border-b border-black/5 backdrop-blur-xl bg-transparent">
  <div class="max-w-7xl mx-auto px-5 py-4 flex items-center gap-4">
    <a href={`${base}/`} class="flex items-center gap-3 group">
      <img src={logoSrc} alt={logoAlt} width="32" height="32"
           class="h-8 w-8 rounded-xl object-cover ring-1 ring-black/5 shadow-sm group-hover:scale-[1.02] transition-transform" />
      <div class="leading-tight">
        <span class="text-xl font-semibold tracking-tight text-slate-900">Kanban</span>
        <span class="block text-[11px] uppercase tracking-[0.14em] text-slate-500">Board</span>
      </div>
    </a>

        {#if userLocation}
      <div class="ml-auto mr-2 flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600">
        <span class="text-base" title={userLocation.country}>{userLocation.flag}</span>
        <span class="font-medium">{userLocation.code}</span>
      </div>
    {/if}

    <button
      type="button"
      class="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      on:click={() => dispatch('exportcsv')}
      title="Export all items as CSV"
    >
      📊 Export CSV
    </button>
    
    <button
      type="button"
      class="rounded-md px-3 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800"
      on:click={openDialog} 
      aria-haspopup="dialog"
    >
      + New Issue
    </button>
  </div>
</header>

<dialog id="dialog" bind:this={dialog} aria-labelledby="dialog-title"
        class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent">
  <div class="fixed inset-0 bg-gray-500/40 dark:bg-gray-900/40" on:click={() => dialog?.close()} aria-hidden="true"></div>
  <div class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
    <div class="relative sm:my-8 sm:w-full sm:max-w-lg rounded-2xl shadow-xl border border-black/10 bg-transparent backdrop-blur-xl">
      <div class="p-6">
        <h3 id="dialog-title" class="text-base font-semibold text-gray-900 dark:text-white">Create Task</h3>
        <form class="mt-4 space-y-3" on:submit={submit}>
          <label class="block text-sm">
            <span class="text-slate-700 dark:text-slate-200">Title</span>
            <input class="mt-1 w-full rounded-lg border px-3 py-2"
                   bind:value={model.title} required placeholder="Short summary" />
          </label>

          <label class="block text-sm">
            <span class="text-slate-700 dark:text-slate-200">Description</span>
            <textarea class="mt-1 w-full rounded-lg border px-3 py-2" rows="3"
                      bind:value={model.description} placeholder="Details"></textarea>
          </label>

          <div class="grid grid-cols-2 gap-3">
            <label class="block text-sm">
              <span class="text-slate-700 dark:text-slate-200">Due date</span>
              <input type="datetime-local" class="mt-1 w-full rounded-lg border px-3 py-2" bind:value={model.dueDate} />
            </label>

            <label class="block text-sm">
              <span class="text-slate-700 dark:text-slate-200">Story points</span>
              <input type="number" min="0" step="1" class="mt-1 w-full rounded-lg border px-3 py-2" bind:value={model.points} />
            </label>

            <label class="block text-sm">
              <span class="text-slate-700 dark:text-slate-200">Priority</span>
              <select class="mt-1 w-full rounded-lg border px-3 py-2" bind:value={model.priority}>
                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
              </select>
            </label>

            <label class="block text-sm">
              <span class="text-slate-700 dark:text-slate-200">Lane</span>
              <select class="mt-1 w-full rounded-lg border px-3 py-2" bind:value={model.lane}>
                {#each lanes as l}<option>{l}</option>{/each}
              </select>
            </label>
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button type="button" class="rounded-md px-3 py-2 text-sm font-semibold hover:bg-black/5" on:click={() => dialog?.close()}>
              Cancel
            </button>
            <button type="submit" class="rounded-md px-3 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</dialog>
