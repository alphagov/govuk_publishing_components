// utility types
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'silent';

interface Pojo {
  [x: string]: any;
}

interface AuthCredentials {
  username: string;
  password: string;
}

interface DiscoveryOptions {
  requestHeaders?: Pojo;
  authorization?: AuthCredentials;
  allowedHostnames?: string[];
  disableCache?: boolean;
  captureMockedServiceWorker?: boolean;
  captureSrcset?: boolean;
  devicePixelRatio?: number; 
}

interface ScopeOptions {
  scroll?: boolean;
}

interface DiscoveryLaunchOptions {
  executable?: string;
  args?: string[];
  timeout?: number;
  headless?: boolean;
}

interface AllDiscoveryOptions extends DiscoveryOptions {
  networkIdleTimeout?: number;
  concurrency?: number;
  launchOptions?: DiscoveryLaunchOptions;
}

interface CommonSnapshotOptions {
  widths?: number[];
  scope?: string;
  minHeight?: number;
  percyCSS?: string;
  enableJavaScript?: boolean;
  cliEnableJavascript?: boolean;
  disableShadowDOM?: boolean;
  domTransformation?: string;
  enableLayout?: boolean;
  sync?: boolean;
  responsiveSnapshotCapture?: boolean;
  testCase?: string;
  labels?: string;
  reshuffleInvalidTags?: boolean;
  devicePixelRatio?: number;
  scopeOptions?: ScopeOptions;
  browsers?: string[];
}
// Region support for TypeScript
interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Padding {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

interface ElementSelector {
  boundingBox?: BoundingBox;
  elementXpath?: string;
  elementCSS?: string;
}

interface RegionConfiguration {
  diffSensitivity?: number;
  imageIgnoreThreshold?: number;
  carouselsEnabled?: boolean;
  bannersEnabled?: boolean;
  adsEnabled?: boolean;
}

interface RegionAssertion {
  diffIgnoreThreshold?: number;
}

export interface Region {
  algorithm: string;
  elementSelector: ElementSelector;
  padding?: Padding;
  configuration?: RegionConfiguration;
  assertion?: RegionAssertion;
}

export interface CreateRegionOptions {
  boundingBox?: BoundingBox;
  elementXpath?: string;
  elementCSS?: string;
  padding?: Padding;
  algorithm?: string;
  diffSensitivity?: number;
  imageIgnoreThreshold?: number;
  carouselsEnabled?: boolean;
  bannersEnabled?: boolean;
  adsEnabled?: boolean;
  diffIgnoreThreshold?: number;
}

export function createRegion(options: CreateRegionOptions): Region;

export interface SnapshotOptions extends CommonSnapshotOptions {
  discovery?: DiscoveryOptions;
  regions?: Region[];
}

type ClientEnvInfo = {
  clientInfo?: string,
  environmentInfo?: string
}

export type PercyConfigOptions<C = Pojo> = C & {
  snapshot?: CommonSnapshotOptions,
  discovery?: AllDiscoveryOptions
}

export type PercyOptions<C = Pojo> = {
  token?: string,
  server?: boolean,
  port?: number,
  concurrency?: number,
  loglevel?: LogLevel,
  config?: undefined | string | false
} & ClientEnvInfo & PercyConfigOptions<C>;

type SnapshotExec = () => void | Promise<void>;

type AdditionalSnapshot = (XOR<XOR<
  { name: string },
  { prefix: string, suffix?: string }>,
  { suffix: string, prefix?: string }>
) & { execute: SnapshotExec };

declare class Percy {
  static start(options?: PercyOptions): Promise<Percy>;
  constructor(options?: PercyOptions);
  loglevel(): LogLevel;
  loglevel(level: LogLevel): void;
  config: PercyConfigOptions;
  setConfig(config: ClientEnvInfo & PercyConfigOptions): PercyConfigOptions;
  start(): Promise<void>;
  stop(force?: boolean): Promise<void>;
  idle(): Promise<void>;
  close(): void;

  snapshot(options: {
    url: string,
    name?: string,
    clientInfo?: string,
    environmentInfo?: string
  } & XOR<{
    domSnapshot: string
  }, {
    waitForTimeout?: number,
    waitForSelector?: string,
    execute?: SnapshotExec,
    additionalSnapshots?: AdditionalSnapshot[]
  }> & SnapshotOptions): Promise<void>;
}

export default Percy;
