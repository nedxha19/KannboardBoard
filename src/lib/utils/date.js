import { format, isPast, parseISO, isValid } from 'date-fns';

export const formatDueDate = (isoDate) => {
	if (!isoDate) return '';
	const date = parseISO(isoDate);
	return isValid(date) ? format(date, 'MMM d · HH:mm') : '';
};

export const isOverdue = (dueDate) => {
	if (!dueDate) return false;
	const date = parseISO(dueDate);
	return isValid(date) && isPast(date);
};
