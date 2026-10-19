import { Domain } from '../domain.js';
export interface PermissionsPermissionDescriptor {
    name: string;
}
export type PermissionsPermissionState = "granted" | "denied" | "prompt";
export interface PermissionsSetPermission {
    method: "permissions.setPermission";
    params: PermissionsSetPermissionParameters;
}
export interface PermissionsSetPermissionParameters {
    descriptor: PermissionsPermissionDescriptor;
    state: PermissionsPermissionState;
    origin: string;
    embeddedOrigin?: string;
    userContext?: string;
}
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
export declare class Permissions extends Domain {
    static readonly PermissionState: Readonly<{
        readonly GRANTED: "granted";
        readonly DENIED: "denied";
        readonly PROMPT: "prompt";
    }>;
    static create(driver: unknown): Promise<Permissions>;
    /**
     * @param {PermissionsSetPermissionParameters} params
     * @param {PermissionsPermissionDescriptor} params.descriptor
     * @param {PermissionsPermissionState} params.state
     * @param {string} params.origin
     * @param {string} [params.embeddedOrigin]
     * @param {string} [params.userContext]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-permissions-setPermission
     */
    setPermission(params: PermissionsSetPermissionParameters): Promise<void>;
}
