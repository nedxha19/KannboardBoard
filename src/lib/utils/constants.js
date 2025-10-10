export const LANES = ['Do', 'Doing', 'Done', 'Archiv'];

export const PRIORITIES = {
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: 'High',
	CRITICAL: 'Critical'
};

export const DEFAULT_PRIORITY = PRIORITIES.MEDIUM;
export const DEFAULT_STORY_POINTS = 1;

export const PRIORITY_STYLES = {
	[PRIORITIES.LOW]: 'ring-emerald-300 text-emerald-700',
	[PRIORITIES.MEDIUM]: 'ring-sky-300 text-sky-700',
	[PRIORITIES.HIGH]: 'ring-amber-300 text-amber-700',
	[PRIORITIES.CRITICAL]: 'ring-rose-300 text-rose-700'
};

export const GEO_API_TIMEOUT = 5000;
export const NOTIFICATION_ICON = '/task-management.png';