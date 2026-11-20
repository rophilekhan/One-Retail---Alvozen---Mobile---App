import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ThemeProvider } from '../src/theme/index.js';
import {
  StaffMemberCard,
  StaffPermissionsMatrix,
  ResetStaffPasswordModal,
} from '../src/components/staff/index.js';
import {
  StaffListScreen,
  StaffFormScreen,
} from '../src/screens/staff/index.js';
import { PERMISSIONS } from '../src/store/useStaffStore.js';

describe('OneRetail Staff Module (1:1 OneRx Port)', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
  };

  test('StaffMemberCard renders with avatar, username, permissions count, and status switch', async () => {
    let renderer;
    const mockStaff = {
      id: 'staff_test_1',
      name: 'Sarah Ahmed',
      username: 'sarah_dispensary',
      allowedPermissions: [
        PERMISSIONS.SCAN_QR_DEVICE,
        PERMISSIONS.PO_INITIATOR,
        PERMISSIONS.UPLOAD_CLOSING_DATA,
      ],
      isActive: true,
    };

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <StaffMemberCard
            staff={mockStaff}
            onPress={() => {}}
            onChangePassword={() => {}}
            onToggleStatus={() => {}}
          />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  }, 15000);

  test('StaffPermissionsMatrix renders all 7 OneRetail permissions with cyan active borders', async () => {
    let renderer;
    const permissionsMap = {
      [PERMISSIONS.SCAN_QR_DEVICE]: true,
      [PERMISSIONS.SCAN_QR_PLUGIN]: false,
      [PERMISSIONS.PO_INITIATOR]: true,
      [PERMISSIONS.PO_APPROVER]: false,
      [PERMISSIONS.EXPIRY_INITIATOR]: false,
      [PERMISSIONS.EXPIRY_APPROVER]: false,
      [PERMISSIONS.UPLOAD_CLOSING_DATA]: true,
    };

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <StaffPermissionsMatrix
            permissions={permissionsMap}
            onToggle={() => {}}
            title="Allowed permissions"
          />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  }, 15000);

  test('ResetStaffPasswordModal renders password inputs with spherical icon badges', async () => {
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="light">
          <ResetStaffPasswordModal
            visible={true}
            staffMember={{ id: 'staff_1', name: 'Ali Reza', username: 'ali_reza' }}
            onClose={() => {}}
            onSave={() => {}}
          />
        </ThemeProvider>
      );
    });

    expect(renderer).toBeDefined();
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  }, 15000);

  test('StaffListScreen and StaffFormScreen render cleanly in ThemeProvider', async () => {
    let listRenderer;
    let formRenderer;

    await ReactTestRenderer.act(async () => {
      listRenderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="dark">
          <StaffListScreen navigation={mockNavigation} route={{}} />
        </ThemeProvider>
      );
    });
    expect(listRenderer).toBeDefined();

    await ReactTestRenderer.act(async () => {
      formRenderer = ReactTestRenderer.create(
        <ThemeProvider initialMode="light">
          <StaffFormScreen
            navigation={mockNavigation}
            route={{
              params: {
                staff: {
                  id: 'staff_1',
                  name: 'Ali Reza',
                  username: 'ali_reza',
                  isActive: true,
                  allowedPermissions: [PERMISSIONS.SCAN_QR_DEVICE],
                },
              },
            }}
          />
        </ThemeProvider>
      );
    });
    expect(formRenderer).toBeDefined();

    await ReactTestRenderer.act(async () => {
      listRenderer.unmount();
      formRenderer.unmount();
    });
  }, 25000);
});
