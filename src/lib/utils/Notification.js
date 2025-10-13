import { NOTIFICATION_ICON } from '$lib/constants';

export const requestNotificationPermission = async () => {
	if (!('Notification' in window)) return false;
	if (Notification.permission === 'granted') return true;
	if (Notification.permission === 'denied') return false;
	const permission = await Notification.requestPermission();
	return permission === 'granted';
};
