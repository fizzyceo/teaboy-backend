export const ROLE_PERMISSIONS = {
  ADMIN: {
    can_manage_account: true,
    can_manage_menu: true,
    can_place_order: true,
  },
  TEABOY: {
    can_manage_account: false,
    can_manage_menu: false,
    can_place_order: false,
  },
  NORMAL_USER: {
    can_manage_account: false,
    can_manage_menu: false,
    can_place_order: true,
  },
};
