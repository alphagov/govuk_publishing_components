export declare enum NodeLockfileVersion {
    NpmLockV1 = "NPM_LOCK_V1",
    NpmLockV2 = "NPM_LOCK_V2",
    NpmLockV3 = "NPM_LOCK_V3",
    YarnLockV1 = "YARN_LOCK_V1",
    YarnLockV2 = "YARN_LOCK_V2",
    PnpmLockV5 = "PNPM_LOCK_V5",
    PnpmLockV6 = "PNPM_LOCK_V6",
    PnpmLockV9 = "PNPM_LOCK_V9"
}
export declare const getLockfileVersionFromFile: (targetFile: string) => NodeLockfileVersion;
export declare function getPnpmLockfileVersion(lockFileContents: string): NodeLockfileVersion.PnpmLockV5 | NodeLockfileVersion.PnpmLockV6 | NodeLockfileVersion.PnpmLockV9;
export declare function getYarnLockfileVersion(lockFileContents: string): NodeLockfileVersion.YarnLockV1 | NodeLockfileVersion.YarnLockV2;
export declare function getNpmLockfileVersion(lockFileContents: string): NodeLockfileVersion.NpmLockV1 | NodeLockfileVersion.NpmLockV2 | NodeLockfileVersion.NpmLockV3;
