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
