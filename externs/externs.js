// https://immersive-web.github.io/webvr/spec/1.1/

/**
 * @interface
 */
function VRDisplayCapabilities() {}
/** @type {boolean} */
VRDisplayCapabilities.prototype.hasPosition;
/** @type {boolean} */
VRDisplayCapabilities.prototype.hasOrientation;
/** @type {boolean} */
VRDisplayCapabilities.prototype.hasExternalDisplay;
/** @type {boolean} */
VRDisplayCapabilities.prototype.canPresent;
/** @type {number} */
VRDisplayCapabilities.prototype.maxLayers;

/**
 * @typedef {string}
 * Possible values: 'left', 'right'
 */
var VREye;

/**
 * @interface
 */
function VREyeParameters() {}
/** @type {Float32Array} */
VREyeParameters.prototype.offset;
/** @type {number} */
VREyeParameters.prototype.renderWidth;
/** @type {number} */
VREyeParameters.prototype.renderHeight;


/** @record */
function VRLayerInit() {};
/** @type {(undefined|HTMLCanvasElement)} */
VRLayerInit.prototype.source;

/**
 * @interface
 */
function VRDisplay() {}
/** @type {boolean} */
VRDisplay.prototype.isConnected;
/** @type {boolean} */
VRDisplay.prototype.isPresenting;
/** @type {!VRDisplayCapabilities} */
VRDisplay.prototype.capabilities;
/**
 * @param {VREye} whichEye
 * @return {VREyeParameters}
 */
VRDisplay.prototype.getEyeParameters = function(whichEye) {};
/**
 * @return {Promise<void>}
 */
VRDisplay.prototype.exitPresent = function() {};

/**
 * @param {Array<VRLayerInit>} layers
 * @return {Promise<undefined>}
 */
VRDisplay.prototype.requestPresent = function(layers) {};


/**
 * @param {function(number): undefined} callback
 * @return {number}
 */
VRDisplay.prototype.requestAnimationFrame = function(callback) {};
/**
 * @param {!VRFrameData} frameData
 * @return {boolean}
 */
VRDisplay.prototype.getFrameData = function(frameData) {};
/**
 * @return {undefined}
 */
VRDisplay.prototype.submitFrame = function() {};

/**
 * @return {!Promise<Array<VRDisplay>>}
 */
Navigator.prototype.getVRDisplays = function() {};

/**
 * @constructor
 */
function VRFrameData() {}

/** @type {!Float32Array} */
VRFrameData.prototype.leftProjectionMatrix;
/** @type {!Float32Array} */
VRFrameData.prototype.leftViewMatrix;
/** @type {!Float32Array} */
VRFrameData.prototype.rightProjectionMatrix;
/** @type {!Float32Array} */
VRFrameData.prototype.rightViewMatrix;

// https://immersive-web.github.io/webxr/

/**
 * @record
 */
function XRSessionCreationOptions() {};
/** @type {(undefined|boolean)} */
XRSessionCreationOptions.prototype.immersive;

/**
 * @interface
 */
function XRDevice() {}

/**
 * @param {!XRSessionCreationOptions=} options
 * @return {!Promise<void>}
 */
XRDevice.prototype.supportsSession = function(options) {};

/**
 * @param {!XRSessionCreationOptions=} options
 * @return {!Promise<XRSession>}
 */
XRDevice.prototype.requestSession = function(options) {};

/**
 * @interface
 * @extends {EventTarget}
 */
function XRSession() {}

/** @type {XRDevice} */
XRSession.prototype.device;
/** @type {boolean} */
XRSession.prototype.immersive;;
/** @type {XRLayer} */
XRSession.prototype.baseLayer;


/**
 * @param {!XRFrameOfReferenceType} type
 * @return {!Promise<XRFrameOfReference>}
 */
XRSession.prototype.requestFrameOfReference = function(type) {};

/**
 * @param {function(number, XRFrame): undefined} callback
 * @return {number}
 */
XRSession.prototype.requestAnimationFrame = function(callback) {};

/**
 * @typedef {string}
 * Possible values: 'head-model', 'eye-level', 'stage'
 */
var XRFrameOfReferenceType;


/**
 * @interface
 * @extends {EventTarget}
 */
function XRCoordinateSystem() {}
/**
 * @param {XRCoordinateSystem} other
 * @return {Float32Array}
 */
XRCoordinateSystem.prototype.getTransformTo = function(other) {};

/**
 * @interface
 * @extends {XRCoordinateSystem}
 */
function XRFrameOfReference() {}

/** @interface */
function XRLayer() {}

/** @interface */
function XRViewport() {}
/** @type {number} */
XRViewport.prototype.x;
/** @type {number} */
XRViewport.prototype.y;
/** @type {number} */
XRViewport.prototype.width;
/** @type {number} */
XRViewport.prototype.height;

/**
 * @record
 */
function XRWebGLLayerInit() {};
/** @type {(undefined|boolean)} */
XRWebGLLayerInit.prototype.antialias;
/** @type {(undefined|boolean)} */
XRWebGLLayerInit.prototype.depth;
/** @type {(undefined|boolean)} */
XRWebGLLayerInit.prototype.stencil;
/** @type {(undefined|boolean)} */
XRWebGLLayerInit.prototype.alpha;
/** @type {(undefined|boolean)} */
XRWebGLLayerInit.prototype.multiview;
/** @type {(undefined|number)} */
XRWebGLLayerInit.prototype.framebufferScaleFactor;

/**
 * @constructor
 * @param {XRSession} session
 * @param {WebGLRenderingContext|WebGL2RenderingContext} context
 * @param {!XRWebGLLayerInit=} opt_init
 * @implements {XRLayer}
 */
function XRWebGLLayer(session, context, opt_init) {};
/** @type {WebGLFramebuffer} */
XRWebGLLayer.prototype.framebuffer;
/**
 * @param {XRView} view
 * @return {XRViewport}
 */
XRWebGLLayer.prototype.getViewport = function(view) {};


/**
 * @interface
 */
function XR() {}

/**
 * @return {!Promise<XRDevice>}
 */
XR.prototype.requestDevice = function() {};

/** @type {XR} */
Navigator.prototype.xr;


/** @interface */
function XRFrame() {}
/** @interface */
function XRView() {}
/** @interface */
function XRDevicePose() {}


/** @type {XRSession} */
XRFrame.prototype.session;
/** @type {!Array<!XRView>} */
XRFrame.prototype.views;
/**
 * @param {XRCoordinateSystem} coordinateSystem
 * @return {XRDevicePose}
 */
XRFrame.prototype.getDevicePose = function(coordinateSystem) {};


/** @type {XREye} */
XRView.prototype.eye;
/** @type {!Float32Array} */
XRView.prototype.projectionMatrix;

/**
 * @typedef {string}
 * Possible values: 'left', 'right'
 */
var XREye;

/** @type {Float32Array} */
XRDevicePose.prototype.poseModelMatrix;
/**
 * @param {XRView} view
 * @return {!Float32Array}
 */
XRDevicePose.prototype.getViewMatrix = function(view) {};



/**
 * @record
 */
function VRPanoViewOptions() {};

/** @type {string} */
VRPanoViewOptions.prototype.container;
/** @type {boolean} */
VRPanoViewOptions.prototype.open_btn;


