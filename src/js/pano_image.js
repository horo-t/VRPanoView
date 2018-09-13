/**
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
}