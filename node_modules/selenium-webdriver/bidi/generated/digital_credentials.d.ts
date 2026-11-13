import type { EmptyResult } from './common.js';
import './common.js';
import { Domain } from '../domain.js';
export type DigitalCredentialsVirtualWalletAction = "decline" | "respond" | "wait" | "clear";
export interface DigitalCredentialsSetVirtualWalletBehaviorParameters {
    action: DigitalCredentialsVirtualWalletAction;
    context?: string;
    protocol?: string;
    response?: DigitalCredentialsSetVirtualWalletBehaviorParametersResponse;
}
export interface DigitalCredentialsSetVirtualWalletBehavior {
    method: "digitalCredentials.setVirtualWalletBehavior";
    params: DigitalCredentialsSetVirtualWalletBehaviorParameters;
}
export type DigitalCredentialsSetVirtualWalletBehaviorResult = EmptyResult;
export interface DigitalCredentialsSetVirtualWalletBehaviorParametersResponse {
}
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
export declare class DigitalCredentials extends Domain {
    static readonly VirtualWalletAction: Readonly<{
        readonly DECLINE: "decline";
        readonly RESPOND: "respond";
        readonly WAIT: "wait";
        readonly CLEAR: "clear";
    }>;
    static create(driver: unknown): Promise<DigitalCredentials>;
    /**
     * @param {DigitalCredentialsSetVirtualWalletBehaviorParameters} params
     * @param {DigitalCredentialsVirtualWalletAction} params.action
     * @param {string} [params.context]
     * @param {string} [params.protocol]
     * @param {DigitalCredentialsSetVirtualWalletBehaviorParametersResponse} [params.response]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-digitalCredentials-setVirtualWalletBehavior
     */
    setVirtualWalletBehavior(params: DigitalCredentialsSetVirtualWalletBehaviorParameters): Promise<void>;
}
