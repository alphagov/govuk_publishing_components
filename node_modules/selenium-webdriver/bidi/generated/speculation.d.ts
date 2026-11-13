import { Domain, type EventDescriptor } from '../domain.js';
export type SpeculationPreloadingStatus = "pending" | "ready" | "success" | "failure";
export interface SpeculationPrefetchStatusUpdated {
    method: "speculation.prefetchStatusUpdated";
    params: SpeculationPrefetchStatusUpdatedParameters;
}
export interface SpeculationPrefetchStatusUpdatedParameters {
    context: string;
    url: string;
    status: SpeculationPreloadingStatus;
}
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
export declare class Speculation extends Domain {
    /** @see https://w3c.github.io/webdriver-bidi/#event-speculation-prefetchStatusUpdated */
    static readonly PREFETCH_STATUS_UPDATED: EventDescriptor<SpeculationPrefetchStatusUpdatedParameters>;
    static readonly PreloadingStatus: Readonly<{
        readonly PENDING: "pending";
        readonly READY: "ready";
        readonly SUCCESS: "success";
        readonly FAILURE: "failure";
    }>;
    static create(driver: unknown): Promise<Speculation>;
}
