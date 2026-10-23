import { Domain, type EventDescriptor } from '../domain.js';
export type BluetoothBluetoothUuid = string;
export interface BluetoothBluetoothManufacturerData {
    key: number;
    data: string;
}
export interface BluetoothCharacteristicProperties {
    broadcast?: boolean;
    read?: boolean;
    writeWithoutResponse?: boolean;
    write?: boolean;
    notify?: boolean;
    indicate?: boolean;
    authenticatedSignedWrites?: boolean;
    extendedProperties?: boolean;
}
export type BluetoothRequestDevice = string;
export interface BluetoothRequestDeviceInfo {
    id: BluetoothRequestDevice;
    name: string | null;
}
export type BluetoothRequestDevicePrompt = string;
export interface BluetoothScanRecord {
    name?: string;
    uuids?: Array<BluetoothBluetoothUuid>;
    appearance?: number;
    manufacturerData?: Array<BluetoothBluetoothManufacturerData>;
}
export interface BluetoothHandleRequestDevicePrompt {
    method: "bluetooth.handleRequestDevicePrompt";
    params: BluetoothHandleRequestDevicePromptParameters;
}
export type BluetoothHandleRequestDevicePromptParameters = BluetoothHandleRequestDevicePromptParameters_AcceptParameters | BluetoothHandleRequestDevicePromptParameters_CancelParameters;
export interface BluetoothSimulateAdapter {
    method: "bluetooth.simulateAdapter";
    params: BluetoothSimulateAdapterParameters;
}
export interface BluetoothSimulateAdapterParameters {
    context: string;
    leSupported?: boolean;
    state: BluetoothSimulateAdapterParametersState;
}
export interface BluetoothDisableSimulation {
    method: "bluetooth.disableSimulation";
    params: BluetoothDisableSimulationParameters;
}
export interface BluetoothDisableSimulationParameters {
    context: string;
}
export interface BluetoothSimulatePreconnectedPeripheral {
    method: "bluetooth.simulatePreconnectedPeripheral";
    params: BluetoothSimulatePreconnectedPeripheralParameters;
}
export interface BluetoothSimulatePreconnectedPeripheralParameters {
    context: string;
    address: string;
    name: string;
    manufacturerData: Array<BluetoothBluetoothManufacturerData>;
    knownServiceUuids: Array<BluetoothBluetoothUuid>;
}
export interface BluetoothSimulateAdvertisement {
    method: "bluetooth.simulateAdvertisement";
    params: BluetoothSimulateAdvertisementParameters;
}
export interface BluetoothSimulateAdvertisementParameters {
    context: string;
    scanEntry: BluetoothSimulateAdvertisementScanEntryParameters;
}
export interface BluetoothSimulateAdvertisementScanEntryParameters {
    deviceAddress: string;
    rssi: number;
    scanRecord: BluetoothScanRecord;
}
export interface BluetoothSimulateGattConnectionResponse {
    method: "bluetooth.simulateGattConnectionResponse";
    params: BluetoothSimulateGattConnectionResponseParameters;
}
export interface BluetoothSimulateGattConnectionResponseParameters {
    context: string;
    address: string;
    code: number;
}
export interface BluetoothSimulateGattDisconnection {
    method: "bluetooth.simulateGattDisconnection";
    params: BluetoothSimulateGattDisconnectionParameters;
}
export interface BluetoothSimulateGattDisconnectionParameters {
    context: string;
    address: string;
}
export interface BluetoothSimulateService {
    method: "bluetooth.simulateService";
    params: BluetoothSimulateServiceParameters;
}
export interface BluetoothSimulateServiceParameters {
    context: string;
    address: string;
    uuid: BluetoothBluetoothUuid;
    type: BluetoothSimulateServiceParametersType;
}
export interface BluetoothSimulateCharacteristic {
    method: "bluetooth.simulateCharacteristic";
    params: BluetoothSimulateCharacteristicParameters;
}
export interface BluetoothSimulateCharacteristicParameters {
    context: string;
    address: string;
    serviceUuid: BluetoothBluetoothUuid;
    characteristicUuid: BluetoothBluetoothUuid;
    characteristicProperties?: BluetoothCharacteristicProperties;
    type: BluetoothSimulateCharacteristicParametersType;
}
export interface BluetoothSimulateCharacteristicResponse {
    method: "bluetooth.simulateCharacteristicResponse";
    params: BluetoothSimulateCharacteristicResponseParameters;
}
export interface BluetoothSimulateCharacteristicResponseParameters {
    context: string;
    address: string;
    serviceUuid: BluetoothBluetoothUuid;
    characteristicUuid: BluetoothBluetoothUuid;
    type: BluetoothSimulateCharacteristicResponseParametersType;
    code: number;
    data?: Array<number>;
}
export interface BluetoothSimulateDescriptor {
    method: "bluetooth.simulateDescriptor";
    params: BluetoothSimulateDescriptorParameters;
}
export interface BluetoothSimulateDescriptorParameters {
    context: string;
    address: string;
    serviceUuid: BluetoothBluetoothUuid;
    characteristicUuid: BluetoothBluetoothUuid;
    descriptorUuid: BluetoothBluetoothUuid;
    type: BluetoothSimulateDescriptorParametersType;
}
export interface BluetoothSimulateDescriptorResponse {
    method: "bluetooth.simulateDescriptorResponse";
    params: BluetoothSimulateDescriptorResponseParameters;
}
export interface BluetoothSimulateDescriptorResponseParameters {
    context: string;
    address: string;
    serviceUuid: BluetoothBluetoothUuid;
    characteristicUuid: BluetoothBluetoothUuid;
    descriptorUuid: BluetoothBluetoothUuid;
    type: BluetoothSimulateDescriptorResponseParametersType;
    code: number;
    data?: Array<number>;
}
export interface BluetoothRequestDevicePromptUpdated {
    method: "bluetooth.requestDevicePromptUpdated";
    params: BluetoothRequestDevicePromptUpdatedParameters;
}
export interface BluetoothRequestDevicePromptUpdatedParameters {
    context: string;
    prompt: BluetoothRequestDevicePrompt;
    devices: Array<BluetoothRequestDeviceInfo>;
}
export interface BluetoothGattConnectionAttempted {
    method: "bluetooth.gattConnectionAttempted";
    params: BluetoothGattConnectionAttemptedParameters;
}
export interface BluetoothGattConnectionAttemptedParameters {
    context: string;
    address: string;
}
export interface BluetoothCharacteristicEventGenerated {
    method: "bluetooth.characteristicEventGenerated";
    params: BluetoothCharacteristicEventGeneratedParameters;
}
export interface BluetoothCharacteristicEventGeneratedParameters {
    context: string;
    address: string;
    serviceUuid: BluetoothBluetoothUuid;
    characteristicUuid: BluetoothBluetoothUuid;
    type: BluetoothCharacteristicEventGeneratedParametersType;
    data?: Array<number>;
}
export interface BluetoothDescriptorEventGenerated {
    method: "bluetooth.descriptorEventGenerated";
    params: BluetoothDescriptorEventGeneratedParameters;
}
export interface BluetoothDescriptorEventGeneratedParameters {
    context: string;
    address: string;
    serviceUuid: BluetoothBluetoothUuid;
    characteristicUuid: BluetoothBluetoothUuid;
    descriptorUuid: BluetoothBluetoothUuid;
    type: BluetoothDescriptorEventGeneratedParametersType;
    data?: Array<number>;
}
export type BluetoothSimulateAdapterParametersState = "absent" | "powered-off" | "powered-on";
export type BluetoothSimulateServiceParametersType = "add" | "remove";
export type BluetoothSimulateCharacteristicParametersType = "add" | "remove";
export type BluetoothSimulateCharacteristicResponseParametersType = "read" | "write" | "subscribe-to-notifications" | "unsubscribe-from-notifications";
export type BluetoothSimulateDescriptorParametersType = "add" | "remove";
export type BluetoothSimulateDescriptorResponseParametersType = "read" | "write";
export type BluetoothCharacteristicEventGeneratedParametersType = "read" | "write-with-response" | "write-without-response" | "subscribe-to-notifications" | "unsubscribe-from-notifications";
export type BluetoothDescriptorEventGeneratedParametersType = "read" | "write";
export interface BluetoothHandleRequestDevicePromptParameters_AcceptParameters {
    context: string;
    prompt: BluetoothRequestDevicePrompt;
    accept: true;
    device: BluetoothRequestDevice;
}
export interface BluetoothHandleRequestDevicePromptParameters_CancelParameters {
    context: string;
    prompt: BluetoothRequestDevicePrompt;
    accept: false;
}
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
export declare class Bluetooth extends Domain {
    /** @see https://w3c.github.io/webdriver-bidi/#event-bluetooth-requestDevicePromptUpdated */
    static readonly REQUEST_DEVICE_PROMPT_UPDATED: EventDescriptor<BluetoothRequestDevicePromptUpdatedParameters>;
    /** @see https://w3c.github.io/webdriver-bidi/#event-bluetooth-gattConnectionAttempted */
    static readonly GATT_CONNECTION_ATTEMPTED: EventDescriptor<BluetoothGattConnectionAttemptedParameters>;
    /** @see https://w3c.github.io/webdriver-bidi/#event-bluetooth-characteristicEventGenerated */
    static readonly CHARACTERISTIC_EVENT_GENERATED: EventDescriptor<BluetoothCharacteristicEventGeneratedParameters>;
    /** @see https://w3c.github.io/webdriver-bidi/#event-bluetooth-descriptorEventGenerated */
    static readonly DESCRIPTOR_EVENT_GENERATED: EventDescriptor<BluetoothDescriptorEventGeneratedParameters>;
    static readonly SimulateAdapterParametersState: Readonly<{
        readonly ABSENT: "absent";
        readonly POWERED_OFF: "powered-off";
        readonly POWERED_ON: "powered-on";
    }>;
    static readonly SimulateServiceParametersType: Readonly<{
        readonly ADD: "add";
        readonly REMOVE: "remove";
    }>;
    static readonly SimulateCharacteristicParametersType: Readonly<{
        readonly ADD: "add";
        readonly REMOVE: "remove";
    }>;
    static readonly SimulateCharacteristicResponseParametersType: Readonly<{
        readonly READ: "read";
        readonly WRITE: "write";
        readonly SUBSCRIBE_TO_NOTIFICATIONS: "subscribe-to-notifications";
        readonly UNSUBSCRIBE_FROM_NOTIFICATIONS: "unsubscribe-from-notifications";
    }>;
    static readonly SimulateDescriptorParametersType: Readonly<{
        readonly ADD: "add";
        readonly REMOVE: "remove";
    }>;
    static readonly SimulateDescriptorResponseParametersType: Readonly<{
        readonly READ: "read";
        readonly WRITE: "write";
    }>;
    static readonly CharacteristicEventGeneratedParametersType: Readonly<{
        readonly READ: "read";
        readonly WRITE_WITH_RESPONSE: "write-with-response";
        readonly WRITE_WITHOUT_RESPONSE: "write-without-response";
        readonly SUBSCRIBE_TO_NOTIFICATIONS: "subscribe-to-notifications";
        readonly UNSUBSCRIBE_FROM_NOTIFICATIONS: "unsubscribe-from-notifications";
    }>;
    static readonly DescriptorEventGeneratedParametersType: Readonly<{
        readonly READ: "read";
        readonly WRITE: "write";
    }>;
    static create(driver: unknown): Promise<Bluetooth>;
    /**
     * @param {BluetoothHandleRequestDevicePromptParameters} params
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-bluetooth-handleRequestDevicePrompt
     */
    handleRequestDevicePrompt(params: BluetoothHandleRequestDevicePromptParameters): Promise<void>;
    /**
     * @param {BluetoothSimulateAdapterParameters} params
     * @param {string} params.context
     * @param {boolean} [params.leSupported]
     * @param {BluetoothSimulateAdapterParametersState} params.state
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-bluetooth-simulateAdapter
     */
    simulateAdapter(params: BluetoothSimulateAdapterParameters): Promise<void>;
    /**
     * @param {BluetoothDisableSimulationParameters} params
     * @param {string} params.context
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-bluetooth-disableSimulation
     */
    disableSimulation(params: BluetoothDisableSimulationParameters): Promise<void>;
    /**
     * @param {BluetoothSimulatePreconnectedPeripheralParameters} params
     * @param {string} params.context
     * @param {string} params.address
     * @param {string} params.name
     * @param {Array<BluetoothBluetoothManufacturerData>} params.manufacturerData
     * @param {Array<BluetoothBluetoothUuid>} params.knownServiceUuids
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-bluetooth-simulatePreconnectedPeripheral
     */
    simulatePreconnectedPeripheral(params: BluetoothSimulatePreconnectedPeripheralParameters): Promise<void>;
    /**
     * @param {BluetoothSimulateAdvertisementParameters} params
     * @param {string} params.context
     * @param {BluetoothSimulateAdvertisementScanEntryParameters} params.scanEntry
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-bluetooth-simulateAdvertisement
     */
    simulateAdvertisement(params: BluetoothSimulateAdvertisementParameters): Promise<void>;
    /**
     * @param {BluetoothSimulateGattConnectionResponseParameters} params
     * @param {string} params.context
     * @param {string} params.address
     * @param {number} params.code
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-bluetooth-simulateGattConnectionResponse
     */
    simulateGattConnectionResponse(params: BluetoothSimulateGattConnectionResponseParameters): Promise<void>;
    /**
     * @param {BluetoothSimulateGattDisconnectionParameters} params
     * @param {string} params.context
     * @param {string} params.address
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-bluetooth-simulateGattDisconnection
     */
    simulateGattDisconnection(params: BluetoothSimulateGattDisconnectionParameters): Promise<void>;
    /**
     * @param {BluetoothSimulateServiceParameters} params
     * @param {string} params.context
     * @param {string} params.address
     * @param {BluetoothBluetoothUuid} params.uuid
     * @param {BluetoothSimulateServiceParametersType} params.type
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-bluetooth-simulateService
     */
    simulateService(params: BluetoothSimulateServiceParameters): Promise<void>;
    /**
     * @param {BluetoothSimulateCharacteristicParameters} params
     * @param {string} params.context
     * @param {string} params.address
     * @param {BluetoothBluetoothUuid} params.serviceUuid
     * @param {BluetoothBluetoothUuid} params.characteristicUuid
     * @param {BluetoothCharacteristicProperties} [params.characteristicProperties]
     * @param {BluetoothSimulateCharacteristicParametersType} params.type
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-bluetooth-simulateCharacteristic
     */
    simulateCharacteristic(params: BluetoothSimulateCharacteristicParameters): Promise<void>;
    /**
     * @param {BluetoothSimulateCharacteristicResponseParameters} params
     * @param {string} params.context
     * @param {string} params.address
     * @param {BluetoothBluetoothUuid} params.serviceUuid
     * @param {BluetoothBluetoothUuid} params.characteristicUuid
     * @param {BluetoothSimulateCharacteristicResponseParametersType} params.type
     * @param {number} params.code
     * @param {Array<number>} [params.data]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-bluetooth-simulateCharacteristicResponse
     */
    simulateCharacteristicResponse(params: BluetoothSimulateCharacteristicResponseParameters): Promise<void>;
    /**
     * @param {BluetoothSimulateDescriptorParameters} params
     * @param {string} params.context
     * @param {string} params.address
     * @param {BluetoothBluetoothUuid} params.serviceUuid
     * @param {BluetoothBluetoothUuid} params.characteristicUuid
     * @param {BluetoothBluetoothUuid} params.descriptorUuid
     * @param {BluetoothSimulateDescriptorParametersType} params.type
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-bluetooth-simulateDescriptor
     */
    simulateDescriptor(params: BluetoothSimulateDescriptorParameters): Promise<void>;
    /**
     * @param {BluetoothSimulateDescriptorResponseParameters} params
     * @param {string} params.context
     * @param {string} params.address
     * @param {BluetoothBluetoothUuid} params.serviceUuid
     * @param {BluetoothBluetoothUuid} params.characteristicUuid
     * @param {BluetoothBluetoothUuid} params.descriptorUuid
     * @param {BluetoothSimulateDescriptorResponseParametersType} params.type
     * @param {number} params.code
     * @param {Array<number>} [params.data]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-bluetooth-simulateDescriptorResponse
     */
    simulateDescriptorResponse(params: BluetoothSimulateDescriptorResponseParameters): Promise<void>;
}
