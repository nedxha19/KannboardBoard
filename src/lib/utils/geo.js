import { GEO_API_TIMEOUT } from '$lib/constants';


const fetchWithTimeout = (url, ms) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(id));
};

const geolocate = (ms) =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      reject(new Error('Geolocation not available'));
      return;
    }
    const timer = setTimeout(() => reject(new Error('Geolocation timeout')), ms);
    navigator.geolocation.getCurrentPosition(
      (pos) => { clearTimeout(timer); resolve(pos.coords); },
      (err) => { clearTimeout(timer); reject(err); },
      { enableHighAccuracy: false, timeout: ms, maximumAge: 60000 }
    );
  });

export const getFlagEmoji = (code) => {
  if (!code || typeof code !== 'string') return '🌍';
  const cc = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return '🌍';
  const a = cc.codePointAt(0);
  const b = cc.codePointAt(1);
  return String.fromCodePoint(127397 + a, 127397 + b);
};

// --- main ------------------------------------------------------------------

export const getUserCountry = async () => {
  try {
    // 1) Try real position (client)
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      try {
        const { latitude, longitude } = await geolocate(GEO_API_TIMEOUT);
        const rev = await fetchWithTimeout(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          GEO_API_TIMEOUT
        ).then((r) => (r.ok ? r.json() : null));

        if (rev && rev.countryCode) {
          const code = String(rev.countryCode).toUpperCase();
          return {
            country: rev.countryName || 'Unknown',
            code,
            flag: getFlagEmoji(code)
          };
        }
      } catch {
        // fall back to IP
      }
    }

    // 2) IP fallback
    const data = await fetchWithTimeout('https://ipapi.co/json/', GEO_API_TIMEOUT)
      .then((res) => (res.ok ? res.json() : null));

    if (data && data.country_code) {
      const code = String(data.country_code).toUpperCase();
      return {
        country: data.country_name || 'Unknown',
        code,
        flag: getFlagEmoji(code)
      };
    }

    return null;
  } catch {
    return null;
  }
};
