import { promises as fs } from 'fs';
import si from 'systeminformation';
import logger from '@percy/logger';
import { pathsExist } from './utils.js';
const CGROUP_MEMORY_CURRENT = '/sys/fs/cgroup/memory.current';
const CGROUP_MEMORY_MAX = '/sys/fs/cgroup/memory.max';
const CGROUP_FILES = [CGROUP_MEMORY_CURRENT, CGROUP_MEMORY_MAX];
const log = logger('monitoring:memory');

/**
 * Retrieves CPU information.
 * @param {*} os - The OS module (if needed, otherwise remove this parameter).
 * @param {*} param1 - An object containing CPU details.
 * @returns {{ currentUsagePercent: number, totalMemory: number }} Memory information.
 */
async function getMemoryUsageInfo(os) {
  try {
    if (os.includes('linux') && (await pathsExist(CGROUP_FILES))) {
      return await getLinuxMemoryUsage();
    } else {
      return await getMemoryUsage();
    }
  } catch (error) {
    log.debug(`Error: ${error}`);
    return {};
  }
}

/**
 * @returns { swaptotal: number, total: number }
 */
async function getClientMemoryDetails() {
  // values are in bytes
  const {
    swaptotal
  } = await si.mem();
  const total = await getTotalMemory();
  return {
    swaptotal,
    total
  };
}
async function getTotalMemory() {
  let maxAllocatedMemory = (await si.mem()).total;
  try {
    let maxMemory = await fs.readFile(CGROUP_MEMORY_MAX);
    // if memory_max == max ( take system max value )
    // as there is no limit set, it's the max value
    if (maxMemory !== 'max') {
      maxAllocatedMemory = parseInt(maxMemory);
    }
  } catch (error) {
    // supressing this err, as we will use system level metric
    // as fallback
  }

  // in bytes
  return maxAllocatedMemory;
}

/**
 * get memory usage using linux c_group ( control group )
 * @returns {{ currentUsagePercent: number, totalMemory: number }} Memory information.
 */
async function getLinuxMemoryUsage() {
  try {
    const maxAllocatedMemory = await getTotalMemory(); // in bytes
    const currentMemoryUsage = parseInt(await fs.readFile(CGROUP_MEMORY_CURRENT)); // in bytes
    const memoryUsagePercentage = currentMemoryUsage / maxAllocatedMemory * 100;
    return {
      totalMemory: maxAllocatedMemory,
      currentUsagePercent: memoryUsagePercentage
    };
  } catch (error) {
    log.debug('Linux c_group memory usage error:', error);

    // Use the fallback method, to get memory usage details
    return await getMemoryUsage();
  }
}

/**
 * Fallback method, for
 * 1. LINUX, if cgroups files doesn't exists
 * 2. MacOSX, Windows based OS
 *
 * @returns {{ currentUsagePercent: number, totalMemory: number }} Memory information.
 */
async function getMemoryUsage() {
  // Get total and free memory
  const memInfo = await si.mem();
  const totalMemory = memInfo.total;
  const freeMemory = memInfo.available;

  // Calculate memory usage percentage
  const usedMemory = totalMemory - freeMemory;
  const memoryUsagePercentage = usedMemory / totalMemory * 100;
  return {
    currentUsagePercent: memoryUsagePercentage,
    totalMemory
  };
}
export { getMemoryUsageInfo, getClientMemoryDetails };