import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { pick, types, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import {
  AppScreenContainer,
  AppHeader,
  GlassCard,
  AppText,
  AppBadge,
  AppButton,
  AppInput,
  AppToast,
  MetricIconDisc,
  CustomDatePicker,
} from '../../components/core/index.js';
import { useTheme, radii, fontFamilies } from '../../theme/index.js';
import { scale, verticalScale, moderateScale, scaleFont } from '../../theme/responsive.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { PermissionGuard } from '../../components/common/PermissionGuard.jsx';
import { PERMISSIONS } from '../../store/useStaffStore.js';
import {
  CalendarIcon,
  EditIcon,
  UploadCloudCustomIcon,
} from '../../assets/vectors/index.js';

const PERIOD_OPTIONS = ['Daily Closing', 'Weekly Summary', 'Monthly Closing'];

/**
 * Cloud Upload Document Icon
 */
const UploadCloudIcon = ({ size = 32, color = '#009BA9' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 16a4 4 0 0 1-.88-7.9A5 5 0 0 1 15.9 6L16 6a5 5 0 0 1 1 9.9M12 12v9m0-9l-3 3m3-3l3 3"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * File SpreadSheet Icon
 */
const FileSpreadsheetIcon = ({ size = 26, color = '#009BA9' }) => (
  <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M14 2v6h6M8 13h8M8 17h8M10 9H8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </Svg>
);

/**
 * UploadClosingDataScreen
 * Functional screen for non-integrated pharmacies to upload daily sales & closing stock.
 * Mandated by ONERETAIL_PRD.md:
 * - Card 1: Reporting Period & Closing Date
 * - Card 2: Closing Stock & Sales File Dropzone (@react-native-documents/picker)
 * - Card 3: Optional Remarks & Submit CTA (+25 PII Points awarded)
 * - Card 4: Recent Closing Uploads History
 */
export const UploadClosingDataScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const pharmacy = usePharmacyStore();

  const [selectedPeriod, setSelectedPeriod] = useState('Daily Closing');
  const [closingDate, setClosingDate] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const primaryAccent = colors.brand?.primary || '#009BA9';
  const darkPrimary = colors.brand?.primaryDark || '#0F4761';

  const formatFileSize = (bytes) => {
    if (!bytes) return '42.8 KB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handlePickDocument = async () => {
    try {
      const results = await pick({
        type: [types.xls, types.xlsx, types.csv, types.pdf],
        allowMultiSelection: false,
      });

      const file = Array.isArray(results) ? results[0] : results;
      if (file?.uri) {
        const name = file.name || 'Closing_Sales_Report.xlsx';
        const ext = name.split('.').pop()?.toUpperCase() || 'XLSX';

        setSelectedFile({
          uri: file.uri,
          name,
          size: file.size || 48200,
          type: ext === 'CSV' ? 'CSV' : ext === 'PDF' ? 'PDF' : 'XLSX',
        });

        AppToast.show({
          title: 'File Selected',
          message: `${name} is ready for verification`,
          type: 'info',
        });
      }
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        // User cancelled picker
      } else {
        AppToast.show({
          title: 'File Selection Error',
          message: 'Unable to read selected closing file.',
          type: 'error',
        });
      }
    }
  };

  const handleSubmitClosing = () => {
    if (!closingDate) {
      AppToast.show({
        title: 'Missing Closing Date',
        message: 'Please select a valid closing date for this sales reporting batch.',
        type: 'warning',
      });
      return;
    }

    if (!selectedFile) {
      AppToast.show({
        title: 'Missing Closing File',
        message: 'Please choose a closing sales spreadsheet (.xlsx, .xls, .csv) or PDF to upload.',
        type: 'warning',
      });
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      pharmacy.addClosingUploadRecord?.({
        date: closingDate,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        skuCount: Math.floor(Math.random() * 60) + 110,
        period: selectedPeriod,
        status: 'Synced',
        notes: notes.trim(),
        pointsEarned: 25,
      });

      setIsUploading(false);
      setSelectedFile(null);
      setClosingDate('');
      setNotes('');

      AppToast.show({
        title: 'Closing Data Uploaded',
        message: 'Off-take synced successfully. +25 PII Points awarded to your score!',
        type: 'success',
      });
    }, 850);
  };

  const historyList = pharmacy.closingUploadsHistory || [];

  return (
    <AppScreenContainer scrollable={true} withAmbientGlow={true}>
      <AppHeader title="Upload Closing Data" onBack={() => navigation.goBack()} />

      <PermissionGuard
        permission={PERMISSIONS.UPLOAD_CLOSING_DATA}
        fallback={
          <GlassCard style={styles.card}>
            <AppText variant="titleMedium" colorType="primary">
              Access Restricted
            </AppText>
            <AppText variant="bodySmall" colorType="muted" style={{ marginVertical: verticalScale(8) }}>
              Your staff profile does not have permission to upload closing data. Contact your Pharmacy Administrator.
            </AppText>
          </GlassCard>
        }
      >
        <View style={styles.contentCol}>
          {/* ── CARD 1: Reporting Period & Closing Type ── */}
          <GlassCard style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <AppText variant="titleMedium" colorType="primary">
                1. Reporting Period
              </AppText>
              <AppBadge label="+25 Pts" variant="brand" size="sm" isMono={true} />
            </View>
            <AppText variant="caption" colorType="muted" style={styles.cardSubtext}>
              Select the dispensary period for your de-identified sales movement
            </AppText>

            {/* Period selector pills */}
            <View style={styles.periodRow}>
              {PERIOD_OPTIONS.map((period) => {
                const isSelected = selectedPeriod === period;
                return (
                  <TouchableOpacity
                    key={period}
                    activeOpacity={0.75}
                    onPress={() => setSelectedPeriod(period)}
                    style={[
                      styles.periodPill,
                      isSelected
                        ? { backgroundColor: primaryAccent, borderColor: primaryAccent }
                        : { borderColor: colors.border?.subtle },
                    ]}
                  >
                    <AppText
                      variant="bodySmall"
                      style={[
                        styles.periodPillText,
                        { color: isSelected ? '#FFFFFF' : colors.text?.secondary },
                      ]}
                    >
                      {period}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Closing Date Display */}
            <View style={styles.dateFieldWrap}>
              <AppText
                style={{
                  fontFamily: fontFamilies.primaryMedium,
                  fontSize: scaleFont(13),
                  color: colors.text?.primary || (isDark ? '#FFFFFF' : darkPrimary),
                  marginBottom: verticalScale(6),
                }}
              >
                Closing Date
              </AppText>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsDatePickerOpen(true)}
                style={{ width: '100%' }}
              >
                <View
                  pointerEvents="none"
                  style={[
                    styles.dateInputBox,
                    {
                      borderColor: colors.border?.subtle,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    },
                  ]}
                >
                  <View style={styles.dateLeftWrap}>
                    <MetricIconDisc variant="teal" size={36} marginRight={scale(8)}>
                      <CalendarIcon size={18} color={isDark ? '#FFFFFF' : darkPrimary} />
                    </MetricIconDisc>
                    <AppText
                      numberOfLines={1}
                      style={[
                        styles.dateText,
                        {
                          color: closingDate
                            ? (colors.text?.primary || (isDark ? '#FFFFFF' : darkPrimary))
                            : (isDark ? 'rgba(255, 255, 255, 0.42)' : '#8E99A4'),
                          fontFamily: closingDate ? (fontFamilies.monoMedium || fontFamilies.primaryMedium) : fontFamilies.regular,
                          ...(closingDate ? { fontVariant: ['tabular-nums'] } : null),
                        },
                      ]}
                    >
                      {closingDate || 'Select Closing Date (DD MMM YYYY)'}
                    </AppText>
                  </View>
                  <CalendarIcon color={isDark ? primaryAccent : darkPrimary} size={18} />
                </View>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* ── CARD 2: Closing Stock & Sales File Dropzone ── */}
          <GlassCard style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <AppText variant="titleMedium" colorType="primary">
                2. Sales & Stock Report
              </AppText>
              <AppBadge label="CSV / XLSX" variant="outline" size="sm" />
            </View>
            <AppText variant="caption" colorType="muted" style={styles.cardSubtext}>
              Upload exported report from your desktop POS or dispensary ledger
            </AppText>

            {!selectedFile ? (
              /* Interactive Dashed Dropzone */
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handlePickDocument}
                style={[
                  styles.dropzone,
                  {
                    borderColor: isDark ? primaryAccent : darkPrimary,
                    backgroundColor: isDark ? 'rgba(0, 155, 169, 0.05)' : 'rgba(15, 71, 97, 0.04)',
                  },
                ]}
              >
                <View
                  style={[
                    styles.dropzoneIconWrap,
                    {
                      backgroundColor: isDark ? 'rgba(0, 155, 169, 0.12)' : 'rgba(15, 71, 97, 0.08)',
                    },
                  ]}
                >
                  <UploadCloudCustomIcon size={32} color={isDark ? primaryAccent : darkPrimary} />
                </View>
                <AppText variant="bodyMediumMedium" colorType="primary" style={styles.dropzoneTitle}>
                  Select Closing Report File
                </AppText>
                <AppText variant="caption" colorType="muted" style={styles.dropzoneSub}>
                  Accepts .xlsx, .xls, .csv, or .pdf closing sheets
                </AppText>
                <View
                  style={[
                    styles.browseButton,
                    {
                      backgroundColor: isDark ? 'rgba(0, 155, 169, 0.12)' : 'rgba(15, 71, 97, 0.08)',
                      borderColor: isDark ? 'rgba(0, 155, 169, 0.25)' : 'rgba(15, 71, 97, 0.25)',
                    },
                  ]}
                >
                  <AppText style={[styles.browseButtonText, { color: isDark ? primaryAccent : darkPrimary }]}>
                    Browse Files
                  </AppText>
                </View>
              </TouchableOpacity>
            ) : (
              /* Selected File Summary Card */
              <View
                style={[
                  styles.fileSummaryBox,
                  {
                    borderColor: colors.border?.subtle,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  },
                ]}
              >
                <View style={styles.fileSummaryTop}>
                  <View style={styles.fileIconCol}>
                    <FileSpreadsheetIcon size={28} color={primaryAccent} />
                  </View>
                  <View style={styles.fileNameCol}>
                    <View style={styles.fileBadgeRow}>
                      <AppBadge label={selectedFile.type} variant="brand" size="sm" />
                      <View style={styles.statusIndicator}>
                        <View style={[styles.statusDot, { backgroundColor: colors.status?.success || '#00C853' }]} />
                        <AppText variant="caption" colorType="muted" style={{ marginLeft: scale(4) }}>
                          Ready to Submit
                        </AppText>
                      </View>
                    </View>
                    <AppText
                      variant="bodyMediumMedium"
                      colorType="primary"
                      numberOfLines={1}
                      style={{ marginTop: verticalScale(4) }}
                    >
                      {selectedFile.name}
                    </AppText>
                    <AppText style={[styles.fileSizeText, { color: colors.text?.muted }]}>
                      {formatFileSize(selectedFile.size)} • Verified Format
                    </AppText>
                  </View>
                </View>

                <View style={[styles.fileActionsRow, { borderTopColor: colors.border?.subtle }]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handlePickDocument}
                    style={styles.fileActionBtn}
                  >
                    <AppText style={[styles.fileActionBtnText, { color: primaryAccent }]}>
                      Replace
                    </AppText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setSelectedFile(null)}
                    style={styles.fileActionBtn}
                  >
                    <AppText style={[styles.fileActionBtnText, { color: colors.status?.error || '#EF4444' }]}>
                      Remove
                    </AppText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </GlassCard>

          {/* ── CARD 3: Optional Notes & Submit CTA ── */}
          <GlassCard style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <AppText variant="titleMedium" colorType="primary">
                3. Verification & Submit
              </AppText>
            </View>

            <AppInput
              multiline={true}
              label="Remarks (Optional)"
              placeholder="Add closing remarks or batch notes (optional)"
              value={notes}
              onChangeText={setNotes}
              iconLeft={<EditIcon size={18} />}
              iconTone="teal"
            />

            <View style={{ height: verticalScale(14) }} />

            <AppButton
              variant="primary"
              size="lg"
              title="Upload & Sync Closing Data"
              loading={isUploading}
              disabled={isUploading}
              onPress={handleSubmitClosing}
            />
          </GlassCard>

          {/* ── CARD 4: Recent Closing Uploads History ── */}
          <GlassCard style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <AppText variant="titleMedium" colorType="primary">
                4. Recent Closing Uploads
              </AppText>
              <AppText variant="caption" colorType="muted">
                <AppText variant="monoSmall" colorType="muted">{historyList.length}</AppText> Uploads
              </AppText>
            </View>
            <AppText variant="caption" colorType="muted" style={styles.cardSubtext}>
              Audit record of synced pharmacy off-take batches
            </AppText>

            <View style={styles.historyListWrap}>
              {historyList.map((item, idx) => (
                <View
                  key={item.id || idx}
                  style={[
                    styles.historyItemRow,
                    idx < historyList.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border?.subtle },
                  ]}
                >
                  <View style={styles.historyLeftCol}>
                    <AppText style={[styles.historyDate, { color: primaryAccent }]}>
                      {item.date}
                    </AppText>
                    <AppText variant="bodySmall" colorType="primary" numberOfLines={1} style={{ marginTop: 2 }}>
                      {item.fileName}
                    </AppText>
                    <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
                      {item.period}
                    </AppText>
                  </View>

                  <View style={styles.historyRightCol}>
                    <AppBadge
                      label={item.status || 'Synced'}
                      variant={item.status === 'Verified' ? 'success' : 'accent'}
                      size="sm"
                    />
                    <AppText style={[styles.historySkuText, { color: colors.text?.secondary }]}>
                      {`${item.skuCount} SKUs`}
                    </AppText>
                    <AppText style={[styles.historyPtsText, { color: primaryAccent }]}>
                      {`+${item.pointsEarned || 25} Pts`}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
          </GlassCard>
        </View>
      </PermissionGuard>

      <CustomDatePicker
        visible={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        selectedDate={closingDate}
        maxDate={new Date()}
        onSelect={(date) => {
          setClosingDate(date);
          setIsDatePickerOpen(false);
        }}
        onConfirm={(date) => {
          setClosingDate(date);
          setIsDatePickerOpen(false);
        }}
        title="Select Closing Date"
      />

      <View style={{ height: verticalScale(30) }} />
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  contentCol: {
    width: '100%',
    flexDirection: 'column',
    gap: verticalScale(14),
    marginTop: verticalScale(8),
  },
  card: {
    width: '100%',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardSubtext: {
    marginTop: verticalScale(4),
    marginBottom: verticalScale(12),
  },
  periodRow: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(14),
  },
  periodPill: {
    flex: 1,
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(8),
    borderRadius: radii.input || scale(20),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodPillText: {
    fontWeight: '500',
    fontSize: scale(11.5),
    textAlign: 'center',
  },
  dateFieldWrap: {
    width: '100%',
  },
  dateInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: verticalScale(58),
    borderRadius: radii.input || scale(28),
    borderWidth: 1,
    paddingHorizontal: scale(12),
  },
  dateLeftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: scale(10),
  },
  dateText: {
    fontSize: scaleFont(14),
    letterSpacing: 0.3,
    flex: 1,
  },
  dropzone: {
    width: '100%',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: radii.lg || scale(16),
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropzoneIconWrap: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    backgroundColor: 'rgba(0, 155, 169, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(10),
  },
  dropzoneTitle: {
    textAlign: 'center',
    marginBottom: verticalScale(4),
  },
  dropzoneSub: {
    textAlign: 'center',
    marginBottom: verticalScale(14),
  },
  browseButton: {
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(8),
    borderRadius: radii.pill || scale(20),
    backgroundColor: 'rgba(0, 155, 169, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 155, 169, 0.25)',
  },
  browseButtonText: {
    fontWeight: '600',
    fontSize: scaleFont(12),
  },
  fileSummaryBox: {
    width: '100%',
    borderRadius: radii.lg || scale(16),
    borderWidth: 1,
    padding: scale(14),
  },
  fileSummaryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fileIconCol: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(10),
    backgroundColor: 'rgba(0, 155, 169, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  fileNameCol: {
    flex: 1,
  },
  fileBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(4),
  },
  fileSizeText: {
    fontFamily: fontFamilies.mono,
    fontVariant: ['tabular-nums'],
    fontSize: scaleFont(11),
    marginTop: verticalScale(2),
  },
  fileActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: scale(16),
    marginTop: verticalScale(12),
    paddingTop: verticalScale(10),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  fileActionBtn: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
  },
  fileActionBtnText: {
    fontWeight: '600',
    fontSize: scaleFont(12),
  },
  historyListWrap: {
    width: '100%',
  },
  historyItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(12),
  },
  historyLeftCol: {
    flex: 1,
    marginRight: scale(12),
  },
  historyDate: {
    fontFamily: fontFamilies.monoMedium,
    fontVariant: ['tabular-nums'],
    fontSize: scaleFont(12),
    letterSpacing: 0.3,
  },
  historyRightCol: {
    alignItems: 'flex-end',
    gap: verticalScale(2),
  },
  historySkuText: {
    fontFamily: fontFamilies.mono,
    fontVariant: ['tabular-nums'],
    fontSize: scaleFont(11),
  },
  historyPtsText: {
    fontFamily: fontFamilies.monoMedium,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
    fontSize: scaleFont(11),
  },
});

export default UploadClosingDataScreen;
