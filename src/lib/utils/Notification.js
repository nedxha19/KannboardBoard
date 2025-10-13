import { NOTIFICATION_ICON } from '$lib/constants';

export const requestNotificationPermission = async () => {
	if (!('Notification' in window)) return false;
	if (Notification.permission === 'granted') return true;
	if (Notification.permission === 'denied') return false;
	const permission = await Notification.requestPermission();
	return permission === 'granted';
};

export const showNotification = (title, options = {}) => {
	if (!('Notification' in window) || Notification.permission !== 'granted') return;
	new Notification(title, {
		icon: NOTIFICATION_ICON,
		badge: NOTIFICATION_ICON,
		...options
	});
};
