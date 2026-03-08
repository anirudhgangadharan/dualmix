import { SUPPORTED_EXTENSIONS } from '../engine/constants.js';
import { storeHandle, getHandle } from './db.js';

const DIR_HANDLE_KEY = 'music-dir';

function isAudioFile(name) {
  const ext = name.split('.').pop().toLowerCase();
  return SUPPORTED_EXTENSIONS.includes(ext);
}

export async function openMusicFolder() {
  try {
    if ('showDirectoryPicker' in window) {
      const dirHandle = await window.showDirectoryPicker({
        id: 'music-folder',
        mode: 'read',
        startIn: 'music',
      });
      await storeHandle(DIR_HANDLE_KEY, dirHandle);
      return dirHandle;
    }
  } catch (e) {
    if (e.name === 'AbortError') return null;
  }
  // Fallback handled by caller via <input>
  return null;
}

export async function getStoredDirHandle() {
  try {
    const handle = await getHandle(DIR_HANDLE_KEY);
    if (!handle) return null;
    // Verify permission still granted
    const perm = await handle.queryPermission({ mode: 'read' });
    if (perm === 'granted') return handle;
    const req = await handle.requestPermission({ mode: 'read' });
    return req === 'granted' ? handle : null;
  } catch {
    return null;
  }
}

export async function scanAudioFiles(dirHandle, onBatch) {
  const files = [];
  const batchSize = 50;

  async function walk(dir, path = '') {
    try {
      for await (const [name, handle] of dir) {
        if (handle.kind === 'file' && isAudioFile(name)) {
          files.push({
            id: `${path}/${name}`,
            name,
            path: path ? `${path}/${name}` : name,
            handle,
          });
          if (files.length % batchSize === 0 && onBatch) {
            onBatch([...files]);
          }
        } else if (handle.kind === 'directory') {
          await walk(handle, path ? `${path}/${name}` : name);
        }
      }
    } catch {
      // Permission denied on subdirectory, skip
    }
  }

  await walk(dirHandle);
  return files;
}

export async function getFileUrl(fileHandle) {
  const file = await fileHandle.getFile();
  return URL.createObjectURL(file);
}

export function supportsDirectoryPicker() {
  return 'showDirectoryPicker' in window;
}
