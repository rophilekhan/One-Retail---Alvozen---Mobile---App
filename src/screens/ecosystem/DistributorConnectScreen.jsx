import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppBadge,
  AppButton,
  AppModal,
  AppInput,
  MetricIconDisc,
  AppToast,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { PermissionGuard } from '../../components/common/PermissionGuard.jsx';
import { PERMISSIONS, hasPermission } from '../../store/useStaffStore.js';

const INITIAL_PURCHASE_ORDERS = [
  {
    id: 'po_101',
    poNumber: 'PO-2026-0041',
    distributor: 'Muller & Phipps Pakistan',
    itemsCount: 3,
    totalAmount: 18400,
    status: 'Pending Approval', // 'Draft' | 'Pending Approval' | 'Dispatched'
    createdAt: '2026-11-19',
    canApprove: true,
  },
  {
    id: 'po_102',
    poNumber: 'PO-2026-0038',
    distributor: 'Ali Gohar & Co',
    itemsCount: 5,
    totalAmount: 32600,
    status: 'Dispatched',
    createdAt: '2026-11-17',
    canApprove: false,
  },
];

const INITIAL_EXPIRY_BATCHES = [
  {
    id: 'exp_1',
    brandName: 'Risek 20mg Cap 14s',
    batchNo: 'B-88214',
    expiryDate: 'Dec 2026',
    units: 24,
    claimValue: 3240,
    status: 'Ready for Return Authorization', // 'Audited' | 'Ready for Return Authorization' | 'Credit Issued'
  },
  {
    id: 'exp_2',
    brandName: 'Klavox 625mg Tab 10s',
    batchNo: 'KL-44102',
    expiryDate: 'Jan 2027',
    units: 12,
    claimValue: 2580,
    status: 'Credit Note Issued',
  },
];

/**
 * DistributorConnectScreen - Ordering & Expiry Workflow
 * Mandated by ONERETAIL_PRD.md:
 * - PO Initiator & Approver RBAC workflow
 * - Expiry Initiator & Approver return batches & credit notes
 *
 * @param {Object} props
 * @param {Object} props.navigation
 * @param {Object} props.route
 */
export const DistributorConnectScreen = ({ navigation, route }) => {
  const { colors, spacing, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('PO'); // 'PO' | 'EXPIRY'
  const [orders, setOrders] = useState(INITIAL_PURCHASE_ORDERS);
  const [expiries, setExpiries] = useState(INITIAL_EXPIRY_BATCHES);

  // New PO Modal
  const [createPoVisible, setCreatePoVisible] = useState(false);
  const [distributorName, setDistributorName] = useState('Muller & Phipps Pakistan');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderAmount, setOrderAmount] = useState('14500');

  // New Expiry Modal
  const [createExpiryVisible, setCreateExpiryVisible] = useState(false);
  const [expiryBrand, setExpiryBrand] = useState('Augmentin 625mg');
  const [expiryBatch, setExpiryBatch] = useState('AG-99120');
  const [expiryUnits, setExpiryUnits] = useState('15');

  const handleApprovePo = (poId) => {
    if (!hasPermission(PERMISSIONS.PO_APPROVER)) {
      AppToast.show({
        title: 'Permission Denied',
        message: 'Only authorized PO Approvers can sign and submit orders.',
        type: 'warning',
      });
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === poId ? { ...o, status: 'Submitted to Distributor' } : o))
    );
    AppToast.show({
      title: 'PO Authorized & Transmitted',
      message: 'Purchase order signed and sent directly to distributor portal.',
      type: 'success',
    });
  };

  const handleCreatePo = () => {
    if (!hasPermission(PERMISSIONS.PO_INITIATOR)) {
      AppToast.show({
        title: 'Permission Denied',
        message: 'Only authorized PO Initiators can draft purchase orders.',
        type: 'warning',
      });
      return;
    }

    const newPO = {
      id: 'po_' + Date.now(),
      poNumber: 'PO-2026-00' + (orders.length + 42),
      distributor: distributorName,
      itemsCount: 4,
      totalAmount: Number(orderAmount) || 12000,
      status: 'Pending Approval',
      createdAt: new Date().toLocaleDateString('en-GB'),
      canApprove: true,
    };

    setOrders([newPO, ...orders]);
    setCreatePoVisible(false);
    AppToast.show({
      title: 'Purchase Order Drafted',
      message: `${newPO.poNumber} created. Awaiting PO Approver review.`,
      type: 'success',
    });
  };

  const handleAuthorizeExpiry = (expId) => {
    if (!hasPermission(PERMISSIONS.EXPIRY_APPROVER)) {
      AppToast.show({
        title: 'Permission Denied',
        message: 'Only authorized Expiry Approvers can approve credit note claims.',
        type: 'warning',
      });
      return;
    }

    setExpiries((prev) =>
      prev.map((e) => (e.id === expId ? { ...e, status: 'Credit Note Authorized' } : e))
    );
    AppToast.show({
      title: 'Expiry Credit Authorized',
      message: 'Distributor return manifest authorized. Credit note issued.',
      type: 'success',
    });
  };

  const handleCreateExpiry = () => {
    if (!hasPermission(PERMISSIONS.EXPIRY_INITIATOR)) {
      AppToast.show({
        title: 'Permission Denied',
        message: 'Only authorized Expiry Initiators can log near-expiry items.',
        type: 'warning',
      });
      return;
    }

    const newExp = {
      id: 'exp_' + Date.now(),
      brandName: expiryBrand,
      batchNo: expiryBatch,
      expiryDate: 'Dec 2026',
      units: Number(expiryUnits) || 10,
      claimValue: (Number(expiryUnits) || 10) * 180,
      status: 'Ready for Return Authorization',
    };

    setExpiries([newExp, ...expiries]);
    setCreateExpiryVisible(false);
    AppToast.show({
      title: 'Expiry Batch Logged',
      message: `${newExp.brandName} flagged. Awaiting Expiry Approver authorization.`,
      type: 'success',
    });
  };

  return (
    <AppScreenContainer scrollable={true} withAmbientGlow={true} withBottomNavClearance={true}>
      <AppHeader title="Distributor Connect" onBack={() => navigation.goBack()} showBack={true} />

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('PO')}
          style={[styles.tabBtn, activeTab === 'PO' && { backgroundColor: colors.brand?.primary }]}
        >
          <AppText variant="bodyMediumMedium" colorType={activeTab === 'PO' ? 'inverse' : 'muted'}>
            Purchase Orders (PO)
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('EXPIRY')}
          style={[styles.tabBtn, activeTab === 'EXPIRY' && { backgroundColor: colors.brand?.primary }]}
        >
          <AppText variant="bodyMediumMedium" colorType={activeTab === 'EXPIRY' ? 'inverse' : 'muted'}>
            Expiry & Returns
          </AppText>
        </TouchableOpacity>
      </View>

      {/* TAB 1: PURCHASE ORDERS */}
      {activeTab === 'PO' && (
        <View>
          <View style={styles.sectionHeader}>
            <View>
              <AppText variant="titleMedium" colorType="primary">Distributor Orders</AppText>
              <AppText variant="caption" colorType="muted">RBAC: PO Initiator drafts • PO Approver signs</AppText>
            </View>

            <PermissionGuard
              permission={PERMISSIONS.PO_INITIATOR}
              fallback={<AppBadge label="PO Read-Only" variant="muted" />}
            >
              <AppButton
                variant="primary"
                size="xs"
                title="+ Draft PO"
                onPress={() => setCreatePoVisible(true)}
              />
            </PermissionGuard>
          </View>

          {orders.map((po) => (
            <GlassCard key={po.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={{ flex: 1 }}>
                  <AppText variant="titleMedium" colorType="primary">{po.poNumber}</AppText>
                  <AppText variant="caption" colorType="muted">
                    {po.distributor} • {po.itemsCount} Items
                  </AppText>
                  <AppText variant="bodySmallMedium" colorType="brand" style={{ marginTop: 2 }}>
                    PKR {po.totalAmount.toLocaleString()}
                  </AppText>
                </View>

                <AppBadge
                  label={po.status}
                  variant={
                    po.status === 'Submitted to Distributor' || po.status === 'Dispatched'
                      ? 'success'
                      : 'accent'
                  }
                />
              </View>

              {po.status === 'Pending Approval' && (
                <View style={[styles.cardActionRow, { borderTopColor: colors.border?.subtle }]}>
                  <PermissionGuard
                    permission={PERMISSIONS.PO_APPROVER}
                    fallback={
                      <AppText variant="caption" colorType="muted">
                        Awaiting PO Approver authorization.
                      </AppText>
                    }
                  >
                    <AppButton
                      variant="primary"
                      size="xs"
                      title="Approve & Transmit PO to Distributor"
                      onPress={() => handleApprovePo(po.id)}
                    />
                  </PermissionGuard>
                </View>
              )}
            </GlassCard>
          ))}
        </View>
      )}

      {/* TAB 2: EXPIRY & RETURNS */}
      {activeTab === 'EXPIRY' && (
        <View>
          <View style={styles.sectionHeader}>
            <View>
              <AppText variant="titleMedium" colorType="primary">Expiry Return Claims</AppText>
              <AppText variant="caption" colorType="muted">RBAC: Expiry Initiator flags • Approver issues credit</AppText>
            </View>

            <PermissionGuard
              permission={PERMISSIONS.EXPIRY_INITIATOR}
              fallback={<AppBadge label="Expiry Read-Only" variant="muted" />}
            >
              <AppButton
                variant="primary"
                size="xs"
                title="+ Log Expiry"
                onPress={() => setCreateExpiryVisible(true)}
              />
            </PermissionGuard>
          </View>

          {expiries.map((exp) => (
            <GlassCard key={exp.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={{ flex: 1 }}>
                  <AppText variant="titleMedium" colorType="primary">{exp.brandName}</AppText>
                  <AppText variant="caption" colorType="muted">
                    Batch: {exp.batchNo} • Cutoff: {exp.expiryDate} • Qty: {exp.units} units
                  </AppText>
                  <AppText variant="bodySmallMedium" colorType="brand" style={{ marginTop: 2 }}>
                    Claim Value: PKR {exp.claimValue.toLocaleString()}
                  </AppText>
                </View>

                <AppBadge
                  label={exp.status}
                  variant={exp.status.includes('Credit') ? 'success' : 'accent'}
                />
              </View>

              {exp.status === 'Ready for Return Authorization' && (
                <View style={[styles.cardActionRow, { borderTopColor: colors.border?.subtle }]}>
                  <PermissionGuard
                    permission={PERMISSIONS.EXPIRY_APPROVER}
                    fallback={
                      <AppText variant="caption" colorType="muted">
                        Awaiting Expiry Approver sign-off.
                      </AppText>
                    }
                  >
                    <AppButton
                      variant="accent"
                      size="xs"
                      title="Authorize Credit Note Claim"
                      onPress={() => handleAuthorizeExpiry(exp.id)}
                    />
                  </PermissionGuard>
                </View>
              )}
            </GlassCard>
          ))}
        </View>
      )}

      <View style={{ height: verticalScale(20) }} />

      {/* Draft PO Modal */}
      <AppModal
        visible={createPoVisible}
        type="bottomSheet"
        title="Draft New Purchase Order"
        onClose={() => setCreatePoVisible(false)}
      >
        <View style={styles.modalBody}>
          <AppInput
            label="Distributor Name"
            value={distributorName}
            onChangeText={setDistributorName}
          />
          <AppInput
            label="Order Estimated Amount (PKR)"
            value={orderAmount}
            onChangeText={setOrderAmount}
            keyboardType="number-pad"
          />
          <AppInput
            label="Booking Notes / Delivery Window"
            placeholder="e.g. Urgent stock delivery before Friday"
            value={orderNotes}
            onChangeText={setOrderNotes}
          />
          <View style={{ height: spacing.md }} />
          <AppButton
            variant="primary"
            title="Submit Draft for Approval"
            onPress={handleCreatePo}
          />
        </View>
      </AppModal>

      {/* Log Expiry Modal */}
      <AppModal
        visible={createExpiryVisible}
        type="bottomSheet"
        title="Log Near-Expiry Medicines"
        onClose={() => setCreateExpiryVisible(false)}
      >
        <View style={styles.modalBody}>
          <AppInput
            label="Brand Name"
            value={expiryBrand}
            onChangeText={setExpiryBrand}
          />
          <AppInput
            label="Batch Number"
            value={expiryBatch}
            onChangeText={setExpiryBatch}
          />
          <AppInput
            label="Units to Return"
            value={expiryUnits}
            onChangeText={setExpiryUnits}
            keyboardType="number-pad"
          />
          <View style={{ height: spacing.md }} />
          <AppButton
            variant="primary"
            title="Log Expiry Batch"
            onPress={handleCreateExpiry}
          />
        </View>
      </AppModal>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(12),
    padding: scale(4),
    marginVertical: verticalScale(8),
  },
  tabBtn: {
    flex: 1,
    paddingVertical: verticalScale(8),
    alignItems: 'center',
    borderRadius: scale(8),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(8),
  },
  card: {
    width: '100%',
    marginVertical: verticalScale(5),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardActionRow: {
    borderTopWidth: 1,
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
  },
  modalBody: {
    paddingBottom: verticalScale(16),
  },
});

export default DistributorConnectScreen;