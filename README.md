# Illustrator Layer Animation, redux!

**[ExtendScript](http://en.wikipedia.org/wiki/ExtendScript) (`.jsx`) used to animate Adobe Illustrator’s layers in order to preview sequenced layer frames for animation.**

## Why “redux”?

My [first layer animation script](https://github.com/pixelfoot/illy-anim) stopped working [after an OS X El Capitan upgrade](https://forums.adobe.com/message/8206533), so … I ended up writing [Layer Animation II.jsx](Layer Animation II.jsx).

## Installation

Use the below single-line bash command(s) to install this script into your Illustrator `Scripts` folder.

```bash
$ cd /Applications/Adobe\ Illustrator\ CC\ 2015/Presets.localized/en_US/Scripts && mkdir -p @mhulse && cd @mhulse && curl -#L https://github.com/mhulse/illy-anim-redux/tarball/master | tar -xzv --strip-components 1 --include=*/Layer\ Animation\ II\.jsx --exclude=*/**/*
```
