import { GEO_API_TIMEOUT } from '$lib/constants';

export const getUserCountry = () =>
	fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(GEO_API_TIMEOUT) })
		.then(res => res.ok ? res.json() : null)
		.then(data => data ? {
			country: data.country_name || 'Unknown',
			code: data.country_code || 'XX',
			flag: getFlagEmoji(data.country_code)
		} : null)
		.catch(() => null);

        const getFlagEmoji = (code) =>
	code?.length === 2 ? String.fromCodePoint(...code.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0))) : '🌍';
