import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, Pressable, TextInput, Keyboard } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { AppText } from './AppText.jsx';
import { AppModal } from './AppModal.jsx';
import { AppButton } from './AppButton.jsx';

const ITEM_HEIGHT = verticalScale(48);

// Static datasets to avoid re-allocation on every render cycle
const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CURRENT_YEAR = new Date().getFullYear();

/**
 * Helper to resolve month from either number string ("1".."12", "01".."12") or name ("Jan", "au", "August")
 */
const resolveMonth = (input) => {
  if (!input) return null;
  const clean = input.trim().toLowerCase();

  // 1. Numeric month (1 to 12 or 01 to 12)
  const num = parseInt(clean, 10);
  if (!isNaN(num) && num >= 1 && num <= 12) {
    return MONTHS[num - 1];
  }

  // 2. Exact match (case-insensitive)
  const exact = MONTHS.find((m) => m.toLowerCase() === clean);
  if (exact) return exact;

  // 3. Prefix match (e.g. "au" -> "Aug", "s" -> "Sep", "d" -> "Dec")
  const prefix = MONTHS.find((m) => m.toLowerCase().startsWith(clean));
  if (prefix) return prefix;

  return null;
};

/**
 * WheelItem - Memoized single row item to prevent re-rendering unaffected items on scroll
 */
const WheelItem = React.memo(
  ({ item, actualIndex, isActive, activeColor, fadedColor, onItemPress }) => {
    if (item === '') {
      return <View style={styles.itemWrapper} />;
    }

    return (
      <Pressable
        onPress={() => onItemPress(actualIndex)}
        style={styles.itemWrapper}
        hitSlop={{ top: verticalScale(2), bottom: verticalScale(2), left: scale(6), right: scale(6) }}
      >
        <AppText
          numberOfLines={1}
          style={[
            isActive ? styles.itemActive : styles.itemFaded,
            { color: isActive ? activeColor : fadedColor },
          ]}
        >
          {item}
        </AppText>
      </Pressable>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item === nextProps.item &&
      prevProps.isActive === nextProps.isActive &&
      prevProps.activeColor === nextProps.activeColor &&
      prevProps.fadedColor === nextProps.fadedColor
    );
  }
);

/**
 * CustomWheel - High performance, smooth wheel column with momentum snapping
 */
const CustomWheel = ({
  data,
  selectedValue,
  onValueChange,
  visible,
  onActiveItemPress,
  onScrollBeginDrag: onExternalDrag,
}) => {
  const { colors } = useTheme();
  const flatListRef = useRef(null);
  const isUserInteracting = useRef(false);
  const settleTimerRef = useRef(null);
  const pressTimerRef = useRef(null);
  const lastOffsetRef = useRef(0);
  const selectedValueRef = useRef(selectedValue);

  const initialIndexRef = useRef(Math.max(0, data.indexOf(selectedValue)));
  const [activeIndex, setActiveIndex] = useState(initialIndexRef.current);
  const activeIndexRef = useRef(initialIndexRef.current);

  const paddedData = useMemo(() => ['', ...data, ''], [data]);

  const clampIndex = useCallback(
    (index) => Math.max(0, Math.min(index, data.length - 1)),
    [data.length]
  );

  const updateActive = useCallback((index) => {
    if (index !== activeIndexRef.current) {
      activeIndexRef.current = index;
      setActiveIndex(index);
    }
  }, []);

  const commitSelection = useCallback(
    (index) => {
      const clamped = clampIndex(index);
      updateActive(clamped);
      const item = data[clamped];
      if (item !== undefined && item !== selectedValueRef.current) {
        selectedValueRef.current = item;
        onValueChange?.(item);
      }
    },
    [data, clampIndex, updateActive, onValueChange]
  );

  const clearSettleTimer = useCallback(() => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  const finalizeScroll = useCallback(() => {
    clearSettleTimer();
    const y = lastOffsetRef.current;
    const idx = clampIndex(Math.round(y / ITEM_HEIGHT));
    isUserInteracting.current = false;
    if (Math.abs(y - idx * ITEM_HEIGHT) > 1) {
      flatListRef.current?.scrollToOffset({
        offset: idx * ITEM_HEIGHT,
        animated: true,
      });
    }
    commitSelection(idx);
  }, [clampIndex, clearSettleTimer, commitSelection]);

  const handleScroll = useCallback(
    (e) => {
      const y = e.nativeEvent.contentOffset.y;
      lastOffsetRef.current = y;
      updateActive(clampIndex(Math.round(y / ITEM_HEIGHT)));
    },
    [clampIndex, updateActive]
  );

  const handleScrollBeginDrag = useCallback(() => {
    isUserInteracting.current = true;
    clearSettleTimer();
    onExternalDrag?.();
  }, [clearSettleTimer, onExternalDrag]);

  const handleScrollEndDrag = useCallback(() => {
    clearSettleTimer();
    settleTimerRef.current = setTimeout(finalizeScroll, 120);
  }, [clearSettleTimer, finalizeScroll]);

  const handleMomentumScrollBegin = useCallback(() => {
    clearSettleTimer();
  }, [clearSettleTimer]);

  const handleMomentumScrollEnd = useCallback(() => {
    finalizeScroll();
  }, [finalizeScroll]);

  const handleItemPress = useCallback(
    (targetIndex) => {
      if (targetIndex < 0 || targetIndex >= data.length) return;
      if (targetIndex === activeIndexRef.current) {
        onActiveItemPress?.();
        return;
      }
      isUserInteracting.current = true;
      lastOffsetRef.current = targetIndex * ITEM_HEIGHT;
      flatListRef.current?.scrollToOffset({
        offset: targetIndex * ITEM_HEIGHT,
        animated: true,
      });
      commitSelection(targetIndex);
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
      pressTimerRef.current = setTimeout(() => {
        isUserInteracting.current = false;
      }, 300);
    },
    [data.length, commitSelection, onActiveItemPress]
  );

  useEffect(() => {
    selectedValueRef.current = selectedValue;
    const index = data.indexOf(selectedValue);
    if (index !== -1 && !isUserInteracting.current && index !== activeIndexRef.current) {
      activeIndexRef.current = index;
      lastOffsetRef.current = index * ITEM_HEIGHT;
      setActiveIndex(index);
      flatListRef.current?.scrollToOffset({
        offset: index * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, [selectedValue, data]);

  useEffect(() => {
    if (!visible) return undefined;
    const index = Math.max(0, data.indexOf(selectedValueRef.current));
    const timer = setTimeout(() => {
      activeIndexRef.current = index;
      lastOffsetRef.current = index * ITEM_HEIGHT;
      setActiveIndex(index);
      flatListRef.current?.scrollToOffset({
        offset: index * ITEM_HEIGHT,
        animated: false,
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    };
  }, []);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const handleScrollToIndexFailed = useCallback((info) => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: info.index * ITEM_HEIGHT,
        animated: false,
      });
    }, 50);
  }, []);

  const keyExtractor = useCallback((item, index) => `${item}-${index}`, []);

  const renderItem = useCallback(
    ({ item, index }) => {
      const actualIndex = index - 1;
      return (
        <WheelItem
          item={item}
          actualIndex={actualIndex}
          isActive={actualIndex === activeIndex}
          activeColor={colors.text.primary}
          fadedColor={colors.text.muted}
          onItemPress={handleItemPress}
        />
      );
    },
    [activeIndex, colors.text.primary, colors.text.muted, handleItemPress]
  );

  return (
    <View style={styles.wheelContainer}>
      <FlatList
        ref={flatListRef}
        style={styles.flatList}
        data={paddedData}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        bounces={false}
        overScrollMode="never"
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="normal"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollBegin={handleMomentumScrollBegin}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={getItemLayout}
        initialScrollIndex={initialIndexRef.current}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        initialNumToRender={25}
        maxToRenderPerBatch={20}
        windowSize={7}
        removeClippedSubviews={false}
        renderItem={renderItem}
      />
    </View>
  );
};

/**
 * CustomDatePicker
 *
 * Smooth wheel-based date picker matching OneRx 1:1.
 * Supports configurable startYear and endYear for both past dates (birth dates)
 * and future dates (drug license expirations).
 */
export const CustomDatePickerWheel = ({
  dobDay,
  setDobDay,
  dobMonth,
  setDobMonth,
  dobYear,
  setDobYear,
  visible,
  startYear = 1970,
  endYear = CURRENT_YEAR + 20,
}) => {
  const { colors, isDark } = useTheme();

  const yearsData = useMemo(() => {
    const s = Number(startYear) || 1970;
    const e = Number(endYear) || CURRENT_YEAR + 20;
    const arr = [];
    for (let y = s; y <= e; y++) {
      arr.push(y.toString());
    }
    return arr;
  }, [startYear, endYear]);

  const [isEditingDay, setIsEditingDay] = useState(false);
  const [isEditingMonth, setIsEditingMonth] = useState(false);
  const [isEditingYear, setIsEditingYear] = useState(false);

  const [dayInput, setDayInput] = useState(dobDay ? String(dobDay) : '');
  const [monthInput, setMonthInput] = useState(dobMonth ? String(dobMonth) : '');
  const [yearInput, setYearInput] = useState(dobYear ? String(dobYear) : '');

  const dayInputRef = useRef(null);
  const monthInputRef = useRef(null);
  const yearInputRef = useRef(null);

  useEffect(() => {
    if (!isEditingDay) {
      setDayInput(dobDay ? String(dobDay) : '');
    }
  }, [dobDay, isEditingDay]);

  useEffect(() => {
    if (!isEditingMonth) {
      setMonthInput(dobMonth ? String(dobMonth) : '');
    }
  }, [dobMonth, isEditingMonth]);

  useEffect(() => {
    if (!isEditingYear) {
      setYearInput(dobYear ? String(dobYear) : '');
    }
  }, [dobYear, isEditingYear]);

  useEffect(() => {
    if (!visible) {
      setIsEditingDay(false);
      setIsEditingMonth(false);
      setIsEditingYear(false);
      Keyboard.dismiss();
    }
  }, [visible]);

  const handleStartEditingDay = () => {
    setIsEditingMonth(false);
    setIsEditingYear(false);
    setDayInput(dobDay ? String(dobDay) : '');
    setIsEditingDay(true);
  };

  const handleStartEditingMonth = () => {
    setIsEditingDay(false);
    setIsEditingYear(false);
    setMonthInput(dobMonth ? String(dobMonth) : '');
    setIsEditingMonth(true);
  };

  const handleStartEditingYear = () => {
    setIsEditingDay(false);
    setIsEditingMonth(false);
    setYearInput(dobYear ? String(dobYear) : '');
    setIsEditingYear(true);
  };

  const handleDayBlur = () => {
    if (dayInput) {
      const num = Math.min(31, Math.max(1, parseInt(dayInput, 10) || 1));
      const formatted = num.toString().padStart(2, '0');
      setDobDay(formatted);
      setDayInput(formatted);
    }
    setIsEditingDay(false);
  };

  const handleMonthBlur = () => {
    if (monthInput) {
      const match = resolveMonth(monthInput);
      if (match) {
        setDobMonth(match);
        setMonthInput(match);
      } else {
        setMonthInput(dobMonth || 'Jan');
      }
    } else {
      setMonthInput(dobMonth || 'Jan');
    }
    setIsEditingMonth(false);
  };

  const handleYearBlur = () => {
    if (yearInput && yearInput.length >= 2) {
      let num = parseInt(yearInput, 10);
      if (num < 100) {
        num = num > (CURRENT_YEAR % 100) ? 1900 + num : 2000 + num;
      }
      const clamped = Math.min(endYear, Math.max(startYear, num));
      const str = clamped.toString();
      setDobYear(str);
      setYearInput(str);
    }
    setIsEditingYear(false);
  };

  const handleWheelScrollStart = () => {
    if (isEditingDay) handleDayBlur();
    if (isEditingMonth) handleMonthBlur();
    if (isEditingYear) handleYearBlur();
    Keyboard.dismiss();
  };

  const handleDayChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setDayInput(cleaned);
    if (cleaned.length === 2) {
      const num = parseInt(cleaned, 10);
      if (num >= 1 && num <= 31) {
        const formatted = num.toString().padStart(2, '0');
        setDobDay(formatted);
        setTimeout(() => {
          setIsEditingDay(false);
          Keyboard.dismiss();
        }, 220);
      }
    } else if (cleaned.length === 1 && parseInt(cleaned, 10) > 3) {
      const padded = `0${cleaned}`;
      setDayInput(padded);
      setDobDay(padded);
      setTimeout(() => {
        setIsEditingDay(false);
        Keyboard.dismiss();
      }, 220);
    }
  };

  const handleMonthChange = (text) => {
    setMonthInput(text);
    if (/^\d{2}$/.test(text)) {
      const match = resolveMonth(text);
      if (match) {
        setDobMonth(match);
        setTimeout(() => {
          setIsEditingMonth(false);
          Keyboard.dismiss();
        }, 220);
        return;
      }
    }
    if (/^[2-9]$/.test(text)) {
      const match = resolveMonth(text);
      if (match) {
        setDobMonth(match);
        setTimeout(() => {
          setIsEditingMonth(false);
          Keyboard.dismiss();
        }, 220);
        return;
      }
    }
    if (text.length >= 3) {
      const match = resolveMonth(text);
      if (match) {
        setDobMonth(match);
        setTimeout(() => {
          setIsEditingMonth(false);
          Keyboard.dismiss();
        }, 220);
      }
    }
  };

  const handleYearChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setYearInput(cleaned);
    if (cleaned.length === 4) {
      const num = parseInt(cleaned, 10);
      const clamped = Math.min(endYear, Math.max(startYear, num));
      const str = clamped.toString();
      setDobYear(str);
      setTimeout(() => {
        setIsEditingYear(false);
        Keyboard.dismiss();
      }, 220);
    }
  };

  const brandPrimary = colors?.brand?.primary || '#009BA9';

  return (
    <View style={[styles.container, { borderColor: colors.border?.default || (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)') }]}>
      {/* Clean Header Row */}
      <View style={styles.headerRow}>
        <AppText style={[styles.headerText, { color: colors.text.secondary }]}>Date</AppText>
        <AppText style={[styles.headerText, { color: colors.text.secondary }]}>Month</AppText>
        <AppText style={[styles.headerText, { color: colors.text.secondary }]}>Year</AppText>
      </View>

      {/* Picker Row */}
      <View style={styles.pickerRow}>
        <CustomWheel
          data={DAYS}
          selectedValue={dobDay}
          onValueChange={setDobDay}
          visible={visible}
          onActiveItemPress={handleStartEditingDay}
          onScrollBeginDrag={handleWheelScrollStart}
        />
        <CustomWheel
          data={MONTHS}
          selectedValue={dobMonth}
          onValueChange={setDobMonth}
          visible={visible}
          onActiveItemPress={handleStartEditingMonth}
          onScrollBeginDrag={handleWheelScrollStart}
        />
        <CustomWheel
          data={yearsData}
          selectedValue={dobYear}
          onValueChange={setDobYear}
          visible={visible}
          onActiveItemPress={handleStartEditingYear}
          onScrollBeginDrag={handleWheelScrollStart}
        />

        {/* Selection Highlight */}
        <View
          pointerEvents="none"
          style={[
            styles.selectionOverlay,
            {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            },
          ]}
        />

        {/* Inline Day Editor */}
        {isEditingDay && (
          <View style={[styles.inlineSlotWrapper, { left: 0 }]}>
            <TextInput
              ref={dayInputRef}
              value={dayInput}
              onChangeText={handleDayChange}
              onBlur={handleDayBlur}
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={() => {
                handleDayBlur();
                Keyboard.dismiss();
              }}
              maxLength={2}
              selectTextOnFocus
              autoFocus
              style={[
                styles.itemActive,
                styles.inlineInputText,
                {
                  color: colors.text.primary,
                  backgroundColor: isDark ? '#142834' : '#E8F6F8',
                  borderColor: brandPrimary,
                },
              ]}
            />
          </View>
        )}

        {/* Inline Month Editor */}
        {isEditingMonth && (
          <View style={[styles.inlineSlotWrapper, { left: '33.33%' }]}>
            <TextInput
              ref={monthInputRef}
              value={monthInput}
              onChangeText={handleMonthChange}
              onBlur={handleMonthBlur}
              autoCapitalize="words"
              keyboardType="default"
              returnKeyType="done"
              onSubmitEditing={() => {
                handleMonthBlur();
                Keyboard.dismiss();
              }}
              maxLength={3}
              selectTextOnFocus
              autoFocus
              style={[
                styles.itemActive,
                styles.inlineInputText,
                {
                  color: colors.text.primary,
                  backgroundColor: isDark ? '#142834' : '#E8F6F8',
                  borderColor: brandPrimary,
                },
              ]}
            />
          </View>
        )}

        {/* Inline Year Editor */}
        {isEditingYear && (
          <View style={[styles.inlineSlotWrapper, { right: 0 }]}>
            <TextInput
              ref={yearInputRef}
              value={yearInput}
              onChangeText={handleYearChange}
              onBlur={handleYearBlur}
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={() => {
                handleYearBlur();
                Keyboard.dismiss();
              }}
              maxLength={4}
              selectTextOnFocus
              autoFocus
              style={[
                styles.itemActive,
                styles.inlineInputText,
                {
                  color: colors.text.primary,
                  backgroundColor: isDark ? '#142834' : '#E8F6F8',
                  borderColor: brandPrimary,
                },
              ]}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: scale(20),
    padding: scale(16),
    marginVertical: verticalScale(10),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: verticalScale(12),
  },
  headerText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    width: '33.33%',
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    height: ITEM_HEIGHT * 3,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
  },
  wheelContainer: {
    width: '33.33%',
    height: ITEM_HEIGHT * 3,
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  itemWrapper: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  itemActive: {
    fontSize: scaleFont(24),
    lineHeight: verticalScale(32),
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
    includeFontPadding: false,
    textAlignVertical: 'center',
    paddingVertical: 0,
  },
  itemFaded: {
    fontSize: scaleFont(16),
    lineHeight: verticalScale(22),
    fontWeight: '400',
    textAlign: 'center',
    width: '100%',
    includeFontPadding: false,
    textAlignVertical: 'center',
    paddingVertical: 0,
  },
  selectionOverlay: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: scale(4),
    right: scale(4),
    height: ITEM_HEIGHT,
    borderRadius: scale(12),
    borderWidth: 1,
  },
  inlineSlotWrapper: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    width: '33.33%',
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 10,
  },
  inlineInputText: {
    width: '84%',
    height: verticalScale(40),
    borderRadius: scale(10),
    borderWidth: 1.5,
    textAlign: 'center',
    paddingVertical: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

/**
 * Robust date parser supporting Date, objects, and various string formats (DD MMM YYYY, YYYY-MM-DD, DD/MM/YYYY)
 */
export const parseDateParts = (input) => {
  if (!input) {
    const now = new Date();
    return {
      d: String(now.getDate()).padStart(2, '0'),
      m: MONTHS[now.getMonth()],
      y: String(now.getFullYear()),
    };
  }
  if (input instanceof Date && !isNaN(input.getTime())) {
    return {
      d: String(input.getDate()).padStart(2, '0'),
      m: MONTHS[input.getMonth()],
      y: String(input.getFullYear()),
    };
  }
  if (typeof input === 'object' && (input.day || input.d)) {
    const day = input.day || input.d;
    const month = input.month || input.m;
    const year = input.year || input.y;
    return {
      d: String(day).padStart(2, '0'),
      m: resolveMonth(String(month)) || 'Jan',
      y: String(year),
    };
  }
  if (typeof input === 'string') {
    const trimmed = input.trim();
    // Check YYYY-MM-DD or YYYY/MM/DD
    if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(trimmed)) {
      const [y, m, d] = trimmed.split(/[-/]/);
      const mIdx = Math.max(0, Math.min(11, parseInt(m, 10) - 1));
      return {
        d: d.padStart(2, '0'),
        m: MONTHS[mIdx],
        y,
      };
    }
    // Check DD MMM YYYY or DD-MM-YYYY or DD/MM/YYYY
    const parts = trimmed.split(/[\s/-]+/);
    if (parts.length >= 3) {
      let d = parts[0].padStart(2, '0');
      let m = resolveMonth(parts[1]) || 'Jan';
      let y = parts[2];
      // If first token is 4-digit year
      if (parts[0].length === 4) {
        y = parts[0];
        m = resolveMonth(parts[1]) || 'Jan';
        d = parts[2].padStart(2, '0');
      }
      return { d, m, y };
    }
  }
  const now = new Date();
  return {
    d: String(now.getDate()).padStart(2, '0'),
    m: MONTHS[now.getMonth()],
    y: String(now.getFullYear()),
  };
};

/**
 * ModalDatePicker
 * BottomSheet modal picker matching OneRx 1:1.
 * Supports:
 * - visible
 * - onClose
 * - title
 * - selectedDate / value
 * - minDate, maxDate
 * - startYear, endYear
 * - onSelect / onConfirm
 */
export const ModalDatePicker = ({
  visible,
  onClose,
  title = 'Select Date',
  selectedDate,
  value,
  minDate,
  maxDate,
  startYear: propStartYear,
  endYear: propEndYear,
  onSelect,
  onConfirm,
}) => {
  const { colors, isDark } = useTheme();
  const dateValue = selectedDate || value;
  const initial = useMemo(() => parseDateParts(dateValue), [dateValue]);

  const [dobDay, setDobDay] = useState(initial.d);
  const [dobMonth, setDobMonth] = useState(initial.m);
  const [dobYear, setDobYear] = useState(initial.y);

  useEffect(() => {
    if (visible && dateValue) {
      const parsed = parseDateParts(dateValue);
      setDobDay(parsed.d);
      setDobMonth(parsed.m);
      setDobYear(parsed.y);
    }
  }, [visible, dateValue]);

  const computedEndYear = useMemo(() => {
    if (propEndYear) return Number(propEndYear);
    if (maxDate instanceof Date) return maxDate.getFullYear();
    if (typeof maxDate === 'number') return maxDate;
    return CURRENT_YEAR + 20;
  }, [propEndYear, maxDate]);

  const computedStartYear = useMemo(() => {
    if (propStartYear) return Number(propStartYear);
    if (minDate instanceof Date) return minDate.getFullYear();
    if (typeof minDate === 'number') return minDate;
    return 1970;
  }, [propStartYear, minDate]);

  const handleDone = () => {
    Keyboard.dismiss();
    const formatted = `${dobDay} ${dobMonth} ${dobYear}`;
    const dateObj = {
      day: dobDay,
      month: dobMonth,
      year: dobYear,
      formatted,
    };
    onSelect?.(formatted);
    onConfirm?.(formatted, dateObj);
    onClose?.();
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title={title}
      type="bottomSheet"
    >
      <CustomDatePickerWheel
        visible={visible}
        dobDay={dobDay}
        setDobDay={setDobDay}
        dobMonth={dobMonth}
        setDobMonth={setDobMonth}
        dobYear={dobYear}
        setDobYear={setDobYear}
        startYear={computedStartYear}
        endYear={computedEndYear}
      />

      <AppButton
        title="Done"
        variant="primary"
        size="lg"
        onPress={handleDone}
        style={{
          marginTop: verticalScale(16),
          marginBottom: verticalScale(8),
        }}
      />
    </AppModal>
  );
};

/**
 * CustomDatePicker
 * Universal dual-mode picker:
 * - When `onClose` or `onSelect` or (`visible` with `onConfirm` and without `setDobDay`) is passed:
 *   renders `ModalDatePicker` (BottomSheet modal).
 * - Otherwise:
 *   renders `CustomDatePickerWheel` inline for embedding directly inside card layouts.
 */
export const CustomDatePicker = (props) => {
  if (
    props.onClose ||
    props.onSelect ||
    (props.visible !== undefined && props.onConfirm && !props.setDobDay)
  ) {
    return <ModalDatePicker {...props} />;
  }
  return <CustomDatePickerWheel {...props} />;
};

export default CustomDatePicker;
