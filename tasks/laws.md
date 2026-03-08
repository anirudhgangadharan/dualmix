# Immutable Laws

1. NEVER create AudioContext outside a user gesture handler.
2. NEVER call createMediaElementSource() twice on the same <audio> element.
3. ALWAYS use setTargetAtTime() for gain changes, never direct .value assignment
   during playback (causes clicks/pops).
4. ONE AudioContext per app. Multiple contexts = sync drift + memory waste.
5. MediaElementSource captures the <audio> output. The element itself becomes
   silent. All output goes through the Web Audio graph.
6. StereoPannerNode pan=-1 means full left, pan=+1 means full right.
   This is NOT the same as ChannelSplitter which splits existing channels.
7. On mobile, audio.play() returns a Promise. ALWAYS await it and catch rejections.
8. File System Access API requires HTTPS context (or localhost).
9. iOS Safari does NOT support showDirectoryPicker(). Always have <input> fallback.
10. AudioBufferSourceNode is ONE-SHOT. Create a new one each play().
    We use MediaElementSource instead — it's reusable.
11. Gain values are LINEAR, not logarithmic. For perceptual volume control:
    perceptualGain = Math.pow(sliderValue, 2) where sliderValue is 0-1.
12. Always disconnect nodes before nullifying references, or they leak.
13. audioElement.src = '' releases the media resource. Do this on track removal.
14. The time constant in setTargetAtTime (3rd arg) controls smoothing speed.
    0.015 = ~15ms = imperceptible transition. 0.1 = noticeable fade.
