/**
 * @constructor
 * @param {!HTMLImageElement} img
 * @param {Array<!Array<!Array<string>>>} metadata
 */
const PanoInfo = function(img, metadata) {
  /** @type {?number} */
  let croppedAreaImageWidthPixels = null;
  /** @type {?number} */
  let croppedAreaImageHeightPixels = null;
  /** @type {?number} */
  let fullPanoWidthPixels = null;
  /** @type {?number} */
  let fullPanoHeightPixels = null;
  /** @type {number} */
  let croppedAreaLeftPixels = 0;
  /** @type {number} */
  let croppedAreaTopPixels = 0;
  /** @type {number} */
  let poseHeadingDegrees = 0;
  /** @type {number} */
  let posePitchDegrees = 0;
  /** @type {number} */
  let poseRollDegrees = 0;
  /** @type {?number} */
  let initialViewHeadingDegrees = null;
  if (metadata && metadata[0]) {
    for (let data of metadata[0]) {
      if (data[0] == 'GPano:CroppedAreaImageWidthPixels') {
        croppedAreaImageWidthPixels = Number(data[1]);
      } else if (data[0] == 'GPano:CroppedAreaImageHeightPixels') {
        croppedAreaImageHeightPixels = Number(data[1]);
      } else if (data[0] == 'GPano:FullPanoWidthPixels') {
        fullPanoWidthPixels = Number(data[1]);
      } else if (data[0] == 'GPano:FullPanoHeightPixels') {
        fullPanoHeightPixels = Number(data[1]);
      } else if (data[0] == 'GPano:CroppedAreaLeftPixels') {
        croppedAreaLeftPixels = Number(data[1]);
      } else if (data[0] == 'GPano:CroppedAreaTopPixels') {
        croppedAreaTopPixels = Number(data[1]);
      } else if (data[0] == 'GPano:PoseHeadingDegrees') {
        poseHeadingDegrees = Number(data[1]);
      } else if (data[0] == 'GPano:PosePitchDegrees') {
        posePitchDegrees = Number(data[1]);
      } else if (data[0] == 'GPano:PoseRollDegrees') {
        poseRollDegrees = Number(data[1]);
      } else if (data[0] == 'GPano:InitialViewHeadingDegrees') {
        initialViewHeadingDegrees = Number(data[1]);
      }
    }
  }
  if (croppedAreaImageWidthPixels === null) {
    croppedAreaImageWidthPixels = img.width;
  }
  if (croppedAreaImageHeightPixels === null) {
    croppedAreaImageHeightPixels = img.height;
  }
  if (fullPanoWidthPixels === null) {
    fullPanoWidthPixels = img.width;
  }
  if (fullPanoHeightPixels === null) {
    fullPanoHeightPixels = img.height;
  }
  if (initialViewHeadingDegrees === null) {
    initialViewHeadingDegrees = (croppedAreaLeftPixels + croppedAreaImageWidthPixels * 0.5) / fullPanoWidthPixels * 360;
  }
  /** @private {!Float32Array} */
  this._cropBase = new Float32Array([croppedAreaLeftPixels / fullPanoWidthPixels, croppedAreaTopPixels / fullPanoHeightPixels]);
  /** @private {!Float32Array} */
  this._cropSize = new Float32Array([croppedAreaImageWidthPixels / fullPanoWidthPixels, croppedAreaImageHeightPixels / fullPanoHeightPixels]);

  const centerRot = (croppedAreaLeftPixels + croppedAreaImageWidthPixels * 0.5) / fullPanoWidthPixels * 2.0 * Math.PI;

  const pitchMat =  Mat4Util.Pitch(posePitchDegrees * Mat4Util.DEG_TO_RAD);
  const headingMat =  Mat4Util.Yaw(initialViewHeadingDegrees * Mat4Util.DEG_TO_RAD - centerRot);
  const rollMat =  Mat4Util.Roll(-poseRollDegrees * Mat4Util.DEG_TO_RAD);
  const invRotMat = Mat4Util.Inv(Mat4Util.Mul(headingMat, Mat4Util.Mul(pitchMat, rollMat)));

  const centerHeadingMat =  Mat4Util.Yaw(-centerRot);
  /** @private {!Float32Array} */
  this._rotationMat = Mat4Util.Mul(centerHeadingMat, invRotMat);
}

PanoInfo.prototype = {
  /** @return {!Float32Array} */
  GetCropBase: function() {
    return this._cropBase;
  },
  /** @return {!Float32Array} */
  GetCropSize: function() {
    return this._cropSize;
  },
  /** @return {!Float32Array} */
  GetRotationMat: function() {
    return this._rotationMat;
  },
};