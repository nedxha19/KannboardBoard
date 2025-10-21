<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import HeaderBar from '$lib/components/HeaderBar.svelte';
  import BoardColumns from '$lib/components/BoardColumns.svelte';
  import { LANES } from '$lib/constants';
  import { loadItems, saveItems } from '$lib/utils/storage';
  import { exportToCSV } from '$lib/utils/export';
  import { requestNotificationPermission, showNotification } from '$lib/utils/Notification';

  const lanes = LANES;
  
  let items = browser ? loadItems() : [];
  
  $: if (browser) saveItems(items);

  const onCreate = (e) => {
    items = [...items, e.detail];
  };
  
  const onMove = (e) => {
    const { id, to } = e.detail;
    const item = items.find(i => i.id === id);
    const wasNotDone = item && item.lane !== 'Done';
    
    items = items.map(i => i.id === id ? { ...i, lane: to } : i);
    
    if (wasNotDone && to === 'Done' && item) {
      showNotification('Task Completed! 🎉', {
        body: `"${item.title}" has been moved to Done`,
        tag: `done-${id}`
      });
    }
  };

  onMount(() => requestNotificationPermission());
</script>

<div class="min-h-screen text-slate-900 bg-transparent">
  <HeaderBar {lanes} on:create={onCreate} on:exportcsv={() => exportToCSV(items)} />
  <BoardColumns {lanes} {items} on:move={onMove} />
</div>
