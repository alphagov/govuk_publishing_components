export const canUseDom: boolean =
  process.env.CHOICES_CAN_USE_DOM !== undefined
    ? process.env.CHOICES_CAN_USE_DOM === '1'
    : !!(typeof document !== 'undefined' && document.createElement);

export const searchFuse: string | undefined = process.env.CHOICES_SEARCH_FUSE;
export const searchKMP: boolean = process.env.CHOICES_SEARCH_KMP === '1';

/**
 * These are not directly used, as an exported object (even as const) will prevent tree-shake away code paths
 */

export const BuildFlags = {
  searchFuse,
  searchKMP,
  canUseDom,
} as const;
