import os from 'os';
import fs from 'fs';
import logger from '@percy/logger';
import { getCPUUsageInfo, getClientCPUDetails } from './cpu.js';
import { getMemoryUsageInfo, getClientMemoryDetails } from './memory.js';
export default class Monitoring {
  constructor() {
    this.os = this.getOS();
    this.monitoringId = null;
    this.running = false;
    this.isContainer = this.isContainerLevel();
    this.isPod = this.isPodLevel();
    this.isMachine = this.isMachineLevel();
    this.lastExecutedAt = null;
    this.pod = this.isPodLevel();
    this.cpuInfo = {};
    this.memoryUsageInfo = {};
    this.log = logger('monitoring');
  }
  getOS() {
    return os.platform();
  }
  getPercyEnv() {
    const percyKeys = Object.keys(process.env).filter(env => env.toLowerCase().includes('percy') && !env.toLowerCase().includes('token'));
    let envs = {};
    percyKeys.forEach(env => {
      envs[env] = process.env[env];
    });
    return envs;
  }
  isContainerLevel() {
    return fs.existsSync('/.dockerenv');
  }
  isPodLevel() {
    return fs.existsSync('/var/run/secrets/kubernetes.io');
  }
  isMachineLevel() {
    return !this.isContainerLevel();
  }
  async logSystemInfo() {
    try {
      const cpu = await getClientCPUDetails();
      const mem = await getClientMemoryDetails();
      const percyEnvs = this.getPercyEnv();
      this.log.debug(`[Operating System] Platform: ${this.os}, Type: ${os.type()}, Release: ${os.release()}`);
      this.log.debug(`[CPU] Arch: ${cpu.arch}, cores: ${cpu.cores}`);
      this.log.debug(`[Memory] Total: ${mem.total / 1024 ** 3} gb, Swap Space: ${mem.swaptotal / 1024 ** 3} gb`);
      this.log.debug(`Container Level: ${this.isContainer}, Pod Level: ${this.isPod}, Machine Level: ${this.isMachine}`);
      this.log.debug(`Percy Envs: ${JSON.stringify(percyEnvs)}`);
    } catch (error) {
      // suppress error
      this.log.debug(`Error logging system info: ${error}`);
    }
  }

  /**
   * It will start monitoring at certain interval
   * by default every 5 seconds
   */
  async startMonitoring(options = {}) {
    const {
      interval = 5000
    } = options;
    // early return if already monitoring
    if (this.monitoringId) return;
    await this.executeMonitoring();
    this.monitoringId = setInterval(() => {
      this.executeMonitoring();
    }, interval);
    this.log.debug('Started monitoring sytem metrics');
  }
  async executeMonitoring() {
    this.running = true;
    await this.monitoringCPUUsage();
    await this.monitorMemoryUsage();
    this.lastExecutedAt = Date.now();
  }
  stopMonitoring() {
    if (this.monitoringId) {
      clearInterval(this.monitoringId);
      this.monitoringId = null;
      this.cpuInfo = {};
      this.memoryUsageInfo = {};
      this.running = false;
      this.lastExecutedAt = null;
      this.log.debug('Stopped monitoring sytem metrics');
    }
  }
  async monitoringCPUUsage() {
    const cpuInfo = await getCPUUsageInfo(this.os, {
      containerLevel: this.isContainer,
      machineLevel: this.isMachine
    });
    this.cpuInfo = cpuInfo;
    this.log.debug(`cpuInfo: ${JSON.stringify(cpuInfo)}`);
  }
  async monitorMemoryUsage() {
    const memoryInfo = await getMemoryUsageInfo(this.os, {
      containerLevel: this.isContainer,
      machineLevel: this.isMachine
    });
    this.memoryUsageInfo = memoryInfo;
    this.log.debug(`memoryInfo: ${JSON.stringify(memoryInfo)}`);
  }

  // Whenever, this will get called to get
  // cpu and memory usage info
  getMonitoringInfo() {
    return {
      cpuInfo: this.cpuInfo,
      memoryUsageInfo: this.memoryUsageInfo
    };
  }
}