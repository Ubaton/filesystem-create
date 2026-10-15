import * as THREE from "three";

/** Clamp to 0..1. */
export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Normalised position of v inside [a, b], clamped. */
export const span = (v, a, b) => clamp01((v - a) / (b - a));
/** Smooth cubic in/out easing. */
export const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Ease-out back, used for small "pop" beats. */
export const pop = (t) => {
  const c = 1.6;
  return t <= 0 ? 0 : 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

export const SHEET = { w: 4.8, d: 3.2, h: 0.12 };
const TITLES = ["01 / OUTLINE", "02 / FILES & FOLDERS", "03 / PROJECT TREE"];

/** Canvas texture with the sheet title, rule line, and corner registration marks. */
export function sheetLabel(index, textures) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 680;
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.lineWidth = 2;
  ctx.font = "26px monospace";
  ctx.fillText(TITLES[index], 54, 66);
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(54, 88);
  ctx.lineTo(970, 88);
  // Corner registration marks
  [[24, 24], [1000, 24], [24, 656], [1000, 656]].forEach(([x, y]) => {
    ctx.moveTo(x - 14, y);
    ctx.lineTo(x + 14, y);
    ctx.moveTo(x, y - 14);
    ctx.lineTo(x, y + 14);
  });
  ctx.stroke();
  ctx.font = "18px monospace";
  ctx.fillText(`SHEET ${index + 1}/3  ·  FILEGEN`, 760, 640);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textures.push(texture);
  return texture;
}

/** Small text sprite-like plane (for "project.zip"). */
export function textPlane(text, textures, width = 1.6) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.font = "44px monospace";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 16, 48);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textures.push(texture);
  return new THREE.Mesh(
    new THREE.PlaneGeometry(width, width * (96 / 512)),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0 }),
  );
}

export const basic = (opacity) =>
  new THREE.MeshBasicMaterial({ transparent: true, opacity, depthWrite: false });
export const lineMat = (opacity) => new THREE.LineBasicMaterial({ transparent: true, opacity });
export const dashMat = (opacity) =>
  new THREE.LineDashedMaterial({ transparent: true, opacity, dashSize: 0.06, gapSize: 0.07 });

/** Line-segment geometry from flat [x1,y1,z1,x2,y2,z2,...] list. */
export function segments(points) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  return g;
}

/** Outlined folder/file tile: translucent face + crisp edges. */
export function tile(w, d, faceGeo, edgeGeo) {
  const group = new THREE.Group();
  const face = new THREE.Mesh(faceGeo, basic(0.18));
  const edge = new THREE.LineSegments(edgeGeo, lineMat(0.9));
  group.add(face, edge);
  group.scale.set(w, 1, d);
  return { group, face, edge };
}

/**
 * Tree layout for sheet 3: root -> 3 dirs -> 2 leaves each.
 * Returns node positions (x,z) and the connector polyline segments in draw order.
 */
export function treeLayout() {
  const root = [0, -1.0];
  const dirs = [[-1.5, 0.05], [0, 0.05], [1.5, 0.05]];
  const leaves = [];
  dirs.forEach(([x]) => leaves.push([x - 0.4, 1.0], [x + 0.4, 1.0]));
  const y = 0.02;
  const pts = [];
  const seg = (a, b) => pts.push(a[0], y, a[1], b[0], y, b[1]);
  const busA = -0.48;
  seg(root, [0, busA]);
  seg([-1.5, busA], [1.5, busA]);
  dirs.forEach((d) => seg([d[0], busA], d));
  dirs.forEach(([x, z]) => {
    const busB = z + 0.48;
    seg([x, z], [x, busB]);
    seg([x - 0.4, busB], [x + 0.4, busB]);
    seg([x - 0.4, busB], [x - 0.4, 1.0]);
    seg([x + 0.4, busB], [x + 0.4, 1.0]);
  });
  return { nodes: [root, ...dirs, ...leaves], points: pts };
}
