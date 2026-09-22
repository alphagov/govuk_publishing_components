import { structUtils } from '@yarnpkg/core';
export type ParseDescriptor = typeof structUtils.parseDescriptor;
export type ParseRange = typeof structUtils.parseRange;
export type YarnLockFileKeyNormalizer = (fullDescriptor: string) => Set<string>;
export declare const yarnLockFileKeyNormalizer: (parseDescriptor: ParseDescriptor, parseRange: ParseRange) => YarnLockFileKeyNormalizer;
