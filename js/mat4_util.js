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
};