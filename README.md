# Illustrator Layer Animation, redux!

**[ExtendScript](http://en.wikipedia.org/wiki/ExtendScript) (`.jsx`) used to animate Adobe Illustrator’s layers in order to preview sequenced layer frames for animation.**

## Why “redux”?

My [first layer animation script](https://github.com/pixelfoot/illy-anim) stopped working [after an OS X El Capitan upgrade](https://forums.adobe.com/message/8206533), so … I ended up writing Layer Animation II.jsx.

## Compatibility

I have only had the opportunity to test this code on OS X El Capitan and Illustrator CC 2015.

## Installation

Use the below single-line Unix bash command(s) to quickly install this script into your Illustrator `Scripts` folder.

```bash
bash <(curl -sL https://git.io/vVuxA)
```

Alternatively, you can dowload Layer Animation II.jsx into your Illustrator `Scripts` folder, located in the `/lllustrator CC/Presets` folder in your `lllustrator CC` installation directory.

The script’s filename, minus the file extension, will appear in the Scripts menu.

## Usage

Palette window:

![](example.png)

Using the radio and check box options, click the `Start` button to animate through layers.

This plugin will use the “active” layer as the starting frame; upon palette close, the original layer visibility will be restored.

**More documentation coming soon.**

## Big ups …

… to **all of the awesome and helpful peeps** on the [Adobe Illustrator scripting forums](https://forums.adobe.com/community/illustrator/illustrator_scripting), especially:

* [@Silly-V](https://github.com/Silly-V) / [Silly-V](https://forums.adobe.com/people/Silly-V)
* [@qwertyfly](https://github.com/Qwertyfly) / [Qwertyfly...](https://forums.adobe.com/people/Qwertyfly...)
* [@ten-A](https://github.com/ten-A) / [Ten A](https://forums.adobe.com/people/Ten A)
* [CarlosCanto](https://forums.adobe.com/people/CarlosCanto)
* [williamadowling](https://forums.adobe.com/people/williamadowling)

---

Copyright © 2015-2016 [Michael Hulse](http://mky.io).

Licensed under the Apache License, Version 2.0 (the “License”); you may not use this work except in compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
