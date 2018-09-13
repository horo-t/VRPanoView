# VRPanoView

VRPanoView is a JavaScript library to show [PhotoSphere](https://developers.google.com/streetview/spherical-metadata) and [VR photo](https://developers.google.com/vr/reference/cardboard-camera-vr-photo-format) images on web pages.

## VR mode

VRPanoView supports VR mode (ex: Cardboard or Daydream View), if the browser supports WebVR or WebXR.

In Chrome 69, you need to enable chrome://flags#enable-webvr or chrome://flags/#webxr.

## Demo

https://horo.jp/vrpanoview/demo.html

This demo page has an Origin-Trial token for WebXR.
So you can try the VR mode with Chrome 69 for Android without enabling chrome://flags/#webxr.

## Build
```
$ ./configure
$ make
```

## How to use
```html
<script src="path/to/vrpanoview.min.js"></script>
<script>
window.addEventListener('DOMContentLoaded', init, false);

function init() {
  const view = new VRPanoView({container: "vr_container"});
  view.Load('path/to/image.jpg');
}
</script>
<div id="vr_container" style="width: 320px; height: 240px;"></div>
```

## License
This library is available under the MIT license.
