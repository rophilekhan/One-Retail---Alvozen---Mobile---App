import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

/**
 * Google Maps API Key
 * Loaded securely from environment variables.
 * In development/production, set GOOGLE_MAPS_API_KEY in your local environment or .env.
 * NEVER commit hardcoded secret keys to version control.
 */
export const GOOGLE_MAPS_API_KEY =
  (typeof process !== 'undefined' && process.env?.GOOGLE_MAPS_API_KEY) || '';

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
 * Requests location permission across iOS and Android
 * @returns {Promise<boolean>}
 */
export const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      return (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED ||
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return false;
  } catch (err) {
    console.warn('[geocodingService] requestLocationPermission error:', err);
    return false;
  }
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
  return {
    latitude: parseFloat(match[1]),
    longitude: parseFloat(match[2]),
  };
};

/**
 * Reverse geocodes latitude and longitude to a human-readable street address.
 * Primary: Google Maps Geocoding API
 * Fallback: OpenStreetMap Nominatim
 *
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<{ formattedAddress: string, area: string, city: string, postalCode: string, latitude: number, longitude: number }>}
 */
export const reverseGeocode = async (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    return {
      formattedAddress: '',
      area: '',
      city: '',
      postalCode: '',
      latitude: 0,
      longitude: 0,
    };
  }

  // 1. Try Google Maps Geocoding API if key is available
  if (GOOGLE_MAPS_API_KEY) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && Array.isArray(data.results) && data.results.length > 0) {
        let cleanAddress = null;
        let matchedResult = data.results[0];

        // Find first result that does not start with a plus code
        for (const res of data.results) {
          const addr = (res.formatted_address || '').trim();
          if (addr && !/^[A-Z0-9]{4,8}\+[A-Z0-9]{2,4}/i.test(addr)) {
            cleanAddress = addr;
            matchedResult = res;
            break;
          }
        }

        // If all started with plus codes, strip the plus code prefix from the first result
        if (!cleanAddress) {
          const first = (data.results[0].formatted_address || '').trim();
          cleanAddress = first.replace(/^[A-Z0-9]{4,8}\+[A-Z0-9]{2,4},\s*/i, '').trim();
          matchedResult = data.results[0];
        }

        // Parse address components
        let area = '';
        let city = '';
        let postalCode = '';

        if (Array.isArray(matchedResult?.address_components)) {
          for (const comp of matchedResult.address_components) {
            const types = comp.types || [];
            if (types.includes('sublocality') || types.includes('sublocality_level_1') || types.includes('neighborhood')) {
              area = comp.long_name || comp.short_name || area;
            }
            if (types.includes('locality') || types.includes('administrative_area_level_2')) {
              city = comp.long_name || comp.short_name || city;
            }
            if (types.includes('postal_code')) {
              postalCode = comp.long_name || comp.short_name || postalCode;
            }
          }
        }

        if (cleanAddress) {
          return {
            formattedAddress: cleanAddress,
            area,
            city,
            postalCode,
            latitude: lat,
            longitude: lng,
          };
        }
      }
    } catch (error) {
      console.warn('[geocodingService] Google Geocoding API error:', error?.message);
    }
  }

  // 2. Fallback to OpenStreetMap Nominatim
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const osmResponse = await fetch(osmUrl, {
      headers: {
        'User-Agent': 'OneRetailMobileApp/1.0',
        'Accept-Language': 'en',
      },
    });
    const osmData = await osmResponse.json();
    if (osmData && osmData.display_name) {
      const addrDetails = osmData.address || {};
      return {
        formattedAddress: osmData.display_name,
        area: addrDetails.suburb || addrDetails.neighbourhood || addrDetails.residential || '',
        city: addrDetails.city || addrDetails.town || addrDetails.state || '',
        postalCode: addrDetails.postcode || '',
        latitude: lat,
        longitude: lng,
      };
    }
  } catch (osmError) {
    console.warn('[geocodingService] OSM reverse geocoding error:', osmError?.message);
  }

  // Fallback to coordinates string if all APIs fail
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
 * Searches places, street addresses, or landmarks in Pakistan
 *
 * @param {string} query
 * @returns {Promise<Array<{ title: string, subtitle: string, formattedAddress: string, latitude: number, longitude: number }>>}
 */
export const searchPlacesOrAddress = async (query) => {
  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.trim();

  // 1. Try Google Maps Geocoding API with Pakistan component filter if key is available
  if (GOOGLE_MAPS_API_KEY) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cleanQuery)}&components=country:PK&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && Array.isArray(data.results) && data.results.length > 0) {
        return data.results.slice(0, 5).map((item) => {
          const fullAddr = (item.formatted_address || '').replace(/^[A-Z0-9]{4,8}\+[A-Z0-9]{2,4},\s*/i, '').trim();
          const parts = fullAddr.split(',');
          const title = parts[0]?.trim() || cleanQuery;
          const subtitle = parts.slice(1).join(',').trim() || fullAddr;

          return {
            title,
            subtitle,
            formattedAddress: fullAddr,
            latitude: item.geometry?.location?.lat || 0,
            longitude: item.geometry?.location?.lng || 0,
          };
        });
      }
    } catch (error) {
      console.warn('[geocodingService] Google Search Places error:', error?.message);
    }
  }

  // 2. Fallback to OpenStreetMap Nominatim search
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&countrycodes=pk&limit=5`;
    const osmResponse = await fetch(osmUrl, {
      headers: {
        'User-Agent': 'OneRetailMobileApp/1.0',
        'Accept-Language': 'en',
      },
    });
    const osmData = await osmResponse.json();
    if (Array.isArray(osmData) && osmData.length > 0) {
      return osmData.map((item) => {
        const fullAddr = item.display_name || '';
        const parts = fullAddr.split(',');
        const title = parts[0]?.trim() || cleanQuery;
        const subtitle = parts.slice(1).join(',').trim() || fullAddr;

        return {
          title,
          subtitle,
          formattedAddress: fullAddr,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
        };
      });
    }
  } catch (osmError) {
    console.warn('[geocodingService] OSM Search Places error:', osmError?.message);
  }

  return [];
};

export default {
  GOOGLE_MAPS_API_KEY,
  requestLocationPermission,
  isCoordinatesString,
  parseCoordinatesString,
  reverseGeocode,
  searchPlacesOrAddress,
};
