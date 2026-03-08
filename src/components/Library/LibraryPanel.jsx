import { useRef, useEffect } from 'react';
import useLibraryStore from '../../store/useLibraryStore.js';
import TrackItem from './TrackItem.jsx';
import Button from '../common/Button.jsx';

export default function LibraryPanel({ onAddTrack }) {
  const { files, search, loading, hasDirectoryAPI, openFolder, addFilesFromInput, setSearch, restoreFolder } =
    useLibraryStore();
  const filteredFiles = useLibraryStore((s) => s.filteredFiles)();
  const inputRef = useRef(null);

  // Try to restore previously selected folder on mount
  useEffect(() => {
    restoreFolder();
  }, [restoreFolder]);

  const handleFallbackInput = (e) => {
    addFilesFromInput(e.target.files);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Library</h2>
        <span className="text-slate-600 text-xs">{files.length} files</span>
      </div>

      {files.length === 0 && (
        <div className="flex flex-col gap-2">
          {hasDirectoryAPI && (
            <Button variant="primary" onClick={openFolder} disabled={loading}>
              {loading ? 'Scanning...' : 'Open Music Folder'}
            </Button>
          )}
          <label className="cursor-pointer block">
            <span className="px-3 py-1.5 rounded-lg font-medium text-sm bg-slate-700 text-slate-300 hover:bg-slate-600 active:bg-slate-500 transition-all duration-150 block text-center w-full select-none">
              {hasDirectoryAPI ? 'Or Select Files' : 'Select Audio Files'}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept="audio/*"
              multiple
              onChange={handleFallbackInput}
              className="hidden"
            />
          </label>
        </div>
      )}

      {files.length > 0 && (
        <>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/50 placeholder:text-slate-500"
          />
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto overscroll-contain">
            {filteredFiles.map((file) => (
              <TrackItem key={file.id} file={file} onAdd={onAddTrack} />
            ))}
            {filteredFiles.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">No matches</p>
            )}
          </div>
          <div className="flex gap-2">
            {hasDirectoryAPI && (
              <Button variant="default" onClick={openFolder} className="text-xs">
                Change Folder
              </Button>
            )}
            <label className="cursor-pointer">
              <span className="px-3 py-1.5 rounded-lg font-medium text-xs bg-slate-700 text-slate-300 hover:bg-slate-600 inline-block">
                + Add Files
              </span>
              <input
                type="file"
                accept="audio/*"
                multiple
                onChange={handleFallbackInput}
                className="hidden"
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
