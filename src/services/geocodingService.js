import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

/**
 * Default fallback region centered on Saddar Town, Karachi
 */
export const DEFAULT_COORDINATES = {
  latitude: 24.8607,
  longitude: 67.0011,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

const NOMINATIM_HEADERS = {
  'User-Agent': 'OneRetailApp/1.0',
  'Accept-Language': 'en',
};

export const parseFiniteCoord = (value) => {
  if (value === null || value === undefined || value === '' || typeof value === 'boolean') {
    return NaN;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : NaN;
};

const PAKISTAN_NEIGHBORHOODS = [
  { title: 'Gulshan-e-Iqbal Block 13-A', area: 'Gulshan-e-Iqbal', city: 'Karachi', latitude: 24.918, longitude: 67.097 },
  { title: 'DHA Phase 6, Shahbaz Commercial', area: 'DHA Phase 6', city: 'Karachi', latitude: 24.806, longitude: 67.065 },
  { title: 'DHA Phase 5, Khayaban-e-Shahbaz', area: 'DHA Phase 5', city: 'Karachi', latitude: 24.8025, longitude: 67.0472 },
  { title: 'Clifton Block 4, Boat Basin', area: 'Clifton', city: 'Karachi', latitude: 24.823, longitude: 67.031 },
  { title: 'Bahadurabad Chowrangi, KMCHS', area: 'Bahadurabad', city: 'Karachi', latitude: 24.8825, longitude: 67.0681 },
  { title: 'PECHS Block 2, Tariq Road', area: 'PECHS', city: 'Karachi', latitude: 24.8716, longitude: 67.0598 },
  { title: 'Saddar Town, M.A. Jinnah Road', area: 'Saddar', city: 'Karachi', latitude: 24.8607, longitude: 67.0011 },
  { title: 'North Nazimabad Block H', area: 'North Nazimabad', city: 'Karachi', latitude: 24.9389, longitude: 67.0439 },
  { title: 'Main Boulevard, Gulberg III', area: 'Gulberg III', city: 'Lahore', latitude: 31.5204, longitude: 74.3587 },
  { title: 'DHA Phase 5, Sector C', area: 'DHA Phase 5', city: 'Lahore', latitude: 31.4676, longitude: 74.4079 },
  { title: 'Model Town Link Road', area: 'Model Town', city: 'Lahore', latitude: 31.4839, longitude: 74.3258 },
  { title: 'Johar Town Block G', area: 'Johar Town', city: 'Lahore', latitude: 31.4697, longitude: 74.2728 },
  { title: 'Blue Area, Jinnah Avenue', area: 'Blue Area', city: 'Islamabad', latitude: 33.7077, longitude: 73.0498 },
  { title: 'F-7 Markaz, Jinnah Super', area: 'F-7', city: 'Islamabad', latitude: 33.7215, longitude: 73.0561 },
];

const findNearestNeighborhood = (lat, lng, maxDegDelta = 0.08) => {
  let best = null;
  let bestDistSq = maxDegDelta * maxDegDelta;
  for (const item of PAKISTAN_NEIGHBORHOODS) {
    const dLat = item.latitude - lat;
    const dLng = item.longitude - lng;
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq <= bestDistSq) {
      bestDistSq = distSq;
      best = item;
    }
  }
  return best;
};

export const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#131B24' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8898AA' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0F161E' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#2B394A' }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#2B394A' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#0D141C' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1C2735' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#5C748D' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#102636' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#243346' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#7E91A6' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1A5360' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#123D47' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#8BE4ED' }] },
  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#7E91A6' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#091018' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3E566E' }] },
];

/**
 * Requests location permission across iOS and Android with blocked status detection
 * @returns {Promise<{ granted: boolean, status: 'granted' | 'denied' | 'blocked' }>}
 */
export const requestLocationPermissionStatus = async () => {
  try {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        return { granted: true, status: 'granted' };
      }
      if (auth === 'denied' || auth === 'restricted') {
        return { granted: false, status: 'blocked' };
      }
      return { granted: false, status: 'denied' };
    }
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      const fine = granted?.[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
      const coarse = granted?.[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION];

      if (
        fine === PermissionsAndroid.RESULTS.GRANTED ||
        coarse === PermissionsAndroid.RESULTS.GRANTED ||
        fine === 'granted' ||
        coarse === 'granted'
      ) {
        return { granted: true, status: 'granted' };
      }
      if (
        fine === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN &&
        coarse === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
        return { granted: false, status: 'blocked' };
      }
      return { granted: false, status: 'denied' };
    }
    return { granted: false, status: 'denied' };
  } catch (err) {
    console.warn('[geocodingService] requestLocationPermission error:', err);
    return { granted: false, status: 'denied' };
  }
};

/**
 * Requests location permission across iOS and Android
 * @returns {Promise<boolean>}
 */
export const requestLocationPermission = async () => {
  const result = await requestLocationPermissionStatus();
  return result.granted;
};

/**
 * Checks if a string is in raw coordinates format (e.g. "24.90952, 67.08328")
 */
export const isCoordinatesString = (text) => {
  if (!text || typeof text !== 'string') return false;
  return /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/.test(text.trim());
};

/**
 * Parses raw coordinates string into { latitude, longitude } floats
 */
export const parseCoordinatesString = (text) => {
  if (!text || typeof text !== 'string') return null;
  const match = text.trim().match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const latitude = parseFiniteCoord(match[1]);
  const longitude = parseFiniteCoord(match[2]);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return { latitude, longitude };
};

/**
 * Reverse geocodes latitude and longitude to a human-readable street address.
 * Keyless HTTPS flow:
 * 1. OpenStreetMap Nominatim (User-Agent: OneRetailApp/1.0)
 * 2. Local Pakistan/Karachi neighborhood lookup -> deterministic coordinate string
 *
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<{ formattedAddress: string, area: string, city: string, postalCode: string, latitude: number, longitude: number }>}
 */
export const reverseGeocode = async (latitude, longitude) => {
  const lat = parseFiniteCoord(latitude);
  const lng = parseFiniteCoord(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return {
      formattedAddress: '',
      area: '',
      city: '',
      postalCode: '',
      latitude: 0,
      longitude: 0,
    };
  }

  // 1. Query OpenStreetMap Nominatim HTTPS endpoint (no JS API key required)
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;
    const osmResponse = await fetch(osmUrl, {
      headers: NOMINATIM_HEADERS,
    });
    if (osmResponse?.ok !== false) {
      const osmData = await osmResponse.json();
      if (osmData && osmData.display_name) {
        const addrDetails = osmData.address || {};
        return {
          formattedAddress: osmData.display_name,
          area:
            addrDetails.suburb ||
            addrDetails.neighbourhood ||
            addrDetails.city_district ||
            addrDetails.residential ||
            '',
          city: addrDetails.city || addrDetails.town || addrDetails.state_district || addrDetails.state || '',
          postalCode: addrDetails.postcode || '',
          latitude: lat,
          longitude: lng,
        };
      }
    }
  } catch (osmError) {
    console.warn('[geocodingService] OSM reverse geocoding error:', osmError?.message);
  }

  // 2. Fallback to local Karachi / Pakistan neighborhood lookup
  const nearest = findNearestNeighborhood(lat, lng);
  if (nearest) {
    return {
      formattedAddress: `Near ${nearest.area}, ${nearest.city} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      area: nearest.area,
      city: nearest.city,
      postalCode: '',
      latitude: lat,
      longitude: lng,
    };
  }

  // 3. Final deterministic coordinate string fallback
  return {
    formattedAddress: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    area: '',
    city: '',
    postalCode: '',
    latitude: lat,
    longitude: lng,
  };
};

/**
 * Searches places, street addresses, or landmarks in Pakistan without requiring a JS Google API key.
 * 1. OpenStreetMap Nominatim HTTPS search (User-Agent: OneRetailApp/1.0)
 * 2. Local Karachi / Pakistan neighborhood lookup fallback
 *
 * @param {string} query
 * @returns {Promise<Array<{ title: string, subtitle: string, formattedAddress: string, latitude: number, longitude: number }>>}
 */
export const searchPlacesOrAddress = async (query) => {
  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.trim();

  // 1. OpenStreetMap Nominatim search
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(cleanQuery)}&countrycodes=pk&addressdetails=1&limit=5`;
    const osmResponse = await fetch(osmUrl, {
      headers: NOMINATIM_HEADERS,
    });
    if (osmResponse?.ok !== false) {
      const osmData = await osmResponse.json();
      if (Array.isArray(osmData) && osmData.length > 0) {
        const parsed = osmData
          .map((item) => {
            const fullAddr = item.display_name || '';
            const parts = fullAddr.split(',');
            const title = parts[0]?.trim() || cleanQuery;
            const subtitle = parts.slice(1).join(',').trim() || fullAddr;
            const lat = parseFiniteCoord(item.lat);
            const lng = parseFiniteCoord(item.lon);

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

            return {
              title,
              subtitle,
              formattedAddress: fullAddr,
              latitude: lat,
              longitude: lng,
            };
          })
          .filter(Boolean);
        if (parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (osmError) {
    console.warn('[geocodingService] OSM Search Places error:', osmError?.message);
  }

  // 2. Fallback to local Pakistan / Karachi neighborhoods
  const lower = cleanQuery.toLowerCase();
  const neighborhoodMatches = PAKISTAN_NEIGHBORHOODS.filter(
    (item) =>
      item.title.toLowerCase().includes(lower) ||
      item.area.toLowerCase().includes(lower) ||
      item.city.toLowerCase().includes(lower)
  )
    .slice(0, 5)
    .map((item) => ({
      title: item.title,
      subtitle: `${item.area}, ${item.city}`,
      formattedAddress: `${item.title}, ${item.city}`,
      latitude: item.latitude,
      longitude: item.longitude,
    }));

  return neighborhoodMatches;
};

export default {
  DEFAULT_COORDINATES,
  requestLocationPermissionStatus,
  requestLocationPermission,
  isCoordinatesString,
  parseCoordinatesString,
  reverseGeocode,
  searchPlacesOrAddress,
};
