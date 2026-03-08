# DualMix — Task Tracker

## Phase 1: Foundation
- [x] 1.1 Scaffold Vite + React + Tailwind + Zustand project
- [x] 1.2 Create AudioEngine singleton with init/resume
- [x] 1.3 Create TrackNode class with full L/R routing
- [ ] 1.4 PWA manifest + service worker registration

## Phase 2: File Access
- [x] 2.1 Implement showDirectoryPicker() with fallback
- [x] 2.2 Recursive directory scan for audio files
- [x] 2.3 IndexedDB persistence of directory handles
- [x] 2.4 Library state management (Zustand store)

## Phase 3: Core Playback
- [x] 3.1 Load file into <audio> element from FileSystemFileHandle
- [x] 3.2 Create MediaElementSource, wire through TrackNode
- [x] 3.3 Play/pause/seek controls working
- [x] 3.4 Routing selector (L / Both / R) working
- [x] 3.5 Volume control per track working
- [x] 3.6 Multiple simultaneous tracks playing

## Phase 4: UI
- [x] 4.1 Library panel with file list + search
- [x] 4.2 Active tracks panel with channel strips
- [x] 4.3 Mobile-responsive layout
- [x] 4.4 Touch-friendly slider components

## Phase 5: Polish
- [x] 5.1 Smooth gain transitions (no clicks on routing change)
- [x] 5.2 Track end handling
- [x] 5.3 Media Session API for lock screen controls
- [x] 5.4 Error handling
