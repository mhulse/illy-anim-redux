# Illustrator Layer Animation, redux!

**[ExtendScript](http://en.wikipedia.org/wiki/ExtendScript) (`.jsx`) used to animate Adobe Illustrator’s layers in order to preview sequenced layer frames for animation.**

## Why “redux”?

My [first layer animation script](https://github.com/pixelfoot/illy-anim) stopped working [after an OS X El Capitan upgrade](https://forums.adobe.com/message/8206533), so … I ended up writing [Layer Animation II.jsx](Layer Animation II.jsx).

## Installation

Use the below single-line bash command(s) to install this script into your Illustrator `Scripts` folder.

```bash
$ cd /Applications/Adobe\ Illustrator\ CC\ 2015/Presets.localized/en_US/Scripts && mkdir -p @mhulse && cd @mhulse && curl -#L https://github.com/mhulse/illy-anim-redux/tarball/master | tar -xzv --strip-components 1 --include=*/Layer\ Animation\ II\.jsx --exclude=*/**/*
```
## Usage

Palette window:

![illy-anim-ii-palette](https://cloud.githubusercontent.com/assets/218624/12005504/18bdc7f4-ab5d-11e5-847b-fa80a28fa457.png)

Using the radio and check box options, click the `Start` button to animate through layers.

More information coming soon.

---

Copyright © 2015-2016 [Michael Hulse](http://mky.io).

Licensed under the Apache License, Version 2.0 (the “License”); you may not use this work except in compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

<img src="https://github.global.ssl.fastly.net/images/icons/emoji/octocat.png">
