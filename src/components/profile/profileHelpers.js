import { DEFAULT_COORDINATES, parseFiniteCoord } from '../../services/geocodingService.js';

export const safeString = (value, fallback = '') => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || fallback;
  }
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object') {
    const extracted =
      value.name ??
      value.label ??
      value.title ??
      value.formattedAddress ??
      value.username ??
      value.code;
    if (typeof extracted === 'string' && extracted.trim()) {
      return extracted.trim();
    }
  }
  return fallback;
};

export const normalizeLicense = ({
  id,
  title,
  structured,
  flatNumber,
  flatExpiry,
  flatImage,
  fallbackNumber = '',
  fallbackExpiry = '',
  defaultVerified = false,
}) => {
  const obj = structured && typeof structured === 'object' ? structured : {};
  const rawNumber =
    obj.number ??
    (typeof structured === 'string' ? structured : undefined) ??
    flatNumber ??
    '';
  const rawExpiry = obj.expiryDate ?? flatExpiry ?? '';
  const rawImage = obj.imageUri ?? flatImage ?? null;

  const number = safeString(rawNumber, fallbackNumber);
  const expiryDate = safeString(rawExpiry, fallbackExpiry);
  const imageUri =
    typeof rawImage === 'string' && rawImage.trim() ? rawImage.trim() : null;

  const isVerified = Boolean(imageUri || (defaultVerified && number));
  const statusLabel = isVerified
    ? 'Verified'
    : number
      ? 'On File'
      : 'Not Added';

  return { id, title, number, expiryDate, imageUri, isVerified, statusLabel };
};

export const buildPharmacyProfileModel = (pharmacy, user) => {
  const pharmacyName = safeString(
    pharmacy?.name,
    safeString(user?.name, 'City Meds Pharmacy')
  );
  const ownerUsername =
    safeString(
      pharmacy?.ownerUsername,
      safeString(user?.username, 'dr.shahzad_rx')
    ).replace(/^@+/, '') || 'dr.shahzad_rx';
  const territoryLabel = safeString(pharmacy?.territory, 'Karachi Territory');
  const systemMode = safeString(pharmacy?.systemMode, '');
  const isIntegrated =
    Boolean(pharmacy?.isSystemIntegrated) ||
    systemMode.toLowerCase().includes('erp') ||
    systemMode.toLowerCase().includes('integrated');
  const pharmacyCode = safeString(
    pharmacy?.pharmacyCode ?? pharmacy?.pharmacyId,
    'ALV-KHI-0142'
  );
  const addressText = safeString(
    pharmacy?.address ?? pharmacy?.locationPin?.address,
    'Plot 42-B, Commercial Area, Block 6, PECHS, Karachi'
  );

  const parsedLat = parseFiniteCoord(
    pharmacy?.locationPin?.latitude ?? pharmacy?.latitude
  );
  const parsedLng = parseFiniteCoord(
    pharmacy?.locationPin?.longitude ?? pharmacy?.longitude
  );
  const latitude = Number.isFinite(parsedLat)
    ? parsedLat
    : DEFAULT_COORDINATES.latitude;
  const longitude = Number.isFinite(parsedLng)
    ? parsedLng
    : DEFAULT_COORDINATES.longitude;

  const licenses = [
    normalizeLicense({
      id: 'dsl',
      title: 'Drug Sale License (DSL)',
      structured: pharmacy?.dsl,
      flatNumber: pharmacy?.dslNumber,
      flatExpiry: pharmacy?.dslExpiryDate,
      flatImage: pharmacy?.dslPictureUri,
      fallbackNumber: '05-42-01992',
      fallbackExpiry: '31 Dec 2027',
      defaultVerified: true,
    }),
    normalizeLicense({
      id: 'fl1',
      title: 'Further License 1',
      structured: pharmacy?.furtherLicense1,
      flatNumber: pharmacy?.furtherLicense1Number,
      flatExpiry: pharmacy?.furtherLicense1ExpiryDate,
      flatImage: pharmacy?.furtherLicense1PictureUri,
      fallbackNumber: 'FL1-8841-KHI',
      fallbackExpiry: '15 Oct 2026',
    }),
    normalizeLicense({
      id: 'fl2',
      title: 'Further License 2',
      structured: pharmacy?.furtherLicense2,
      flatNumber: pharmacy?.furtherLicense2Number,
      flatExpiry: pharmacy?.furtherLicense2ExpiryDate,
      flatImage: pharmacy?.furtherLicense2PictureUri,
    }),
  ];

  return {
    pharmacyName,
    ownerUsername,
    territoryLabel,
    isIntegrated,
    pharmacyCode,
    addressText,
    latitude,
    longitude,
    licenses,
  };
};
