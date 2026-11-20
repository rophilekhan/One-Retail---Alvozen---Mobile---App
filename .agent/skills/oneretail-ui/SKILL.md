---
name: oneretail-ui
description: Enforces OneRetail's SOLID JavaScript (.jsx/.js) architecture, OneRx-derived glassmorphic design system, Light/Dark theme tokens, and bug-free layout rules across all screens and components.
---

# OneRetail Design System & Engineering Rules (Pure .jsx / .js)

You are building **OneRetail by Alvozen** (`D:\hassoft\Alvozen One Retail Mobile App`) by referencing the visual identity of **OneRx** (`D:\hassoft\Alvozen-Mobile-App`) while fixing all architectural flaws identified in the OneRx audit.

## 1. Strict Code & Architecture Standards
- **100% JavaScript (`.jsx` & `.js`):** Create `.jsx` files for all React components, screens, and navigators, and `.js` files for stores, hooks, services, theme tokens, and utilities. NEVER create `.tsx` or `.ts` files.
- **Zustand Only (Zero Redux):** Never install or use Redux. Use selector-based Zustand hooks (`const user = useAuthStore((s) => s.user);`).
- **Zero Hardcoded Hex Colors:** Never put raw hex strings (`#000000`, `#FFFFFF`, `#009BA9`, etc.) inside screens or feature widgets. Always use `const { colors, isDark, typography, spacing, radii, shadows } = useTheme()`.
- **Thin Declarative Screens (<350 lines):** Keep screens under 350 lines. Put API logic in `src/hooks/api/*.js`, calculations/filters in `src/utils/*.js`, and domain UI blocks in `src/components/<domain>/*.jsx`.
- **RBAC Staff Permission Guards:** Wrap restricted staff actions (`SCAN_QR_DEVICE`, `SCAN_QR_PLUGIN`, `PO_INITIATOR`, `PO_APPROVER`, `EXPIRY_INITIATOR`, `EXPIRY_APPROVER`, `UPLOAD_CLOSING_DATA`) with `<PermissionGuard permission="...">`.

## 2. Exact OneRx Visual Tokens & Responsive Scale
- **Base Canvas:** `402 x 874` (`scale`, `verticalScale`, `moderateScale`, `scaleFont`).
- **Brand Colors:** `brand.primary: '#009BA9'`, `brand.primaryDark: '#0F4761'`, `brand.accent: '#fb6b03'`.
- **Light Mode:** `background.primary: '#ffffff'`, `ambientGradient: '#DDEDF1'`, `text.primary: '#020202'`, `text.secondary: '#787878'`, `surface.card: '#ffffff'`, `border.card: 'rgba(0, 0, 0, 0.06)'`.
- **Dark Mode:** `background.primary: '#020202'`, `ambientGradient: '#092B3A'`, `text.primary: '#ffffff'`, `text.secondary: '#ababab'`, `surface.card: '#020202'`, `border.card: 'rgba(255, 255, 255, 0.12)'`.
- **Fonts:** `'DMSans-Regular'`, `'DMSans-Medium'`, `'DMSans-Light'`, `'DMMono-Regular'`, `'DMMono-Medium'`.

## 3. Mandatory Core Components (`src/components/core/`)
Always compose screens from `src/components/core/` instead of creating duplicate cards, headers, or modals:
1. **`<AppScreenContainer>`**: Renders OneRx's `LinearGradient` backdrop + SVG `topWash` (`#009BA9`) & `topRightAccent` (`#7A5A9A` / `#C9B8E8`) radial blobs + dark noise pattern. Applies `insets.top` ONCE (child screens must NEVER add `paddingTop: insets.top`). Supports `withBottomNavClearance` for main tab screens.
2. **`<GlassCard>`**: iOS `BlurView` + `GlowRing` inset highlights + directional border colors (`outerTop/Left/Right/Bottom`), with Android single-border fallback (`rgba(255,255,255,0.12)` dark / `rgba(255,255,255,0.70)` light).
3. **`<AppButton>`**: Variants `'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'` with guaranteed high-contrast text in both Light and Dark mode (never black text on black background).
4. **`<MetricIconDisc>`**: 3D spherical vertical gradient icon disc (`variants: 'default' | 'teal' | 'purple' | 'gold'`).
5. **`<AppModal>`**: Single universal bottom sheet & center modal with keyboard height tracking.
6. **`<AppHeader>` & `<AppBackButton>`**: Glassmorphic circle back button with SVG chevron (never raw `'<'` text).
7. **`<AppSwitch>` & `<AppCheckbox>`**: Generic toggle switch and animated checkbox atoms.