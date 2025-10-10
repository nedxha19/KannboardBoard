const LS_KEY = 'kanban_items';

export const loadItems = () => {
  const data = localStorage.getItem(LS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveItems = (items) => localStorage.setItem(LS_KEY, JSON.stringify(items));
