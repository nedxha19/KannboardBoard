<script>
  import { createEventDispatcher } from 'svelte';
  import { flip } from 'svelte/animate';
  import { formatDueDate, isOverdue } from '$lib/utils/date';
  import { exportToICS} from '$lib/utils/export';
  import { PRIORITY_STYLES, DEFAULT_PRIORITY } from '$lib/constants';

  export let lanes = [];
  export let items = [];

  const dispatch = createEventDispatcher();
  let draggingId = null;

  const dragStart = (e, it) => {
    draggingId = it.id;
    e.dataTransfer.setData('text/plain', JSON.stringify({ item: it.id, from: it.lane }));
    e.dataTransfer.effectAllowed = 'move';
  };
  const dragOver = (e) => e.preventDefault();
  const drop = (e, to) => {
    const data = JSON.parse(e.dataTransfer.getData('text/plain') || '{}');
    draggingId = null;
    if (!data.item || data.from === to) return;
    dispatch('move', { id: data.item, to });
  };
  const dragEnd = () => (draggingId = null);

  const getPriorityStyle = (priority) => 
    PRIORITY_STYLES[priority] ?? PRIORITY_STYLES[DEFAULT_PRIORITY];

  const count = (lane) => items.reduce((n, i) => n + (i.lane === lane), 0);
  const sumPoints = (lane) => items
    .filter(i => i.lane === lane)
    .reduce((sum, i) => sum + (i.points || 0), 0);
</script>

<div class="mx-auto max-w-[1400px] p-5">
  <div class="grid gap-5 md:grid-cols-4">
    {#each lanes as lane}
      <section
        class="group relative flex min-h-[60vh] flex-col overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm bg-transparent"
        role="list" aria-label={`Lane ${lane}`}
        on:dragover={dragOver} on:drop={(e)=>drop(e, lane)}
      >
        <header class="sticky top-0 z-[1] flex items-center gap-2 border-b border-slate-200/70 px-3 py-2 backdrop-blur-md bg-transparent">
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 opacity-80"></span>
            <h2 class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">{lane}</h2>
          </div>
          <div class="ml-auto flex items-center gap-1.5">
            <span class="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-600" title="Story Points">
              <svg viewBox="0 0 20 20" fill="currentColor" class="size-3.5 opacity-70"><path d="M3 10a7 7 0 1 1 14 0A7 7 0 0 1 3 10Zm7-4a1 1 0 0 1 1 1v2.382l1.447.724a1 1 0 1 1-.894 1.788l-2-1A1 1 0 0 1 9 10V7a1 1 0 0 1 1-1Z"/></svg>
              {sumPoints(lane)}
            </span>
            <span class="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-600" title="Item Count">
              <svg viewBox="0 0 20 20" fill="currentColor" class="size-3.5 opacity-70"><path d="M4 6h12v2H4V6Zm0 4h12v2H4v-2Zm0 4h8v2H4v-2Z"/></svg>
              {count(lane)}
            </span>
          </div>
        </header>

        <div class="flex-1 space-y-3 overflow-auto p-3">
          {#if count(lane) === 0}
            <div class="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
              Empty — drag cards here
            </div>
          {/if}

          {#each items.filter(i => i.lane === lane) as it (it.id)}
            <article
              class="group/card relative cursor-grab rounded-xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md bg-transparent {isOverdue(it.dueDate) ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'}"
              role="listitem" draggable="true" aria-grabbed={draggingId===it.id}
              on:dragstart={(e)=>dragStart(e,it)} on:dragend={dragEnd} animate:flip
            >
              {#if isOverdue(it.dueDate)}
                <div class="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg" title="Overdue">
                  <svg viewBox="0 0 20 20" fill="currentColor" class="size-3"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/></svg>
                </div>
              {/if}

              <div class="flex items-start gap-3">
                <h3 class="line-clamp-2 flex-1 text-[13px] font-semibold leading-snug text-slate-900">{it.title}</h3>
                <span class={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ring-1 ${getPriorityStyle(it.priority)}`}>
                  {it.priority ?? DEFAULT_PRIORITY}
                </span>
              </div>

              {#if it.description}
                <p class="mt-1 line-clamp-2 text-[12px] leading-relaxed text-slate-600">{it.description}</p>
              {/if}

              <div class="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span class="inline-flex items-center gap-1 rounded-md border border-slate-200 px-1.5 py-0.5">
                  <svg viewBox="0 0 20 20" fill="currentColor" class="size-3.5"><path d="M3 10a7 7 0 1 1 14 0A7 7 0 0 1 3 10Zm7-4a1 1 0 0 1 1 1v2.382l1.447.724a1 1 0 1 1-.894 1.788l-2-1A1 1 0 0 1 9 10V7a1 1 0 0 1 1-1Z"/></svg>
                  Pts {it.points ?? 0}
                </span>

                {#if formatDueDate(it.dueDate)}
                  <span class="inline-flex items-center gap-1 rounded-md border border-slate-200 px-1.5 py-0.5 {isOverdue(it.dueDate) ? 'text-rose-600 font-medium' : ''}">
                    <svg viewBox="0 0 20 20" fill="currentColor" class="size-3.5"><path d="M6 2a1 1 0 1 1 2 0v1h4V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v2H3V5a2 2 0 0 1 2-2h1V2ZM3 9h14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Zm4 2h2v2H7v-2Z"/></svg>
                    {formatDueDate(it.dueDate)}
                  </span>
                {/if}
              </div>

              <div class="mt-2 flex gap-1 opacity-0 transition-opacity group-hover/card:opacity-100">
                <button
                  type="button"
                  class="flex-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50"
                  on:click={() => exportToICS(it)}
                  title="Export as ICS"
                >
                  📅 ICS
                </button>
                <button
                  type="button"
                  class="flex-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50"
                  on:click={() => shareItem(it)}
                  title="Share"
                >
                  🔗 Share
                </button>
              </div>
            </article>
          {/each}
        </div>
      </section>
    {/each}
  </div>
</div>
