/**
 * @constructor
 */
const Mat4Util = function() {};

/** @const {number} */
Mat4Util.DEG_TO_RAD = Math.PI / 180;

/**
 * @param {number} yaw
 * @return {!Float32Array}
 */
Mat4Util.Yaw = function(yaw) {
  const s = Math.sin(yaw);
  const c = Math.cos(yaw);
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
}

/**
 * @param {number} pitch
 * @return {!Float32Array}
 */
Mat4Util.Pitch = function(pitch) {
  const s = Math.sin(pitch);
  const c = Math.cos(pitch);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
}

/**
 * @param {number} roll
 * @return {!Float32Array}
 */
Mat4Util.Roll = function(roll) {
  const s = Math.sin(roll);
  const c = Math.cos(roll);
  return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

/**
 * @param {!Float32Array} a
 * @param {!Float32Array} b
 * @return {!Float32Array}
 */
Mat4Util.Mul = function(a, b) {
  const out = new Float32Array(16);
  const a00 = a[0], a10 = a[4], a20 = a[8], a30 = a[12];
  const a01 = a[1], a11 = a[5], a21 = a[9], a31 = a[13];
  const a02 = a[2], a12 = a[6], a22 = a[10], a32 = a[14];
  const a03 = a[3], a13 = a[7], a23 = a[11], a33 = a[15];

  const b00 = b[0], b10 = b[4], b20 = b[8], b30 = b[12];
  const b01 = b[1], b11 = b[5], b21 = b[9], b31 = b[13];
  const b02 = b[2], b12 = b[6], b22 = b[10], b32 = b[14];
  const b03 = b[3], b13 = b[7], b23 = b[11], b33 = b[15];

  out[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;

  out[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;

  out[8]  = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
  out[9]  = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;

  out[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
  out[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
  out[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
  out[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;
  return out;
}

/**
 * @param {!Float32Array} a
 * @return {!Float32Array}
 */
Mat4Util.Inv = function(a) {
  const out = new Float32Array(16);
  const a00 = a[0], a10 = a[4], a20 = a[8], a30 = a[12];
  const a01 = a[1], a11 = a[5], a21 = a[9], a31 = a[13];
  const a02 = a[2], a12 = a[6], a22 = a[10], a32 = a[14];
  const a03 = a[3], a13 = a[7], a23 = a[11], a33 = a[15];
  
  const s0 = a00 * a11 - a10 * a01;
  const s1 = a00 * a12 - a10 * a02;
  const s2 = a00 * a13 - a10 * a03;
  const s3 = a01 * a12 - a11 * a02;
  const s4 = a01 * a13 - a11 * a03;
  const s5 = a02 * a13 - a12 * a03;

  const c5 = a22 * a33 - a32 * a23;
  const c4 = a21 * a33 - a31 * a23;
  const c3 = a21 * a32 - a31 * a22;
  const c2 = a20 * a33 - a30 * a23;
  const c1 = a20 * a32 - a30 * a22;
  const c0 = a20 * a31 - a30 * a21;

  const det = s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0;
  if (!det)
    return out;
  const invdet = 1.0 / det;

  out[0] = ( a11 * c5 - a12 * c4 + a13 * c3) * invdet;
  out[1] = (-a01 * c5 + a02 * c4 - a03 * c3) * invdet;
  out[2] = ( a31 * s5 - a32 * s4 + a33 * s3) * invdet;
  out[3] = (-a21 * s5 + a22 * s4 - a23 * s3) * invdet;

  out[4] = (-a10 * c5 + a12 * c2 - a13 * c1) * invdet;
  out[5] = ( a00 * c5 - a02 * c2 + a03 * c1) * invdet;
  out[6] = (-a30 * s5 + a32 * s2 - a33 * s1) * invdet;
  out[7] = ( a20 * s5 - a22 * s2 + a23 * s1) * invdet;

  out[8] = ( a10 * c4 - a11 * c2 + a13 * c0) * invdet;
  out[9] = (-a00 * c4 + a01 * c2 - a03 * c0) * invdet;
  out[10] = ( a30 * s4 - a31 * s2 + a33 * s0) * invdet;
  out[11] = (-a20 * s4 + a21 * s2 - a23 * s0) * invdet;

  out[12] = (-a10 * c3 + a11 * c1 - a12 * c0) * invdet;
  out[13] = ( a00 * c3 - a01 * c1 + a02 * c0) * invdet;
  out[14] = (-a30 * s3 + a31 * s1 - a32 * s0) * invdet;
  out[15] = ( a20 * s3 - a21 * s1 + a22 * s0) * invdet;

  return out;
};

/**
 * @param {number} alpha
 * @param {number} beta
 * @param {number} gamma
 * @return {!Float32Array}
 */
Mat4Util.CalculateRotationMat = function(alpha, beta, gamma) {
  const x = beta;
  const y = gamma;
  const z = alpha;

  const sx = Math.sin(x);
  const cx = Math.cos(x);
  const sy = Math.sin(y);
  const cy = Math.cos(y);
  const sz = Math.sin(z);
  const cz = Math.cos(z);

  return new Float32Array([
      cz * cy - sz * sx * sy, cy * sz + cz * sx * sy, -cx * sy, 0,
      -cx * sz, cz * cx, sx, 0,  
      cy * sz * sx + cz * sy, sz * sy - cz * cy * sx, cx * cy, 0, 
      0, 0, 0, 1
    ]);
};

/**
 * @param {!Float32Array} mat
 * @return {!Float32Array}
 */
Mat4Util.ClearTranslate = function(mat) {
  mat[12] = 0.0;
  mat[13] = 0.0;
  mat[14] = 0.0;
  return mat;
};/**
 * @constructor
 * @param {!HTMLImageElement} img
 * @param {!PanoInfo} info
 * @param {HTMLImageElement} exImg
 */
const PanoImage = function(img, info, exImg) {
  /** @private {!HTMLImageElement} */
  this._img = img;
  /** @private {!PanoInfo} */
  this._info = info;
  /** @private {HTMLImageElement} */
  this._exImg = exImg;
};

PanoImage.prototype = {
  /** @return {!HTMLImageElement} */
  GetImage: function() {
    return this._img;
  },
  /** @return {!PanoInfo} */
  GetInfo: function() {
    return this._info;
  },
  /** @return {HTMLImageElement} */
  GetExtImage: function() {
    return this._exImg;
  },
};

/**
 * @param {string} url
 * @return {Promise<!PanoImage>}
 */
PanoImage.Load = function(url) {
  return fetch(url)
    .then((res) => res.blob())
    .then((blob) => PanoImage.LoadBlob(blob));
};

/**
 * @param {string} url
 * @return {Promise<!HTMLImageElement>}
 * @private
 */
PanoImage._loadImage = function(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = (e) => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

/**
 * @param {!Blob} blob
 * @return {Promise<!ArrayBuffer>}
 * @private
 */
PanoImage._readAsArrayBuffer = function(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

/**
 * @param {Array<!Array<!Array<string>>>} metadata
 * @return {?string}
 * @private
 */
PanoImage._getImageDataURLInMetedata = function(metadata) {
  if (!metadata || !metadata[1])
    return null;
  const found = metadata[1].find((i) => i[0] == 'GImage:Data');
  if (!found) 
    return null;
  return 'data:image/jpeg;base64,' + found[1];
}

/**
 * @param {!Blob} blob
 * @return {Promise<!PanoImage>}
 */
PanoImage.LoadBlob = function(blob) {
  return Promise.all([PanoImage._loadImage(window.URL.createObjectURL(blob)),
                      PanoImage._readAsArrayBuffer(blob)])
    .then((results) => {
      /** @type {!HTMLImageElement} */
      const img = results[0];
      /** @type {!ArrayBuffer} */
      const arrayBuffer = results[1];
      /** @type {Array<!Array<!Array<string>>>} */
      const metadata = PanoImage._getXmpMetadata(arrayBuffer);
      /** @type {!PanoInfo} */
      const info = new PanoInfo(img, metadata);
      /** @type {?string} */
      const imageDataURL = PanoImage._getImageDataURLInMetedata(metadata);
      if (!imageDataURL) {
        return new PanoImage(img, info, null);
      }
      return PanoImage._loadImage(imageDataURL).then(exImg => {
          return new PanoImage(img, info, exImg);
        });
    });
};

/**
 * @param {!ArrayBuffer} arrayBuffer
 * @return {Array<!Array<!Array<string>>>}
 * @private
 */
PanoImage._getXmpMetadata = function(arrayBuffer) {
  /** @type {Array<!Array<string>>} */
  let standardSection = null;
  /** @type {number} */
  let pos = 0;
  /** @type {?string} */
  let extensionID = null;
  /** @type {Uint8Array} */
  let extensionData = null;
  try {
    if (read2Bytes() != 0xFFD8)
      return null;
    while (pos + 4 < arrayBuffer.byteLength) {
      /** @const {number} */
      const marker = read2Bytes();
      /** @const {number} */
      const size = read2Bytes();
      if (marker == 0xFFDA)
        break;
      if (marker == 0xFFE1) {
        if (isXmp()) {
          const dom = getXmpDom(new Uint8Array(arrayBuffer, pos + 29, size - 31));
          if (!dom)
            return null;
          standardSection = getLeafs(dom);
          extensionID = hasExtendedXMPValue(standardSection);
          if (!extensionID)
            return [standardSection];
          if (extensionID.length != 32)
            return null;
        } else if (isXmpExtension()) {
          const tmpBytes = new Uint8Array(arrayBuffer, pos + 35 + 32, 8);
          const fullSizeBytes = ((tmpBytes[0] * 0x100 + tmpBytes[1]) * 0x100 + tmpBytes[2]) * 0x100 + tmpBytes[3];
          const offset = ((tmpBytes[4] * 0x100 + tmpBytes[5]) * 0x100 + tmpBytes[6]) * 0x100 + tmpBytes[7];
          const chunkSize = size - 77;
          if (extensionData === null) {
            extensionData = new Uint8Array(fullSizeBytes);
          }
          extensionData.set(new Uint8Array(arrayBuffer, pos + 35 + 32 + 8, chunkSize), offset);
        }
      }
      pos += size - 2;
    }
    if (extensionData) {
      const dom = getXmpDom(extensionData);
      if (!dom)
        return [standardSection];
      const extendedSection = getLeafs(dom);
      return [standardSection, extendedSection];
    }
  } catch (e) {
    console.error(e.toString());
  }
  return null;
  /**
   * @return {number}
   */
  function read2Bytes() {
    const bytes =  new Uint8Array(arrayBuffer, pos, 2);
    pos += 2;
    return bytes[0] * 0x100 + bytes[1];
  }
  /**
   * @return {boolean}
   */
  function isXmp() {
    const bytes = new Uint8Array(arrayBuffer, pos, 29);
    const t = String.fromCharCode.apply(null, bytes);
    return t == 'http://ns.adobe.com/xap/1.0/\0';
  }
  /**
   * @return {boolean}
   */
  function isXmpExtension() {
    const bytes = new Uint8Array(arrayBuffer, pos, 35 + 32);
    const t = String.fromCharCode.apply(null, bytes);
    return t == 'http://ns.adobe.com/xmp/extension/\0' + extensionID;
  }
  /**
   * @param {!Uint8Array} bytes
   * @return {Document}
   */
  function getXmpDom(bytes) {
    let xmpStr = new TextDecoder('utf-8').decode(bytes);
    const startPos = xmpStr.search('<x:xmpmeta ');
    const endPos = xmpStr.search('</x:xmpmeta>');
    if (startPos == -1 || endPos == -1)
      return null;
    xmpStr = xmpStr.substr(startPos, endPos - startPos + 12);
    const dom = (new DOMParser()).parseFromString(xmpStr, 'text/xml');
    return dom;
  }
  /**
   * @param {!Node} node
   * @return {!Array<!Array<string>>}
   */
  function getLeafs(node) {
    /** @type {!Array<Array<string>>} */
    let list = [];
    if (node.nodeType == 1) {
      const attributes = node.attributes;
      for (let i = 0; i < node.attributes.length; ++i) {
        list.push([attributes[i].name, attributes[i].value]);
      }
    }
    if (node.childNodes.length == 1 &&
        node.childNodes[0].nodeType == 3) {
      return [[node.nodeName, node.childNodes[0].nodeValue]];
    }
    for (let i = 0; i < node.childNodes.length; ++i)
      list = list.concat(getLeafs(node.childNodes[i]));
    return list;
  }
  /**
   * @param {!Array<!Array<string>>} list
   * @return {?string}
   */
  function hasExtendedXMPValue(list) {
    const found = list.find((i) => i[0] == 'xmpNote:HasExtendedXMP');
    if (!found)
      return null;
    return found[1];
  }
}/**
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
