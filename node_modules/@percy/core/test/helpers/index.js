import { resetPercyConfig, mockfs as mfs, fs } from '@percy/config/test/helpers';
import logger from '@percy/logger/test/helpers';
import api from '@percy/client/test/helpers';
import path from 'path';
import url from 'url';

export function mockfs(initial) {
  return mfs({
    ...initial,

    $bypass: [
      path.resolve(url.fileURLToPath(import.meta.url), '/../../../dom/dist/bundle.js'),
      path.resolve(url.fileURLToPath(import.meta.url), '../secretPatterns.yml'),
      p => p.includes?.('.local-chromium'),
      // Per-port lockfiles live under ~/.percy/. They
      // are infrastructure (not test fixture data), so route the entire
      // directory (mkdir, writeFile, readFile, unlink) through the real
      // fs. Matching only `/.percy/agent-` lets `writeFileSync` pass but
      // routes `mkdirSync` for the parent through memfs, leaving the
      // parent directory non-existent on the real fs and producing
      // ENOENT cascades on CI. Match both POSIX `/` and Windows `\`
      // separators because the Windows runner normalizes paths
      // inconsistently across mkdir/writeFile/unlink.
      p => typeof p === 'string' && /[/\\]\.percy(?:[/\\]|$)/.test(p),
      ...(initial?.$bypass ?? [])
    ]
  });
}

export async function setupTest({
  resetConfig,
  filesystem,
  loggerTTY,
  apiDelay
} = {}) {
  await api.mock({ delay: apiDelay });
  await logger.mock({ isTTY: loggerTTY });
  await resetPercyConfig(resetConfig);
  await mockfs(filesystem);
}

export * from '@percy/client/test/helpers';
export { createTestServer } from './server.js';
export { dedent } from './dedent.js';
export { logger, fs };
