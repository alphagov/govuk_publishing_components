import os from 'os';
import si from 'systeminformation';
import { promises as fs } from 'fs';
import logger from '@percy/logger';
import { pathsExist } from './utils.js';
const CGROUP_CPU_STATS = '/sys/fs/cgroup/cpu.stat';
const CGROUP_CPU_MAX = '/sys/fs/cgroup/cpu.max';
const CGROUP_FILES = [CGROUP_CPU_MAX, CGROUP_CPU_STATS];
const log = logger('monitoring:cpu');

/**
 * Retrieves CPU information.
 * @param {*} os - The OS module (if needed, otherwise remove this parameter).
 * @param {*} param1 - An object containing CPU details.
 * @returns {{ currentUsagePercent: number, cores: number, cgroupExists: boolean }} CPU information.
 */
async function getCPUUsageInfo(os) {
  try {
    if (os.includes('linux') && (await pathsExist(CGROUP_FILES))) {
      return await getLinuxCPUUsage();
    } else {
      return await getCPUUsage();
    }
  } catch (error) {
    // Don't raise this error to avoid user build failure
    // show error in debug mode only
    log.debug(`Error: ${error}`);
    return {};
  }
}

/**
 * reading cpu stats from cgroup files
 */
async function readCpuStatFromCgroup() {
  const content = await fs.readFile(CGROUP_CPU_STATS, 'utf8');
  const stats = {};

  // Parse the cpu.stat file
  content.split('\n').forEach(line => {
    const [key, value] = line.trim().split(' ');
    if (key && value) {
      stats[key] = parseInt(value);
    }
  });
  return stats;
}
async function getTotalCores() {
  let availableCPUs = (await si.cpu()).cores;
  try {
    // Read cpu.max for quota and period
    const cpuMaxContent = await fs.readFile(CGROUP_CPU_MAX, 'utf8');
    const [quotaStr, periodStr] = cpuMaxContent.trim().split(' ');
    let quota, period;
    if (quotaStr !== 'max') {
      // Parse quota and period values
      quota = parseInt(quotaStr);
      period = parseInt(periodStr);
      availableCPUs = quota / period;
    }
  } catch (error) {
    // supressing this err, as we will use fallback system
    // level cpu details
  }
  return availableCPUs;
}
async function getClientCPUDetails() {
  const cores = await getTotalCores();
  return {
    arch: os.arch(),
    cores
  };
}

/**
 * linux cpu load is calculated is same for
 * containerLevel and machineLevel
 * @returns {{ currentUsagePercent: number, cores: number }} CPU information.
 */
async function getLinuxCPUUsage() {
  try {
    const availableCPUs = await getTotalCores();

    // Get first CPU usage reading
    const startStats = await readCpuStatFromCgroup();

    // Wait for 1 second, ie 10^6 microsecod
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get second CPU usage reading
    const endStats = await readCpuStatFromCgroup();

    // Calculate CPU usage
    const usageDelta = endStats.usage_usec - startStats.usage_usec;

    // Calculate percentage (similar to previous implementation)
    // usageDelta is in microseconds, we measured over 1 second (1_000_000 microseconds)
    // NOTE: cpuPercentage can be > 100% as something process can use
    // more than allocated cpu range
    const cpuPercent = usageDelta / (1_000_000 * availableCPUs) * 100;
    return {
      cores: availableCPUs,
      currentUsagePercent: cpuPercent,
      cgroupExists: true
    };
  } catch (error) {
    // TODO: Log error here
    log.debug('Linux c_group cpu usage error:', error);
    // using fallback method to get details
    return await getCPUUsage();
  }
}

/**
 * Each cpu.times has following 4 details
 * {
    user: time spent running user code
    nice: time spent running user code at low priority
    sys: time spent running system/kernel code
    idle: time CPU was idle
    irq: time spent handling interrupts
  }
 */
async function computeCpuUsageStats() {
  let totalTickTime = 0;
  let totalIdleTime = 0;
  os.cpus().forEach(cpu => {
    for (let type in cpu.times) {
      totalTickTime += cpu.times[type];
    }
    totalIdleTime += cpu.times.idle;
  });
  return {
    totalTickTime,
    totalIdleTime
  };
}
;

/**
 * this is a fallback method, if
 * 1. For LINUX, we can't find cgroup details
 * 2. For Win/OSX operating system
 * @returns {{ currentUsagePercent: number, cores: number, cgroupExists: boolean }}
 */
async function getCPUUsage() {
  const initialCpuUsage = await computeCpuUsageStats();
  // wait for 1 second, to connect cpu load for 10^6 micro-second
  // ie. 1 second
  await new Promise(res => setTimeout(res, 1000));
  const finalCpuUsage = await computeCpuUsageStats();

  // Calculate differences
  const deltaTick = finalCpuUsage.totalTickTime - initialCpuUsage.totalTickTime;
  const deltaIdle = finalCpuUsage.totalIdleTime - initialCpuUsage.totalIdleTime;

  // Calculate % usage
  let cpuUsagePercent = null;

  // Case: If no cpu usage is done from 1 sec, then delta will be 0
  // raising error zero division error
  // ideally it shouldn't happen
  if (deltaTick > 0) {
    cpuUsagePercent = (1 - deltaIdle / deltaTick) * 100;
  } else cpuUsagePercent = 0;
  let cores = await getTotalCores();
  return {
    cores,
    currentUsagePercent: cpuUsagePercent,
    cgroupExists: false
  };
}
export { getCPUUsageInfo, getClientCPUDetails };