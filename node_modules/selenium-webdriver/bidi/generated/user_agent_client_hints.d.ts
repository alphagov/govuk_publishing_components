import { Domain } from '../domain.js';
export interface UserAgentClientHintsSetClientHintsOverrideCommand {
    method: "userAgentClientHints.setClientHintsOverride";
    params: UserAgentClientHintsSetClientHintsOverrideCommandParams;
}
export interface UserAgentClientHintsClientHintsMetadata {
    brands?: Array<UserAgentClientHintsBrandVersion>;
    fullVersionList?: Array<UserAgentClientHintsBrandVersion>;
    platform?: string;
    platformVersion?: string;
    architecture?: string;
    model?: string;
    mobile?: boolean;
    bitness?: string;
    wow64?: boolean;
    formFactors?: Array<string>;
}
export interface UserAgentClientHintsBrandVersion {
    brand: string;
    version: string;
}
export interface UserAgentClientHintsSetClientHintsOverrideResult {
}
export interface UserAgentClientHintsSetClientHintsOverrideCommandParams {
    clientHints: UserAgentClientHintsClientHintsMetadata | null;
    contexts?: Array<string>;
    userContexts?: Array<string>;
}
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
export declare class UserAgentClientHints extends Domain {
    static create(driver: unknown): Promise<UserAgentClientHints>;
    /**
     * @param {UserAgentClientHintsSetClientHintsOverrideCommandParams} params
     * @param {UserAgentClientHintsClientHintsMetadata | null} params.clientHints
     * @param {Array<string>} [params.contexts]
     * @param {Array<string>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-userAgentClientHints-setClientHintsOverride
     */
    setClientHintsOverride(params: UserAgentClientHintsSetClientHintsOverrideCommandParams): Promise<void>;
}
