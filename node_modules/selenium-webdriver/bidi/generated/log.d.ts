import type { JsUint } from './common.js';
import './common.js';
import type { ScriptRemoteValue, ScriptSource, ScriptStackTrace } from './script.js';
import './script.js';
import { Domain, type EventDescriptor } from '../domain.js';
export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogEntry = LogGenericLogEntry | LogConsoleLogEntry | LogJavascriptLogEntry;
export interface LogBaseLogEntry {
    level: LogLevel;
    source: ScriptSource;
    text: string | null;
    timestamp: JsUint;
    stackTrace?: ScriptStackTrace;
}
export interface LogGenericLogEntry {
    level: LogLevel;
    source: ScriptSource;
    text: string | null;
    timestamp: JsUint;
    stackTrace?: ScriptStackTrace;
    type: string;
}
export interface LogConsoleLogEntry {
    level: LogLevel;
    source: ScriptSource;
    text: string | null;
    timestamp: JsUint;
    stackTrace?: ScriptStackTrace;
    type: "console";
    method: string;
    args: Array<ScriptRemoteValue>;
}
export interface LogJavascriptLogEntry {
    level: LogLevel;
    source: ScriptSource;
    text: string | null;
    timestamp: JsUint;
    stackTrace?: ScriptStackTrace;
    type: "javascript";
}
export interface LogEntryAdded {
    method: "log.entryAdded";
    params: LogEntry;
}
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
export declare class Log extends Domain {
    /** @see https://w3c.github.io/webdriver-bidi/#event-log-entryAdded */
    static readonly ENTRY_ADDED: EventDescriptor<LogEntry>;
    static readonly Level: Readonly<{
        readonly DEBUG: "debug";
        readonly INFO: "info";
        readonly WARN: "warn";
        readonly ERROR: "error";
    }>;
    static create(driver: unknown): Promise<Log>;
}
