import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  AppBadge,
  AppButton,
  AppToast,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { PermissionGuard } from '../../components/common/PermissionGuard.jsx';
import { PERMISSIONS, hasPermission } from '../../store/useStaffStore.js';
import {
  PurchaseOrderCard,
  ExpiryReturnCard,
  CreatePoModal,
  LogExpiryModal,
} from '../../components/ecosystem/index.js';

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
 */
export const DistributorConnectScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('PO'); // 'PO' | 'EXPIRY'
  const [orders, setOrders] = useState(INITIAL_PURCHASE_ORDERS);
  const [expiries, setExpiries] = useState(INITIAL_EXPIRY_BATCHES);

  // Modals
  const [createPoVisible, setCreatePoVisible] = useState(false);
  const [createExpiryVisible, setCreateExpiryVisible] = useState(false);

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

  const handleCreatePo = ({ distributor, totalAmount }) => {
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
      distributor,
      itemsCount: 4,
      totalAmount,
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

  const handleCreateExpiry = ({ brandName, batchNo, units }) => {
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
      brandName,
      batchNo,
      expiryDate: 'Dec 2026',
      units,
      claimValue: units * 180,
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
            <PurchaseOrderCard key={po.id} po={po} onApprove={handleApprovePo} />
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
            <ExpiryReturnCard key={exp.id} expiry={exp} onAuthorize={handleAuthorizeExpiry} />
          ))}
        </View>
      )}

      <View style={{ height: verticalScale(20) }} />

      {/* Draft PO Modal */}
      <CreatePoModal
        visible={createPoVisible}
        onClose={() => setCreatePoVisible(false)}
        onCreate={handleCreatePo}
      />

      {/* Log Expiry Modal */}
      <LogExpiryModal
        visible={createExpiryVisible}
        onClose={() => setCreateExpiryVisible(false)}
        onLog={handleCreateExpiry}
      />
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
});

export default DistributorConnectScreen;
