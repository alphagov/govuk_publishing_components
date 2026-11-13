import type { BrowsingContextBrowsingContext } from './browsing_context.js';
import './browsing_context.js';
import type { JsUint } from './common.js';
import './common.js';
import type { NetworkBytesValue, NetworkCookie, NetworkSameSite } from './network.js';
import './network.js';
import { Domain } from '../domain.js';
export interface StoragePartitionKey {
    userContext?: string;
    sourceOrigin?: string;
}
export interface StorageGetCookies {
    method: "storage.getCookies";
    params: StorageGetCookiesParameters;
}
export interface StorageCookieFilter {
    name?: string;
    value?: NetworkBytesValue;
    domain?: string;
    path?: string;
    size?: JsUint;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: NetworkSameSite;
    expiry?: JsUint;
}
export interface StorageBrowsingContextPartitionDescriptor {
    type: "context";
    context: BrowsingContextBrowsingContext;
}
export interface StorageStorageKeyPartitionDescriptor {
    type: "storageKey";
    userContext?: string;
    sourceOrigin?: string;
}
export type StoragePartitionDescriptor = StorageBrowsingContextPartitionDescriptor | StorageStorageKeyPartitionDescriptor;
export interface StorageGetCookiesParameters {
    filter?: StorageCookieFilter;
    partition?: StoragePartitionDescriptor;
}
export interface StorageGetCookiesResult {
    cookies: Array<NetworkCookie>;
    partitionKey: StoragePartitionKey;
}
export interface StorageSetCookie {
    method: "storage.setCookie";
    params: StorageSetCookieParameters;
}
export interface StoragePartialCookie {
    name: string;
    value: NetworkBytesValue;
    domain: string;
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: NetworkSameSite;
    expiry?: JsUint;
}
export interface StorageSetCookieParameters {
    cookie: StoragePartialCookie;
    partition?: StoragePartitionDescriptor;
}
export interface StorageSetCookieResult {
    partitionKey: StoragePartitionKey;
}
export interface StorageDeleteCookies {
    method: "storage.deleteCookies";
    params: StorageDeleteCookiesParameters;
}
export interface StorageDeleteCookiesParameters {
    filter?: StorageCookieFilter;
    partition?: StoragePartitionDescriptor;
}
export interface StorageDeleteCookiesResult {
    partitionKey: StoragePartitionKey;
}
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
export declare class Storage extends Domain {
    static create(driver: unknown): Promise<Storage>;
    /**
     * @param {StorageDeleteCookiesParameters} params
     * @param {StorageCookieFilter} [params.filter]
     * @param {StoragePartitionDescriptor} [params.partition]
     * @returns {Promise<StorageDeleteCookiesResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-storage-deleteCookies
     */
    deleteCookies(params: StorageDeleteCookiesParameters): Promise<StorageDeleteCookiesResult>;
    /**
     * @param {StorageGetCookiesParameters} params
     * @param {StorageCookieFilter} [params.filter]
     * @param {StoragePartitionDescriptor} [params.partition]
     * @returns {Promise<StorageGetCookiesResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-storage-getCookies
     */
    getCookies(params: StorageGetCookiesParameters): Promise<StorageGetCookiesResult>;
    /**
     * @param {StorageSetCookieParameters} params
     * @param {StoragePartialCookie} params.cookie
     * @param {StoragePartitionDescriptor} [params.partition]
     * @returns {Promise<StorageSetCookieResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-storage-setCookie
     */
    setCookie(params: StorageSetCookieParameters): Promise<StorageSetCookieResult>;
}
