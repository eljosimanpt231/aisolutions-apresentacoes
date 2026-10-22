/* ============================================================
   VISTA 3D do estúdio de maquetes (three.js, alojado na pasta).
   Cada artigo é construído com as medidas da ficha (em cm) e a arte
   entra como uma película na superfície, à escala e na posição da
   maquete. O material segue a técnica: o laser brilha como metal,
   a tinta é mate, a gravação a quente fica em relevo brilhante.
   Só carrega quando se abre a vista 3D.
   ============================================================ */
import * as THREE from '../vendor/three.module.min.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';

function mat(hex, rough, metal, extra) { return new THREE.MeshStandardMaterial(Object.assign({ color: new THREE.Color(hex), roughness: rough, metalness: metal }, extra || {})); }

function materialDaArte(spec, tex) {
  var base = { map: tex, transparent: true, alphaTest: 0.03, polygonOffset: true, polygonOffsetFactor: -4, depthWrite: false, side: THREE.FrontSide };
  switch (spec.acabArte) {
    case 'prata': return mat('#ffffff', 0.3, 0.85, base);
    case 'ourorosa': return mat('#ffffff', 0.2, 0.9, base);
    case 'escuro': return mat('#ffffff', 0.75, 0.25, base);
    case 'relevo': return mat('#ffffff', 0.12, 0.15, base);
    default: return mat('#ffffff', 0.55, 0.0, base);
  }
}

function corpoMaterial(spec) {
  if (spec.acab === 'espelho') return mat(spec.cor, 0.06, 1.0);
  if (spec.acab === 'suave') return mat(spec.cor, 0.78, 0.05);
  if (spec.tipo === 'caneca') return spec.magica ? mat(spec.cor, 0.35, 0.0) : mat(spec.cor, 0.22, 0.05, { envMapIntensity: 1.1 });
  if (spec.tipo === 'bloco') return mat(spec.cor, 0.7, 0.0);
  return mat(spec.cor, 0.55, 0.15);
}

/* ---------- os modelos ---------- */
function garrafa(spec, g) {
  var h = spec.h, r = spec.d / 2, P = [];
  [[0, 0], [r * 0.9, 0], [r * 0.99, 0.25], [r, 0.7], [r, h * 0.7], [r * 0.95, h * 0.76], [r * 0.78, h * 0.81], [r * 0.64, h * 0.845], [r * 0.62, h * 0.86], [0, h * 0.86]].forEach(function (p) { P.push(new THREE.Vector2(p[0], p[1])); });
  var corpo = new THREE.Mesh(new THREE.LatheGeometry(P, 96), corpoMaterial(spec)); corpo.castShadow = true; g.add(corpo);
  var tampaMat = spec.acab === 'espelho' ? mat('#1a1a1a', 0.5, 0.1) : corpoMaterial(spec);
  var tampa = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.66, r * 0.68, h * 0.14, 64), tampaMat); tampa.position.y = h * 0.93; tampa.castShadow = true; g.add(tampa);
  var topo = new THREE.Mesh(new THREE.SphereGeometry(r * 0.66, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2), tampaMat); topo.scale.y = 0.18; topo.position.y = h; g.add(topo);
  var asa = new THREE.Mesh(new THREE.TorusGeometry(r * 0.5, r * 0.09, 12, 48), tampaMat); asa.position.set(r * 0.95, h * 0.95, 0); asa.rotation.y = Math.PI / 2; asa.scale.set(1, 0.8, 1); g.add(asa);
  return { eixo: 'y', r: r * 1.004, centro: h * 0.44, alturaUtil: h * 0.7 };
}
function caneca(spec, g) {
  var h = spec.h, r = spec.d / 2, e = 0.18, P = [];
  [[0, 0.02], [r - 0.15, 0], [r, 0.15], [r, h], [r - e, h], [r - e, 0.35], [0, 0.35]].forEach(function (p) { P.push(new THREE.Vector2(p[0], p[1])); });
  var m = corpoMaterial(spec);
  var corpo = new THREE.Mesh(new THREE.LatheGeometry(P, 96), m); corpo.material.side = THREE.DoubleSide; corpo.castShadow = true; g.add(corpo);
  if (spec.aro) { var aro = new THREE.Mesh(new THREE.TorusGeometry(r - e / 2, e / 1.6, 10, 96), mat(spec.aro, 0.3, 0.2)); aro.rotation.x = Math.PI / 2; aro.position.y = h; g.add(aro); }
  var dentro = new THREE.Mesh(new THREE.CircleGeometry(r - e, 64), mat(spec.magica ? '#f2f2f2' : '#f3f3ef', 0.3, 0)); dentro.rotation.x = -Math.PI / 2; dentro.position.y = 0.37; g.add(dentro);
  var lado = spec.asa === 'esq' ? -1 : 1;
  var asa = new THREE.Mesh(new THREE.TorusGeometry(h * 0.28, r * 0.09, 14, 40, Math.PI), m); asa.position.set(lado * r * 0.98, h * 0.52, 0); asa.rotation.z = lado > 0 ? -Math.PI / 2 : Math.PI / 2; asa.castShadow = true; g.add(asa);
  return { eixo: 'y', r: r * 1.004, centro: h * 0.5, alturaUtil: h * 0.8, corpo: corpo, asaLado: lado };
}
function caneta(spec, g) {
  var l = spec.l, r = spec.d / 2, P = [];
  [[0, 0], [0.06, 0.02], [r * 0.4, 0.5], [r * 0.72, 1.25], [r * 0.82, 1.3], [r * 0.92, 3.4], [r, 3.6], [r, l - 2.0], [r * 0.9, l - 1.8], [r * 0.86, l - 0.7], [r * 0.6, l - 0.6], [r * 0.58, l], [0, l]].forEach(function (p) { P.push(new THREE.Vector2(p[0], p[1])); });
  var c = new THREE.Group();
  var corpo = new THREE.Mesh(new THREE.LatheGeometry(P, 64), corpoMaterial(spec)); corpo.castShadow = true; c.add(corpo);
  var det = mat(spec.detalhe || '#c8ccd2', 0.25, 0.95);
  var ponta = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.72, r * 0.4, 0.75, 32), det); ponta.position.y = 0.88; c.add(ponta);
  var anel = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.87, r * 0.87, 0.12, 32), det); anel.position.y = l - 0.65; c.add(anel);
  var clip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 4.6, 0.3), corpoMaterial(spec)); clip.position.set(0, l - 3.0, -r - 0.12); clip.castShadow = true; c.add(clip);
  c.rotation.z = Math.PI / 2; c.position.x = l / 2;
  g.add(c);
  return { eixo: 'caneta', r: r * 1.006, comprimento: l, grupo: c };
}
function bloco(spec, g) {
  var w = spec.w, h = spec.h, e = spec.e;
  var pu = corpoMaterial(spec), papel = mat('#f3efe6', 0.9, 0);
  var b = new THREE.Mesh(new THREE.BoxGeometry(w, h, e), [papel, pu, papel, papel, pu, pu]); b.castShadow = true; g.add(b);
  var elastico = new THREE.Mesh(new THREE.BoxGeometry(0.6, h + 0.04, e + 0.12), mat('#0b0b0b', 0.6, 0)); elastico.position.x = w / 2 - 1.3; g.add(elastico);
  var fita = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.4, 0.04), mat('#111', 0.7, 0)); fita.position.set(-w / 2 + 1.4, -h / 2 - 1.1, -0.2); g.add(fita);
  b.position.y = h / 2; elastico.position.y = h / 2; fita.position.y += h / 2;
  return { eixo: 'plano', z: e / 2 + 0.01, centroY: h / 2 };
}

/* ---------- a película da arte ---------- */
function pelicula(spec, info, tex) {
  var m = materialDaArte(spec, tex), W = spec.arteW, H = spec.arteH, geo, mesh;
  if (info.eixo === 'plano') {
    geo = new THREE.PlaneGeometry(W, H); mesh = new THREE.Mesh(geo, m);
    mesh.position.set(spec.dx || 0, info.centroY - (spec.dy || 0), info.z);
    return mesh;
  }
  if (info.eixo === 'y') {
    var th = Math.min(W / info.r, Math.PI * 1.9);
    geo = new THREE.CylinderGeometry(info.r, info.r, H, 96, 1, true, -th / 2 + (spec.dx || 0) / info.r, th);
    mesh = new THREE.Mesh(geo, m); mesh.position.y = info.centro - (spec.dy || 0);
    return mesh;
  }
  /* caneta: a largura da arte corre ao longo do corpo; a altura dá a volta ao corpo */
  var th2 = Math.min(H / info.r, Math.PI * 1.9);
  geo = new THREE.CylinderGeometry(info.r, info.r, W, 64, 1, true, -th2 / 2, th2);
  tex.center.set(0.5, 0.5); tex.rotation = -Math.PI / 2;
  mesh = new THREE.Mesh(geo, m);
  mesh.position.y = info.comprimento * (1 - spec.fx) - (spec.dx || 0);
  mesh.rotation.y = 0; mesh.position.x = 0;
  /* o clip está em -z: a arte vai para a frente (+z) */
  return { anexar: info.grupo, mesh: mesh, y: mesh.position.y + (spec.dy ? 0 : 0) };
}

export function montar(el, spec0) {
  var spec = spec0;
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  el.appendChild(renderer.domElement);
  var scene = new THREE.Scene();
  var pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  var cam = new THREE.PerspectiveCamera(32, 1, 0.1, 500);
  var luz = new THREE.DirectionalLight(0xffffff, 1.6); luz.position.set(12, 24, 16); luz.castShadow = true; luz.shadow.mapSize.set(1024, 1024); luz.shadow.radius = 6;
  scene.add(luz); scene.add(new THREE.HemisphereLight(0xffffff, 0xdedbe4, 0.5));
  var chao = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.16 })); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; scene.add(chao);

  var pivot = new THREE.Group(); scene.add(pivot);
  var obj = null, info = null, arte = null, tex = null, alvoY = 0.35, alvoX = 0.08, rotY = 0.35, rotX = 0.08, auto = false, dist = 30, quente = 1, quenteAlvo = 1, raf = 0, vivo = true;

  function construir() {
    if (obj) { pivot.remove(obj); obj.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(function (m) { m.dispose(); }); }); }
    obj = new THREE.Group(); pivot.add(obj);
    if (spec.tipo === 'garrafa') info = garrafa(spec, obj);
    else if (spec.tipo === 'caneca') info = caneca(spec, obj);
    else if (spec.tipo === 'caneta') info = caneta(spec, obj);
    else info = bloco(spec, obj);
    var box = new THREE.Box3().setFromObject(obj), c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
    obj.position.x -= c.x; obj.position.z -= c.z; obj.position.y -= box.min.y;
    if (spec.tipo === 'caneta') { obj.position.y += 0.6; }
    var maior = Math.max(s.x, s.y, s.z), raio = Math.sqrt(s.x * s.x + s.y * s.y + s.z * s.z) / 2;
    dist = raio / Math.tan(cam.fov * Math.PI / 360) * 1.5; cam.position.set(0, s.y * 0.5 + raio * 0.32, dist); cam.lookAt(0, s.y * 0.5, 0);
    pivot.userData.alvo = new THREE.Vector3(0, s.y * 0.5, 0);
    luz.shadow.camera.left = -maior; luz.shadow.camera.right = maior; luz.shadow.camera.top = maior; luz.shadow.camera.bottom = -maior; luz.shadow.camera.updateProjectionMatrix();
    if (spec.magica) { quente = 0; quenteAlvo = 1; }
    poeArte();
  }
  function poeArte() {
    if (arte) { (arte.parent || obj).remove(arte); arte.geometry.dispose(); arte.material.dispose(); arte = null; }
    if (tex) { tex.dispose(); tex = null; }
    if (!spec.arteCanvas) return;
    tex = new THREE.CanvasTexture(spec.arteCanvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    var p = pelicula(spec, info, tex);
    if (p.anexar) { arte = p.mesh; p.anexar.add(arte); }
    else { arte = p; obj.add(arte); }
    aplicaQuente();
  }
  function aplicaQuente() {
    if (!spec.magica || !info || !info.corpo) return;
    var preto = new THREE.Color('#141414'), branco = new THREE.Color('#f4f4f2');
    info.corpo.material.color.copy(preto).lerp(branco, quente);
    if (arte) arte.material.opacity = quente;
  }
  function tamanho() { var w = el.clientWidth || 400, h = el.clientHeight || 400; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  function loop() {
    if (!vivo) return;
    raf = requestAnimationFrame(loop);
    if (auto) alvoY += 0.006;
    rotY += (alvoY - rotY) * 0.12; rotX += (alvoX - rotX) * 0.12;
    pivot.rotation.y = rotY; pivot.rotation.x = rotX;
    if (Math.abs(quente - quenteAlvo) > 0.002) { quente += (quenteAlvo - quente) * 0.05; aplicaQuente(); }
    renderer.render(scene, cam);
  }
  /* rato e toque: arrastar roda, a roda aproxima */
  var arr = null;
  renderer.domElement.style.touchAction = 'none';
  renderer.domElement.addEventListener('pointerdown', function (e) { arr = { x: e.clientX, y: e.clientY, ry: alvoY, rx: alvoX }; renderer.domElement.setPointerCapture(e.pointerId); auto = false; el.dispatchEvent(new CustomEvent('bc3d-auto', { detail: false })); });
  renderer.domElement.addEventListener('pointermove', function (e) { if (!arr) return; alvoY = arr.ry + (e.clientX - arr.x) * 0.011; alvoX = Math.max(-0.7, Math.min(0.9, arr.rx + (e.clientY - arr.y) * 0.008)); });
  renderer.domElement.addEventListener('pointerup', function () { arr = null; });
  renderer.domElement.addEventListener('wheel', function (e) { e.preventDefault(); var f = e.deltaY > 0 ? 1.08 : 0.93; cam.position.multiplyScalar(f); var a = pivot.userData.alvo; cam.lookAt(a.x, a.y, a.z); }, { passive: false });
  var ro = new ResizeObserver(tamanho); ro.observe(el);
  tamanho(); construir(); loop();

  return {
    atualizar: function (s2) { var mudouObj = !spec || s2.tipo !== spec.tipo || s2.cor !== spec.cor || s2.h !== spec.h || s2.l !== spec.l || s2.d !== spec.d; spec = s2; if (mudouObj) construir(); else poeArte(); },
    acao: function (n) {
      if (n === 'auto') { auto = !auto; return auto; }
      if (n === 'frente') { alvoY = Math.round(alvoY / (Math.PI * 2)) * Math.PI * 2; alvoX = 0.06; }
      if (n === 'lado') { alvoY = Math.round(alvoY / (Math.PI * 2)) * Math.PI * 2 + Math.PI / 2; alvoX = 0.06; }
      if (n === 'tras') { alvoY = Math.round(alvoY / (Math.PI * 2)) * Math.PI * 2 + Math.PI; alvoX = 0.06; }
      if (n === 'quente') { quenteAlvo = quenteAlvo > 0.5 ? 0 : 1; return quenteAlvo > 0.5; }
      if (n === 'quente0') return;
    },
    imagem: function () { renderer.render(scene, cam); return renderer.domElement.toDataURL('image/png'); },
    destruir: function () { vivo = false; cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); pmrem.dispose(); if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); }
  };
}
window.BC3D = { montar: montar };
