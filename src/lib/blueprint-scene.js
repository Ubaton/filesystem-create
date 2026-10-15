import * as THREE from "three";
import {
  SHEET, basic, clamp01, dashMat, ease, lineMat, pop, segments,
  sheetLabel, span, textPlane, tile, treeLayout,
} from "./blueprint-scene/parts";

const DAMPING = 7; // higher = snappier follow of scroll progress
const ACCENTS = ["#75b992", "#7dabc9", "#c9aa70"];
const CODE_LINES = [[0, 0.9], [1, 1.2], [2, 1.05], [2, 0.95], [1, 0.8], [2, 1.1], [0, 0.7], [1, 1.0], [1, 0.85]];
const FILE_SLOTS = [[-1.55, 0.25], [-1.1, 0.25], [-0.65, 0.25], [0.65, 0.25], [1.1, 0.25], [1.55, 0.25]];

/**
 * Isometric blueprint of FileGen's pipeline: outline -> files/folders -> tree -> zip.
 * @param {HTMLElement} host
 */
export function createBlueprintScene(host) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
  const assembly = new THREE.Group();
  scene.add(assembly);
  const accents = ACCENTS.map((c) => new THREE.Color(c));
  const neutral = new THREE.Color();
  const tint = new THREE.Color();
  const textures = [];
  const top = SHEET.h / 2 + 0.004;

  // Shared unit geometries (scaled per instance).
  const unitFace = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  const unitEdge = new THREE.EdgesGeometry(unitFace);
  const barGeo = new THREE.BoxGeometry(1, 0.012, 0.075).translate(0.5, 0, 0);

  // ---- Three sheets ---------------------------------------------------------
  const sheetGeo = new THREE.BoxGeometry(SHEET.w, SHEET.h, SHEET.d);
  const sheetEdge = new THREE.EdgesGeometry(sheetGeo);
  const tickGeo = segments([2.5, 0, -1.6, 2.95, 0, -1.6, 2.5, 0, 1.6, 2.95, 0, 1.6]);
  const layers = [0, 1, 2].map((index) => {
    const group = new THREE.Group();
    assembly.add(group);
    const surface = new THREE.Mesh(sheetGeo, basic(0.08));
    const outline = new THREE.LineSegments(sheetEdge, lineMat(0.6));
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(SHEET.w - 0.1, SHEET.d - 0.1).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: sheetLabel(index, textures), transparent: true, depthWrite: false }),
    );
    label.position.y = top;
    const ticks = new THREE.LineSegments(tickGeo, lineMat(0.4));
    group.add(surface, outline, label, ticks);
    return { group, mats: [surface.material, outline.material, label.material, ticks.material], active: 0 };
  });
  const tintables = (index, ...mats) => layers[index].mats.push(...mats);

  // Sheet 1: outline text "typing in" line by line.
  const codeBars = CODE_LINES.map(([indent, width], i) => {
    const bar = new THREE.Mesh(barGeo, basic(0.85));
    bar.position.set(-2.0 + indent * 0.32, top + 0.006, -1.0 + i * 0.25);
    bar.userData.width = width;
    layers[0].group.add(bar);
    tintables(0, bar.material);
    return bar;
  });
  const caret = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.16), basic(1));
  layers[0].group.add(caret);
  tintables(0, caret.material);

  // Sheet 2: two folders with slots; six files fly up from sheet 1 into them.
  [-1.1, 1.1].forEach((x) => {
    const folder = tile(1.75, 1.3, unitFace, unitEdge);
    folder.group.position.set(x, top, 0.2);
    const tab = tile(0.55, 0.22, unitFace, unitEdge);
    tab.group.position.set(x - 0.6, top, -0.56);
    layers[1].group.add(folder.group, tab.group);
    tintables(1, folder.face.material, folder.edge.material, tab.face.material, tab.edge.material);
  });
  const files = FILE_SLOTS.map(([x, z], i) => {
    const f = tile(0.34, 0.46, unitFace, unitEdge);
    f.slot = new THREE.Vector3(x, top + 0.01, z);
    f.from = new THREE.Vector3(-1.6 + (i % 3) * 0.5, 0, -0.8 + Math.floor(i / 3) * 0.75);
    layers[1].group.add(f.group);
    tintables(1, f.face.material, f.edge.material);
    return f;
  });

  // Sheet 3: connectors draw on, nodes pop in.
  const tree = treeLayout();
  const connectorGeo = segments(tree.points);
  const connectorCount = tree.points.length / 3;
  const connectors = new THREE.LineSegments(connectorGeo, lineMat(0.9));
  connectors.position.y = top;
  layers[2].group.add(connectors);
  tintables(2, connectors.material);
  const nodes = tree.nodes.map(([x, z], i) => {
    const n = tile(i === 0 ? 0.9 : i < 4 ? 0.7 : 0.42, 0.26, unitFace, unitEdge);
    n.group.position.set(x, top + 0.008, z);
    n.base = n.group.scale.clone();
    layers[2].group.add(n.group);
    tintables(2, n.face.material, n.edge.material);
    return n;
  });

  // Dimension line along the stack and dashed alignment guides.
  const dimension = new THREE.LineSegments(segments([2.75, -1, -1.6, 2.75, 1, -1.6, -2.4, -1, 1.6, -2.4, 1, 1.6]), dashMat(0.35));
  dimension.computeLineDistances();
  assembly.add(dimension);

  // Final beat: a ZIP envelope closes around the compressed stack.
  const zipGeo = new THREE.BoxGeometry(SHEET.w + 0.35, 1, SHEET.d + 0.35);
  const zipBox = new THREE.LineSegments(new THREE.EdgesGeometry(zipGeo), lineMat(0));
  zipGeo.dispose();
  const zipLabel = textPlane("project.zip", textures);
  zipLabel.rotation.x = -Math.PI / 2;
  assembly.add(zipBox, zipLabel);

  // ---- State & loop --------------------------------------------------------
  let target = 0, shown = 0, time = 0, last = 0, raf = 0;
  let reduced = false, disposed = false, visible = true;
  let viewW = 1, viewH = 1;

  function draw() {
    if (disposed) return;
    const p = shown;
    const dark = document.documentElement.classList.contains("dark");
    neutral.set(dark ? "#8b9a91" : "#6f7d75");
    const idle = reduced ? 0 : 1;

    // Camera: slow orbit + dolly across the story, tiny idle sway.
    const az = 0.62 + ease(p / 2) * 0.32 + Math.sin(time * 0.35) * 0.02 * idle;
    const zip = ease(span(p, 1.7, 2));
    const el = 0.62 - ease(span(p, 0, 1)) * 0.06 + zip * 0.1;
    camera.position.set(Math.sin(az) * 14 * Math.cos(el), Math.sin(el) * 14, Math.cos(az) * 14 * Math.cos(el));
    camera.lookAt(0, 0, 0);
    camera.zoom = 1 + ease(span(p, 0.2, 1)) * 0.06 - zip * 0.04;
    camera.updateProjectionMatrix();

    // Floors explode apart, then compress for the zip.
    const gap = (0.7 + ease(span(p, 0, 0.45)) * 0.6) * (1 - 0.8 * zip);
    layers.forEach((layer, i) => {
      layer.active = ease(clamp01(1 - Math.abs(p - i)));
      const lift = layer.active * 0.1 + Math.sin(time * 0.9 + i * 1.7) * 0.025 * idle * (1 - zip);
      layer.group.position.y = (i - 1) * gap + lift;
    });
    dimension.scale.y = gap;

    // Sheet 1 typing.
    const typing = span(p, 0.02, 0.75);
    let caretLine = 0;
    codeBars.forEach((bar, i) => {
      const t = span(typing * CODE_LINES.length, i, i + 1);
      bar.scale.x = Math.max(0.0001, t * bar.userData.width);
      bar.visible = t > 0;
      if (t > 0) caretLine = i;
    });
    const cBar = codeBars[caretLine];
    caret.position.set(cBar.position.x + cBar.scale.x + 0.05, top + 0.01, cBar.position.z);
    caret.visible = typing < 1 || Math.sin(time * 5) > 0 || reduced;

    // Sheet 2 files arc up from sheet 1 into folder slots.
    files.forEach((f, i) => {
      const t = ease(span(p, 0.5 + i * 0.07, 0.95 + i * 0.07));
      const fromY = -gap;
      f.group.position.set(
        f.from.x + (f.slot.x - f.from.x) * t,
        fromY + (f.slot.y - fromY) * t + Math.sin(Math.PI * t) * 0.55,
        f.from.z + (f.slot.z - f.from.z) * t,
      );
      f.group.visible = t > 0.001;
      f.group.rotation.y = (1 - t) * 0.6;
    });

    // Sheet 3 tree draws on, then nodes pop.
    const draw3 = span(p, 1.1, 1.65);
    connectorGeo.setDrawRange(0, Math.floor(draw3 * connectorCount / 2) * 2);
    nodes.forEach((n, i) => {
      const s = pop(span(draw3, i / nodes.length, i / nodes.length + 0.25));
      n.group.scale.set(n.base.x * s + 0.0001, 1, n.base.z * s + 0.0001);
    });

    // Zip envelope.
    zipBox.material.opacity = zip * 0.9;
    zipBox.scale.y = gap * 2 + 0.5;
    zipLabel.material.opacity = zip;
    zipLabel.position.set(-1.6, gap + 0.35, -SHEET.d / 2 - 0.05);
    zipBox.material.color.copy(accents[2]);
    zipLabel.material.color.copy(accents[2]);

    // Theme-aware tinting: active floor glows in its accent, zip warms all.
    layers.forEach((layer, i) => {
      tint.copy(neutral).lerp(accents[i], 0.2 + layer.active * 0.8).lerp(accents[2], zip * 0.35);
      const strength = 0.35 + layer.active * 0.65 + zip * 0.3;
      layer.mats.forEach((m, k) => {
        m.color.copy(tint);
        if (k === 0) m.opacity = 0.03 + layer.active * 0.09;
        else if (k === 1) m.opacity = 0.25 + layer.active * 0.55;
        else if (k === 2) m.opacity = 0.2 + layer.active * 0.5;
        else if (k === 3) m.opacity = 0.35 * strength;
      });
    });
    dimension.material.color.copy(neutral);
    renderer.render(scene, camera);
  }

  function tick(now) {
    raf = 0;
    if (disposed || reduced || !visible) return;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    time += dt;
    shown += (target - shown) * (1 - Math.exp(-dt * DAMPING));
    if (Math.abs(target - shown) < 1e-4) shown = target;
    draw();
    raf = requestAnimationFrame(tick);
  }
  function start() {
    if (!raf && !disposed && !reduced && visible) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  const onVisibility = () => {
    visible = document.visibilityState !== "hidden";
    visible ? start() : stop();
  };
  document.addEventListener("visibilitychange", onVisibility);
  const observer = typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && document.visibilityState !== "hidden";
        visible ? start() : stop();
      })
    : null;
  observer?.observe(host);

  function resize() {
    viewW = Math.max(1, host.clientWidth);
    viewH = Math.max(1, host.clientHeight);
    const aspect = viewW / viewH;
    const half = aspect < 1 ? 4 / aspect : 4;
    camera.left = -half * aspect;
    camera.right = half * aspect;
    camera.top = half;
    camera.bottom = -half;
    renderer.setSize(viewW, viewH);
    draw();
  }
  resize();
  start();

  return {
    update(value, prefersReduced) {
      target = Math.max(0, Math.min(2, Number(value) || 0));
      reduced = Boolean(prefersReduced);
      if (reduced) {
        stop();
        shown = target;
        draw();
      } else {
        start();
      }
    },
    resize,
    dispose() {
      disposed = true;
      stop();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      const geometries = new Set([unitFace, unitEdge, barGeo, sheetGeo, sheetEdge, tickGeo]);
      const materials = new Set();
      scene.traverse((o) => {
        if (o.geometry) geometries.add(o.geometry);
        if (o.material) materials.add(o.material);
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
