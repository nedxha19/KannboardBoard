export const exportToICS = (item) => {
	const formatICSDate = (date) => new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
	const now = formatICSDate(new Date());
	const ics = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Kanban Board//EN',
		'BEGIN:VEVENT',
		`UID:${item.id}@kanban`,
		`DTSTAMP:${now}`,
		`DTSTART:${formatICSDate(item.createdAt)}`,
		`DTEND:${item.dueDate ? formatICSDate(item.dueDate) : now}`,
		`SUMMARY:${item.title}`,
		`DESCRIPTION:${(item.description || '').replace(/\n/g, '\\n')}`,
		`PRIORITY:${getPriorityNumber(item.priority)}`,
		'END:VEVENT',
		'END:VCALENDAR'
	].join('\r\n');
	downloadFile(ics, `${sanitizeFilename(item.title)}.ics`, 'text/calendar');
};

export const exportToCSV = (items) => {
	const headers = ['ID', 'Title', 'Description', 'Lane', 'Priority', 'Story Points', 'Created', 'Due Date'];
	const rows = items.map(i => [i.id, escapeCSV(i.title), escapeCSV(i.description), i.lane, i.priority, i.points, i.createdAt, i.dueDate || '']);
	const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\r\n');
	downloadFile(csv, `kanban-export-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
};

export const shareItem = (item) => {
	if (!navigator.share) return alert('Web Share API is not supported in this browser');
	navigator.share({
		title: item.title,
		text: `${item.title}\n\n${item.description || ''}\n\nLane: ${item.lane}\nPriority: ${item.priority}\nStory Points: ${item.points}`,
		url: window.location.href
	}).catch(() => {});
};

const getPriorityNumber = (p) => ({ Low: 9, Medium: 5, High: 3, Critical: 1 }[p] || 5);
const escapeCSV = (str) => String(str || '').replace(/"/g, '""');
const sanitizeFilename = (name) => name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
const downloadFile = (content, filename, mimeType) => {
	const link = Object.assign(document.createElement('a'), {
		href: URL.createObjectURL(new Blob([content], { type: mimeType })),
		download: filename
	});
	link.click();
	URL.revokeObjectURL(link.href);
};