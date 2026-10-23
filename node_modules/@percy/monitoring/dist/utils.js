import { promises as fs } from 'fs';
async function pathsExist(paths) {
  let exists = true;
  try {
    for (const file of paths) {
      // throws error if file is not accessible
      await fs.access(file);
    }
  } catch (error) {
    exists = false;
  }
  return exists;
}
export { pathsExist };