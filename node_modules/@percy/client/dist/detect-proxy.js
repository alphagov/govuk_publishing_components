import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import logger from '@percy/logger';
export default class DetectProxy {
  constructor() {
    this.execPromise = promisify(exec);
    this.platform = process.platform;
    // There are sock proxies as well which we don't need
    this.filter = ['HTTP', 'HTTPS'];
  }
  async getSystemProxy() {
    if (this.platform === 'darwin') {
      return await this.getProxyFromMac();
    } else if (this.platform === 'win32') {
      return await this.getProxyFromWindows();
    } else if (this.platform !== 'linux') {
      logger('client:detect-proxy').debug(`Not able to auto detect system proxy for ${this.platform} platform`);
    }
    return [];
  }
  async getProxyFromMac() {
    // Sample output
    /*
        HTTPEnable : 1
        HTTPProxy : proxy.example.com
        HTTPPort : 8080
        HTTPSEnable : 1
        HTTPSProxy : secureproxy.example.com
        HTTPSPort : 8443
    */
    const {
      stdout
    } = await this.execPromise('scutil --proxy');
    const dictionary = {};
    const lines = stdout.split('\n');
    lines.forEach(line => {
      let [key, value] = line.split(' : ');
      if (key && value) {
        key = key.trim();
        value = value.trim();
        if (key.endsWith('Enable')) {
          dictionary[key] = value === '1';
        } else if (key.endsWith('Port')) {
          dictionary[key] = parseInt(value);
        } else {
          dictionary[key] = value;
        }
      }
    });
    const proxies = [];
    for (const type of this.filter) {
      if (dictionary[`${type}Enable`] && dictionary[`${type}Proxy`] && dictionary[`${type}Port`]) {
        proxies.push({
          type: type,
          host: dictionary[`${type}Proxy`],
          port: dictionary[`${type}Port`]
        });
      }
    }
    return proxies;
  }
  async getProxyFromWindows() {
    // Sample output
    /*
        HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings
        User Agent    REG_SZ    Mozilla/4.0 (compatible; MSIE 8.0; Win32)
        IE5_UA_Backup_Flag    REG_SZ    5.0
        ZonesSecurityUpgrade    REG_BINARY    ABCD
        EmailName    REG_SZ    User@
        AutoConfigProxy    REG_SZ    wininet.dll
        MimeExclusionListForCache    REG_SZ    multipart/mixed multipart/x-mixed-replace multipart/x-byteranges
        WarnOnPost    REG_BINARY    01000000
        UseSchannelDirectly    REG_BINARY    01000000
        EnableHttp1_1    REG_DWORD    0x1
        UrlEncoding    REG_DWORD    0x0
        SecureProtocols    REG_DWORD    0xa0
        PrivacyAdvanced    REG_DWORD    0x0
        DisableCachingOfSSLPages    REG_DWORD    0x1
        WarnonZoneCrossing    REG_DWORD    0x1
        CertificateRevocation    REG_DWORD    0x1
        EnableNegotiate    REG_DWORD    0x1
        MigrateProxy    REG_DWORD    0x1
        ProxyEnable    REG_DWORD    0x0
    */
    const {
      stdout
    } = await this.execPromise('reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings"');
    const lines = stdout.split('\n');
    const dictionary = {};
    lines.forEach(line => {
      const [key, type, value] = line.trim().split(/\s+/);
      if (key && type && value) {
        if (type === 'REG_DWORD') {
          dictionary[key] = value === '0x1';
        } else if (type === 'REG_SZ') {
          dictionary[key] = value;
        }
      }
    });
    if (this.filter.includes('HTTP') && dictionary.ProxyEnable && dictionary.ProxyServer) {
      const [host, port] = dictionary.ProxyServer.split(':');
      return [{
        type: 'HTTP',
        host,
        port: parseInt(port)
      }];
    }
    return [];
  }
}