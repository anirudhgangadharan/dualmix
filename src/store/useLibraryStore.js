import { create } from 'zustand';
import { openMusicFolder, scanAudioFiles, getStoredDirHandle, supportsDirectoryPicker } from '../utils/fileAccess.js';

const useLibraryStore = create((set, get) => ({
  files: [],
  search: '',
  loading: false,
  dirHandle: null,
  hasDirectoryAPI: supportsDirectoryPicker(),

  setSearch: (search) => set({ search }),

  filteredFiles: () => {
    const { files, search } = get();
    if (!search) return files;
    const q = search.toLowerCase();
    return files.filter((f) => f.name.toLowerCase().includes(q));
  },

  openFolder: async () => {
    set({ loading: true });
    const dirHandle = await openMusicFolder();
    if (!dirHandle) {
      set({ loading: false });
      return;
    }
    set({ dirHandle });
    const files = await scanAudioFiles(dirHandle, (batch) => {
      set({ files: batch });
    });
    set({ files, loading: false });
  },

  addFilesFromInput: (fileList) => {
    const audioFiles = Array.from(fileList)
      .filter((f) => f.type.startsWith('audio/') || /\.(mp3|wav|ogg|flac|aac|m4a|webm|opus)$/i.test(f.name))
      .map((f) => ({
        id: `input-${f.name}-${f.size}`,
        name: f.name,
        path: f.webkitRelativePath || f.name,
        file: f, // Direct File object (fallback mode)
        handle: null,
      }));
    set((state) => ({ files: [...state.files, ...audioFiles] }));
  },

  restoreFolder: async () => {
    const dirHandle = await getStoredDirHandle();
    if (!dirHandle) return false;
    set({ dirHandle, loading: true });
    const files = await scanAudioFiles(dirHandle);
    set({ files, loading: false });
    return true;
  },
}));

export default useLibraryStore;
