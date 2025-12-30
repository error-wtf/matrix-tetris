Sound Files Directory
=====================

This directory should contain the following OGG sound files:

1. drop.ogg       - Sound when a piece lands
2. rotate.ogg     - Sound when rotating a piece
3. lineclear.ogg  - Sound when clearing lines
4. levelup.ogg    - Sound when leveling up (wind gust effect)
5. gameover.ogg   - Sound when game ends (mast break effect)

You can:
- Generate these sounds using online tools like:
  * https://sfxr.me/ (retro game sounds)
  * https://www.zapsplat.com/ (free sound effects)
  * https://freesound.org/ (creative commons sounds)

- Or use text-to-speech/AI sound generators

- Or record your own sounds and convert them to OGG format

The game will work without sounds, but they enhance the experience!

To convert MP3/WAV to OGG, you can use:
- Online converter: https://www.online-convert.com/
- FFmpeg command: ffmpeg -i input.mp3 -c:a libvorbis output.ogg
