
/** 
 * @const {string}
 * @private
 */
const VR_ICON_BASE64 =
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVp' +
  'Z2h0PSIyNCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxs' +
  'PSIjMDAwIiBkPSJNMjAuNjQgNkgzLjJDMi41NSA2IDIgNi41NyAyIDcuMjdWMTcuN2MwIC43' +
  'LjU1IDEuMjcgMS4yMiAxLjI3SDhjLjUgMCAuOTUtLjMyIDEuMTMtLjc4bDEuMzktMy40N2Mu' +
  'MjMtLjU5Ljc4LTEgMS40My0xIC42NSAwIDEuMi40MSAxLjQ0IDFsMS4zOSAzLjQ3Yy4xOC40' +
  'Ni42Mi43OCAxLjEuNzhoNC43N2MuNyAwIDEuMjUtLjU3IDEuMjUtMS4yN1Y3LjI3YzAtLjct' +
  'LjU1LTEuMjctMS4yNS0xLjI3em0tMTMuMiA4Ljc3YTIuMjQgMi4yNCAwIDAgMS0yLjIxLTIu' +
  'MjhjMC0xLjI2Ljk4LTIuMjggMi4yLTIuMjggMS4yMiAwIDIuMiAxLjAyIDIuMiAyLjI4IDAg' +
  'MS4yNi0uOTggMi4yOC0yLjIgMi4yOHptOS4wMiAwYTIuMjQgMi4yNCAwIDAgMS0yLjItMi4y' +
  'OGMwLTEuMjYuOTgtMi4yOCAyLjItMi4yOCAxLjIxIDAgMi4yIDEuMDIgMi4yIDIuMjggMCAx' +
  'LjI2LS45OSAyLjI4LTIuMiAyLjI4eiIvPjwvZz48L3N2Zz4=';
/**
 * @const {string}
 * @private
 */
const OPEN_ICON_BASE64 =
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVp' +
  'Z2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGQ9Ik0yMSAxOVY1YzAt' +
  'MS4xLS45LTItMi0ySDVjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMTRjMS4x' +
  'IDAgMi0uOSAyLTJ6TTguNSAxMy41bDIuNSAzLjAxTDE0LjUgMTJsNC41IDZINWwzLjUtNC41' +
  'eiIvPgogICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K';

/** @constructor */
function PanoViewGLInfo() {
  /** @type {WebGLUniformLocation} */
  this.dispBase = null;
  /** @type {WebGLUniformLocation} */
  this.dispSize = null;
  /** @type {WebGLUniformLocation} */
  this.transMat = null;
  /** @type {WebGLUniformLocation} */
  this.cropBase = null;
  /** @type {WebGLUniformLocation} */
  this.cropSize = null;
  /** @type {WebGLUniformLocation} */
  this.texture = null;
}

/**
 * @param {!HTMLImageElement} img
 * @return {!HTMLImageElement|!HTMLCanvasElement}
 */
function getPowOfTwoImage(img) {
  /**
   * @param {number} value
   * @return {boolean}
   */
  function isPowOfTwo(value) {
    return (value & (value - 1)) === 0 && value !== 0;
  }
  /**
   * @param {number} value
   * @param {number} max
   * @return {number}
   */
  function nearestPowOfTwo(value, max) {
    const pot = Math.pow(2, Math.round(Math.log( value ) / Math.LN2));
    if (pot > max)
      return max;
    return pot;
  }
  if (isPowOfTwo(img.width) && isPowOfTwo(img.height)) {
    return img;
  }
  
  const canvas =
      /** @type {!HTMLCanvasElement} */ (document.createElement('canvas'));
  // TODO: Make the max size (2048) configurable.
  canvas.width = nearestPowOfTwo(img.width, 2048);
  canvas.height = nearestPowOfTwo(img.height, 2048);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * @return {Promise<VRDisplay>}
 * @private
 */
function getVRDisplay() {
  if (!navigator.getVRDisplays) {
    return Promise.resolve(null);
  }
  return navigator.getVRDisplays().then(
    (displays) => {
      if (!displays.length)
        return null;
      return displays[0];
    },
    (err) => {
      console.error(err);
      return null;
    }
  );
}

/**
 * @return {Promise<XRDevice>}
 * @private
 */
function getXRDevice() {
  if (!navigator.xr) {
    return Promise.resolve(null);
  }
  return navigator.xr.requestDevice().then(
    (device) => {
      if (!device)
        return null;  
      return device.supportsSession({immersive: true}).then(
        () => {
          return device;
        },
        (err) => {
          console.error(err);
          return null;
        });
    },
    (err) => {
      console.error(err);
      return null;
    }
  );
}


/**
 * @constructor
 * @param {!VRPanoViewOptions} options
 */
const PanoView = function(options) {

  /** @type {Blob} */
  this._blob = null;
  /** @type {PanoInfo} */
  this._panoImgInfo = null;
  /** @type {HTMLImageElement|HTMLCanvasElement} */
  this._leftImg = null;
  /** @type {HTMLImageElement|HTMLCanvasElement} */
  this._rightImg = null;

  /** @type {XRDevice} */
  this._xrDevice = null;
  /** @type {VRDisplay} */
  this._vrDisplay = null;

  /** @type {number} */
  this._screenOrientation = window.orientation || 0;
  /** @type {Float32Array} */
  this._deviceOrientationMat = null;

  /** @type {number} */
  this._rotateLong = 0;
  /** @type {number} */
  this._rotateLat = 0;

  /** @type {WebGLRenderingContext} */
  this._gl = null;
  /** @type {PanoViewGLInfo} */
  this._glLocs = null;
  /** @type {WebGLTexture} */
  this._canvasTexture = null
  /** @type {WebGLTexture} */
  this._canvasExtTexture = null
  
  /** @type {WebGLRenderingContext} */
  this._xrGl = null;
  /** @type {PanoViewGLInfo} */
  this._xrGlLocs = null;
  /** @type {WebGLTexture} */
  this._xrTexture = null;
  /** @type {WebGLTexture} */
  this._xrExtTexture = null;
  /** @type {XRSession} */
  this._xrSession = null;
  /** @type {XRFrameOfReference} */
  this._xrFrameOfRef = null;

  /** @type {boolean} */
  this._stopCanvasRendering = false;

  /** @type {!Promise<void>} */
  this._initialized = new Promise((resolve) => {
    /** @type {function(): void} */
    this._resolveInitialization = resolve;
  });

  /** @type {Element} */
  const container = document.getElementById(options.container);
  if (!container) {
    throw new Error('Container not found: ' + options.container);
  }
  /** @type {!Element} */
  this._container = container
  while (this._container.firstChild) {
    this._container.removeChild(this._container.firstChild);
  }

  /** @type {!Element} */
  this._root = document.createElement('div');
  this._root.style.backgroundColor = 'black';
  this._root.style.position = 'relative';
  this._root.style.top = '0';
  this._root.style.left = '0';
  this._root.style.width = '100%';
  this._root.style.height = '100%';
  
  /** @type {!HTMLCanvasElement} */
  this._canvas =
      /** @type {!HTMLCanvasElement} */ (document.createElement('canvas'));
  this._resizeCanvas(this._container.clientWidth, this._container.clientHeight);

  this._root.appendChild(this._canvas);
  this._container.appendChild(this._root);

  /** @type {boolean} */
  this._option_open_btn = !!options.open_btn;

  getXRDevice().then((device) => {
    if (device) {
      this._initializeWithXRDevice(device);
      return;
    }
    getVRDisplay().then((vrDisplay) => {
      if (vrDisplay && vrDisplay.capabilities.canPresent) {
        this._initializeWithVRDevice(vrDisplay);
      } else {
        this._initialize();
      }
    });
  })
};

PanoView.prototype = {
  /**
   * @param {!XRDevice} xrDevice
   * @private
   */
  _initializeWithXRDevice: function(xrDevice) {
    this._xrDevice = xrDevice;
    this._addVRButton();
    this._initialize();
  },
  /**
   * @param {VRDisplay} vrDisplay
   * @private
   */
  _initializeWithVRDevice: function(vrDisplay) {
    this._vrDisplay = vrDisplay;
    this._addVRButton();
    this._initialize();
  },
  /**
   * @private
   */
  _initialize: function() {
    if (this._option_open_btn)
      this._addOpenButton();

    window.addEventListener('resize', this._onWindowResize.bind(this), false);
    window.addEventListener('vrdisplaypresentchange', this._onVRPresentChange.bind(this), false);
    window.addEventListener('vrdisplayactivate', this._onVRActivate.bind(this), false);
    window.addEventListener('vrdisplaydeactivate', this._onVRDeactivate.bind(this), false);
    
    window.addEventListener('orientationchange', this._onOrientationChange.bind(this), false );
    window.addEventListener('deviceorientation', this._onDeviceOrientation.bind(this), false );

    this._canvas.addEventListener('mousedown', this._onMouseDown.bind(this), false);
    this._canvas.addEventListener('mousemove', this._onMouseMove.bind(this), false);
    window.addEventListener('mouseup', this._onMouseUp.bind(this),this);

    this._canvas.addEventListener('touchstart', this._onTouchStart.bind(this), false);
    this._canvas.addEventListener('touchmove', this._onTouchMove.bind(this), false);
    window.addEventListener('touchend', this._onTouchEnd.bind(this),this);
    
    this._gl = this._getCanvasContext();
    this._glLocs = this._initializeGL(this._gl);
    this._canvas.addEventListener('webglcontextlost', this._onContextLost.bind(this), false);
    this._canvas.addEventListener('webglcontextrestored', this._onContextRestored.bind(this), false);
    window.requestAnimationFrame(this._render.bind(this), this._canvas);
    this._resolveInitialization();
  },
  /**
   * @return {!WebGLRenderingContext}
   * @private
   */
  _getCanvasContext: function() {
    return /** @type {!WebGLRenderingContext} */ (
        this._canvas.getContext('webgl'));
  },
  /**
   * @private
   */
  _addVRButton: function() {
    /** @type {!Element}} */
    const vrButton = this._createButton(VR_ICON_BASE64);
    vrButton.style.right = '5px';
    this._root.appendChild(vrButton);
    vrButton.addEventListener('click', () => this.StartVR());
  },
  /**
   * @private
   */
  _addOpenButton: function() {
    /** @type {!Element}} */
    const openButton = this._createButton(OPEN_ICON_BASE64);
    openButton.style.left = '5px';
    this._root.appendChild(openButton);
    openButton.addEventListener('click', () => this.OpenFile());
  },
  /**
   * @param {string} iconBase64
   * @return {!Element}
   * @private
   */
  _createButton: function(iconBase64) {
    const button = document.createElement('div');
    button.style.backgroundColor = 'white';
    button.style.position = 'absolute';
    button.style.width = '36px';
    button.style.height = '36px';
    button.style.bottom = '5px';
    button.style.borderRadius = '36px';
    button.style.cursor = 'pointer';
    button.style.opacity = '0.5';

    const icon = document.createElement('div');
    icon.style.position = 'absolute';
    icon.style.backgroundColor = 'blue';
    icon.style.top = '2px';
    icon.style.left = '2px';
    icon.style.width = '32px';
    icon.style.height = '32px';
    icon.style.background =
        'url("data:image/svg+xml;base64,' + iconBase64 +
        '") left top/100% no-repeat';
    button.appendChild(icon);
    return button;
  },
  /**
   * @private
   */
  _onWindowResize: function() {
    if (this._stopCanvasRendering)
      return;
    if (this._vrDisplay && this._vrDisplay.isPresenting)
      return;
    if (this._canvas.width == this._container.clientWidth &&
        this._canvas.height == this._container.clientHeight) {
      return;
    }
    this._resizeCanvas(this._container.clientWidth, this._container.clientHeight);
  },
  /**
   * @private
   */
  _onOrientationChange: function() {
    this._screenOrientation = window.orientation || 0;
  },
  /**
   * @param {!Event} event
   * @private
   */
  _onDeviceOrientation: function(event) {
    this._deviceOrientationMat = Mat4Util.CalculateRotationMat(
      event.alpha * Mat4Util.DEG_TO_RAD,
      event.beta * Mat4Util.DEG_TO_RAD,
      event.gamma * Mat4Util.DEG_TO_RAD);
  },
  /**
   * @param {!Event} event
   * @private
   */
  _onMouseDown: function(event) {
    this._startRotate(event);
  },
  /**
   * @param {!Event} event
   * @private
   */
  _onMouseMove: function(event) {
    if (event.buttons !== 0) {
      event.preventDefault();
      this._rotate(event);
    }
  },
  /**
   * @param {!Event} event
   * @private
   */
  _onMouseUp: function(event) {
    this._endRotate();
  },
  /**
   * @param {!Event} event
   * @private
   */
  _onTouchStart: function(event) {
    if (event.touches.length == 1) {
      this._startRotate(event.touches[0]);
    }
  },
  /**
   * @param {!Event} event
   * @private
   */
  _onTouchMove: function(event) {
    if (event.touches.length == 1) {
      event.preventDefault();
      this._rotate(event.touches[0]);
    }
  },
  /**
   * @param {!Event} event
   * @private
   */
  _onTouchEnd: function(event) {
    this._endRotate();
  },
  /**
   * @param {!Event} event
   * @private
   */
  _startRotate: function(event) {
    this._rotating = true;
    this._mouseX = event.clientX;
    this._mouseY = event.clientY;
  },
  /**
   * @param {!Event} event
   * @private
   */
  _rotate: function(event) {
    if (!this._rotating)
      return;
    const diffX = event.clientX - this._mouseX;
    const diffY = event.clientY - this._mouseY;
    this._rotateLong += diffX * Math.PI / this._canvas.width;
    this._rotateLat += diffY * Math.PI / this._canvas.height;
    if (this._rotateLat < - Math.PI / 2)
      this._rotateLat = - Math.PI / 2;
    if (this._rotateLat > Math.PI / 2)
      this._rotateLat = Math.PI / 2;
    this._mouseX = event.clientX;
    this._mouseY = event.clientY;
  },
  /**
   * @private
   */
  _endRotate: function() {
    this._rotating = false;
  },
  /**
   * @param {number} width
   * @param {number} height
   * @private
   */
  _resizeCanvas: function(width, height) {
    this._canvas.width = width;
    this._canvas.height = height;
  },
  /**
   * @param {!WebGLRenderingContext} gl
   * @return {!PanoViewGLInfo}
   */
  _initializeGL: function(gl) {
    /** @type {!WebGLBuffer} */
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0,  1.0]),
        gl.STATIC_DRAW);
    /** @type {string} */
    const vShaderTxt = [
        'attribute vec2 pos;',
        'void main() {',
        '  gl_Position = vec4(pos, 0, 1);',
        '}',
      ].join('\n');
    /** @type {!WebGLShader} */
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vShaderTxt);
    gl.compileShader(vertexShader);

    /** @type {string} */
    const fShaderTxt = [
        '#define PI 3.1415925358979',
        '#define PI2 6.2831850718',
        'precision highp float;',
        'uniform sampler2D texture;',
        'uniform vec2 dispBase;',
        'uniform vec2 dispSize;',
        'uniform mat4 transMat;',
        'uniform vec2 cropBase;',
        'uniform vec2 cropSize;',
        '',
        'void main() {',
        '  vec4 pos = vec4((gl_FragCoord.x - dispBase.x)/(dispSize.x * 0.5) - 1.0 ,',
        '                  (gl_FragCoord.y - dispBase.y)/(dispSize.y * 0.5) - 1.0 ,',
        '                  0.0, 1.0);',
        '  vec4 origPos = transMat * pos;',
        '  float lon = atan(origPos.x, -origPos.z);',
        '  float lat = atan(origPos.y, sqrt(origPos.x * origPos.x + origPos.z * origPos.z));',
        '  if (lon < 0.0) {',
        '    lon += PI2;',
        '  }',
        '  float texX = (lon / PI2 - cropBase.x) / cropSize.x;',
        '  float texY = (0.5 - lat / PI -  cropBase.y) / cropSize.y; ',
        '  if ((texX <= -0.0) || (1.0 <= texX) || (texY <= -0.0) || (1.0 <= texY)) {' ,
        '    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);' ,
        '    return;' ,
        '  }' ,
        '  gl_FragColor = texture2D(texture, vec2(texX, texY));',
        '}'
      ].join('\n');
    /** @type {!WebGLShader} */
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fShaderTxt);
    gl.compileShader(fragmentShader);

    /** @type {!WebGLProgram} */
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    /** @type {number} */
    const positionLocation = gl.getAttribLocation(program, 'pos');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    /** @type {!PanoViewGLInfo} */
    const glInfo = new PanoViewGLInfo();
    glInfo.dispBase = gl.getUniformLocation(program, 'dispBase');
    glInfo.dispSize = gl.getUniformLocation(program, 'dispSize');
    glInfo.transMat = gl.getUniformLocation(program, 'transMat');
    glInfo.cropBase = gl.getUniformLocation(program, 'cropBase');
    glInfo.cropSize = gl.getUniformLocation(program, 'cropSize');
    glInfo.texture = gl.getUniformLocation(program, 'texture');
    return glInfo;
  },
  /**
   * @param {!Event} event
   * @private
   */
  _onContextLost: function(event) {
    event.preventDefault();
    this._gl = null;
    this._canvasTexture = null;
    this._canvasExtTexture = null;
    this._leftImg = null;
    this._rightImg = null;
  },
  /**
   * @param {!Event} event
   * @private
   */
  _onContextRestored: function(event) {
    const gl = this._getCanvasContext();
    this._glLocs = this._initializeGL(gl);

    if (!this._blob) {
      this._gl = gl;
      return;
    }
    PanoImage.LoadBlob(this._blob)
      .then((panoImg) => {
        this._gl = gl;
        this._panoImgInfo = panoImg.GetInfo();
        this._leftImg = getPowOfTwoImage(panoImg.GetImage());
        const extImg = panoImg.GetExtImage();
        if (extImg) {
          this._rightImg = getPowOfTwoImage(extImg);
        }
      });
  },
  /**
   * @param {!number} t
   * @private
   */
  _render: function(t) {
    if (this._stopCanvasRendering)
      return;
    if (this._vrDisplay && this._vrDisplay.isPresenting) {
      this._vrDisplay.requestAnimationFrame(this._render.bind(this));
    } else {
      window.requestAnimationFrame(this._render.bind(this), this._canvas);
    }
    if (!this._panoImgInfo || !this._gl || !this._leftImg)
      return;

    if (!this._canvasTexture) {
      this._canvasTexture = this._createTexture(this._gl, this._leftImg);
    }
    if (this._rightImg && !this._canvasExtTexture) {
      this._canvasExtTexture = this._createTexture(this._gl, this._rightImg);
    }

    this._gl.uniform2fv(this._glLocs.cropBase, this._panoImgInfo.GetCropBase());
    this._gl.uniform2fv(this._glLocs.cropSize, this._panoImgInfo.GetCropSize());

    if (this._vrDisplay && this._vrDisplay.isPresenting) {
      /** @type {!VRFrameData} */
      const frameData = new VRFrameData();
      this._vrDisplay.getFrameData(frameData);

      const leftInvPrjMat = Mat4Util.Inv(frameData.leftProjectionMatrix);
      const leftInvViewMat = Mat4Util.ClearTranslate(Mat4Util.Inv(frameData.leftViewMatrix));
      const leftTransMat =  Mat4Util.Mul(this._panoImgInfo.GetRotationMat(), Mat4Util.Mul(leftInvViewMat, leftInvPrjMat));
      this._draw(this._gl, this._glLocs, 0, 0, this._canvas.width* 0.5, this._canvas.height, leftTransMat, this._canvasTexture);

      const rightInvPrjMat = Mat4Util.Inv(frameData.rightProjectionMatrix);
      const rightInvViewMat = Mat4Util.ClearTranslate(Mat4Util.Inv(frameData.rightViewMatrix));
      const rightTransMat =  Mat4Util.Mul(this._panoImgInfo.GetRotationMat(), Mat4Util.Mul(rightInvViewMat, rightInvPrjMat));
      this._draw(this._gl, this._glLocs, this._canvas.width* 0.5, 0, this._canvas.width* 0.5, this._canvas.height, rightTransMat, this._canvasExtTexture ? this._canvasExtTexture : this._canvasTexture);
      this._vrDisplay.submitFrame();
    } else {
      const projectionMatrix = new Float32Array([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, -1, 0,  0, 0, -1, 1]);
      let invViewMat = new Float32Array([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1]);
      const rate = this._canvas.width / this._canvas.height;
      if (rate > 1) {
        projectionMatrix[0] = 1 / rate;
      } else {
        projectionMatrix[5] = rate;
      }
      const invPrjMat = Mat4Util.Inv(projectionMatrix);
      if (this._deviceOrientationMat) {
        const screenRotMat = Mat4Util.Roll(-this._screenOrientation * Mat4Util.DEG_TO_RAD);
        invViewMat  = Mat4Util.Mul(Mat4Util.Yaw(- Math.PI / 2),Mat4Util.Mul(Mat4Util.Pitch(-Math.PI / 2), Mat4Util.Mul(this._deviceOrientationMat, screenRotMat)));
      }

      if (!this._deviceOrientationMat) {
        invViewMat = Mat4Util.Mul(Mat4Util.Pitch(this._rotateLat), invViewMat);
      }
      invViewMat = Mat4Util.Mul(Mat4Util.Yaw(this._rotateLong), invViewMat);
      const transMat =  Mat4Util.Mul(this._panoImgInfo.GetRotationMat(), Mat4Util.Mul(invViewMat, invPrjMat));
      this._draw(this._gl, this._glLocs, 0, 0, this._canvas.width, this._canvas.height, transMat, this._canvasTexture);
    }
  },
  /**
   * @param {!WebGLRenderingContext} gl
   * @param {!PanoViewGLInfo} locs
   * @param {number} viewportX
   * @param {number} viewportY
   * @param {number} viewportW
   * @param {number} viewportH
   * @param {!Float32Array} trasMat
   * @param {!WebGLTexture} texture
   * @private
   */
  _draw: function(gl, locs, viewportX, viewportY, viewportW, viewportH, trasMat, texture) {
    gl.viewport(viewportX, viewportY, viewportW, viewportH);
    gl.uniform2f(locs.dispBase,  viewportX, viewportY);
    gl.uniform2f(locs.dispSize, viewportW, viewportH);
    gl.uniformMatrix4fv(locs.transMat, false, trasMat);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(locs.texture, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindTexture(gl.TEXTURE_2D, null);
  },
  /**
   * @param {!WebGLRenderingContext} gl
   * @param {!HTMLImageElement|!HTMLCanvasElement} image
   * @return {!WebGLTexture}
   * @private
   */
  _createTexture: function(gl, image) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
  },
  /**
   * @private
   */
  OpenFile: function() {
    if (this._fileInput) {
      document.body.removeChild(this._fileInput);
    }
    this._fileInput = document.createElement('input');
    this._fileInput.type = 'file';
    this._fileInput.accept = 'image/jpeg';
    this._fileInput.name = 'files[]';
    this._fileInput.style.display = 'none';
    document.body.appendChild(this._fileInput);
    this._fileInput.addEventListener('change', (function () {
      let tmpBlob = this._fileInput.files[0];
      document.body.removeChild(this._fileInput);
      this._fileInput = null;
      PanoImage.LoadBlob(tmpBlob).then((panoImg) => {
          this._blob = tmpBlob;
          this._loadPanoImage(panoImg);
        });
      }).bind(this), false);
    document.body.appendChild(this._fileInput);
    this._fileInput.click();
  },
  /**
   * @param {string} url
   * @return {Promise<void>}
   * @private
   */
  Load: function(url) {
    /** @type {Blob} */
    let tmpBlob = null;
    return this._initialized 
      .then(() => fetch(url))
      .then((res) => res.blob())
      .then((blob) => {
        tmpBlob = blob;
        return PanoImage.LoadBlob(blob);
      })
      .then((panoImg) => {
        this._blob = tmpBlob;
        this._loadPanoImage(panoImg);
      });
  },
  /**
   * @param {!PanoImage} panoImg
   * @private
   */
  _loadPanoImage: function(panoImg) {
    if (this._canvasTexture) {
      this._gl.deleteTexture(this._canvasTexture);
    }
    if (this._canvasExtTexture) {
      this._gl.deleteTexture(this._canvasExtTexture);
    }
    if (this._xrTexture) {
      this._xrGl.deleteTexture(this._xrTexture);
    }
    if (this._xrExtTexture) {
      this._xrGl.deleteTexture(this._xrExtTexture);
    }
    this._canvasTexture = null;
    this._canvasExtTexture = null;
    this._xrTexture = null;
    this._xrExtTexture = null;
    this._leftImg = null;
    this._rightImg = null;

    this._panoImgInfo = panoImg.GetInfo();

    this._leftImg = getPowOfTwoImage(panoImg.GetImage());
    const extImg = panoImg.GetExtImage();
    if (extImg) {
      this._rightImg = getPowOfTwoImage(extImg);
    }
  },
  /**
   * @private
   */
  StartVR: function() {
    this._initialized.then(() => {
      this._stopCanvasRendering = true;
      if (this._vrDisplay) {
        /** @type {VREyeParameters} */
        const leftEye = this._vrDisplay.getEyeParameters('left');
        this._resizeCanvas(leftEye.renderWidth * 2, leftEye.renderHeight);
        this._vrDisplay.requestPresent([{source: this._canvas}]).then(() => {
          this._stopCanvasRendering = false;
          this._vrDisplay.requestAnimationFrame(this._render.bind(this));
        }, (err) => {
          this._stopCanvasRendering = false;
          console.error(err);
        });
        return;
      }
      this._xrDevice.requestSession({immersive: true}).then((session) => {
        this._xrSession = session;
        this._xrSession.addEventListener('end', this._onXRSessionEnded.bind(this));
        const canvas = document.createElement('canvas');
        this._xrGl = 
            /** @type {!WebGLRenderingContext} */ (
              canvas.getContext('webgl', {
                'compatibleXRDevice': session.device
              }));
        this._xrSession.baseLayer = new XRWebGLLayer(this._xrSession, this._xrGl);
        this._xrGlLocs = this._initializeGL(this._xrGl);
        if (this._leftImg) {
          this._xrTexture = this._createTexture(this._xrGl, this._leftImg);
        }
        if (this._rightImg) {
          this._xrExtTexture = this._createTexture(this._xrGl, this._rightImg);
        }
        this._xrSession.requestFrameOfReference('eye-level').then((frameOfRef) => {
          this._xrFrameOfRef = frameOfRef;
          this._xrSession.requestAnimationFrame(this._onXRFrame.bind(this));
        });
      });
    });
  },
  /**
   * @private
   */
  _onVRPresentChange: function() {
    if (!this._vrDisplay.isPresenting) {
      this._resizeCanvas(this._container.clientWidth, this._container.clientHeight);
      window.requestAnimationFrame(this._render.bind(this), this._canvas);
    }
  },
  /**
   * @private
   */
  _onVRActivate: function() {
    this.StartVR();
  },
  /**
   * @private
   */
  _onVRDeactivate: function() {
    this._vrDisplay.exitPresent().then(() => {
    }, (err) => {
      console.error(err);
    });
  },
  /**
   * @private
   */
  _onXRSessionEnded: function() {
    console.log('_onXRSessionEnded');
    this._stopCanvasRendering = false;
    window.requestAnimationFrame(this._render.bind(this), this._canvas);
  },
  /**
   * @param {number} t
   * @param {XRFrame} frame
   * @private
   */
  _onXRFrame: function(t, frame) {
    if (!this._xrGl || !this._leftImg || !frame)
      return;
    this._xrSession.requestAnimationFrame(this._onXRFrame.bind(this));
    const pose = frame.getDevicePose(this._xrFrameOfRef);
    if (!pose)
      return;

    if (!this._xrTexture) {
      this._xrTexture = this._createTexture(this._xrGl, this._leftImg);
    }
    if (this._rightImg && !this._xrExtTexture) {
      this._xrExtTexture = this._createTexture(this._xrGl, this._rightImg);
    }

    this._xrGl.bindFramebuffer(this._xrGl.FRAMEBUFFER, this._xrSession.baseLayer.framebuffer);
    this._xrGl.clear(this._xrGl.COLOR_BUFFER_BIT | this._xrGl.DEPTH_BUFFER_BIT);
    
    this._xrGl.uniform2fv(this._xrGlLocs.cropBase, this._panoImgInfo.GetCropBase());
    this._xrGl.uniform2fv(this._xrGlLocs.cropSize, this._panoImgInfo.GetCropSize());

    for (let view of frame.views) {
      let viewport = this._xrSession.baseLayer.getViewport(view);
      this._xrGl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
      let invPrjMat = Mat4Util.Inv(view.projectionMatrix);
      let invViewMat = Mat4Util.ClearTranslate(Mat4Util.Inv(pose.getViewMatrix(view)));
      const transMat =  Mat4Util.Mul(this._panoImgInfo.GetRotationMat(), Mat4Util.Mul(invViewMat, invPrjMat));
      let texture = this._xrTexture;
      if (view.eye == 'right' && this._xrExtTexture) {
        texture = this._xrExtTexture;
      }
      this._draw(this._xrGl, this._xrGlLocs, viewport.x, viewport.y, viewport.width, viewport.height, transMat, texture);
    }
  }
};


window['VRPanoView'] = PanoView;
window['VRPanoView'].prototype['Load'] = PanoView.prototype.Load;
