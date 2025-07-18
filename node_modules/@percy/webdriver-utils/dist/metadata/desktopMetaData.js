import Cache from '../util/cache.js';
export default class DesktopMetaData {
  constructor(driver, opts) {
    this.driver = driver;
    this.capabilities = opts;
  }
  device() {
    return false;
  }
  browserName() {
    var _this$capabilities;
    return (_this$capabilities = this.capabilities) === null || _this$capabilities === void 0 || (_this$capabilities = _this$capabilities.browserName) === null || _this$capabilities === void 0 ? void 0 : _this$capabilities.toLowerCase();
  }
  browserVersion() {
    var _this$capabilities2;
    return (_this$capabilities2 = this.capabilities) === null || _this$capabilities2 === void 0 || (_this$capabilities2 = _this$capabilities2.browserVersion) === null || _this$capabilities2 === void 0 ? void 0 : _this$capabilities2.split('.')[0];
  }
  osName() {
    var _this$capabilities3, _osName, _this$capabilities4;
    let osName = (_this$capabilities3 = this.capabilities) === null || _this$capabilities3 === void 0 ? void 0 : _this$capabilities3.os;
    if (osName) return (_osName = osName) === null || _osName === void 0 ? void 0 : _osName.toLowerCase();
    osName = (_this$capabilities4 = this.capabilities) === null || _this$capabilities4 === void 0 ? void 0 : _this$capabilities4.platform;
    return osName;
  }

  // showing major version
  osVersion() {
    var _this$capabilities5;
    return (_this$capabilities5 = this.capabilities) === null || _this$capabilities5 === void 0 || (_this$capabilities5 = _this$capabilities5.osVersion) === null || _this$capabilities5 === void 0 ? void 0 : _this$capabilities5.toLowerCase();
  }

  // combination of browserName + browserVersion + osVersion + osName
  deviceName() {
    return this.osName() + '_' + this.osVersion() + '_' + this.browserName() + '_' + this.browserVersion();
  }
  orientation() {
    return 'landscape';
  }
  async windowSize() {
    const dpr = await this.devicePixelRatio();
    const data = await this.driver.getWindowSize();
    const width = parseInt(data.value.width * dpr),
      height = parseInt(data.value.height * dpr);
    return {
      width,
      height
    };
  }
  async screenResolution() {
    return await Cache.withCache(Cache.resolution, this.driver.sessionId, async () => {
      const data = await this.driver.executeScript({
        script: 'return [parseInt(window.screen.width * window.devicePixelRatio).toString(), parseInt(window.screen.height * window.devicePixelRatio).toString()];',
        args: []
      });
      const screenInfo = data.value;
      return `${screenInfo[0]} x ${screenInfo[1]}`;
    });
  }
  async devicePixelRatio() {
    return await Cache.withCache(Cache.dpr, this.driver.sessionId, async () => {
      const devicePixelRatio = await this.driver.executeScript({
        script: 'return window.devicePixelRatio;',
        args: []
      });
      return devicePixelRatio.value;
    });
  }
}