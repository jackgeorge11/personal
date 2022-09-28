import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "../style.css";
import fragmentShader from "../shaders/lava/fragment.glsl?raw";

function main() {
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.autoClearColor = false;

  // const camera = new THREE.OrthographicCamera(
  //   -1, // left
  //   1, // right
  //   1, // top
  //   -1, // bottom
  //   -1, // near,
  //   1 // far
  // );

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const controls = new OrbitControls(camera, renderer.domElement);

  const scene = new THREE.Scene();

  const colorSwap = new THREE.Vector4(0.4, 0.7, 0.8, 1);
  const colorSwap2 = new THREE.Vector4(0.6, 0.2, 0.5, 0.05);

  const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3() },
    iMouse: { value: new THREE.Vector4() },
    colorSwap: { value: colorSwap },
    rings: { value: 3.14 },
  };

  const uniforms2 = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3() },
    iMouse: { value: new THREE.Vector4() },
    colorSwap: { value: colorSwap2 },
    rings: { value: 5 },
  };

  const plane = new THREE.PlaneGeometry(2, 2);

  const box = new THREE.BoxGeometry(3, 3, 0.5);
  const edges = new THREE.EdgesGeometry(box);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x000000 })
  );
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms,
  });

  const box2 = new THREE.BoxGeometry(2, 4, 0.25);
  const edges2 = new THREE.EdgesGeometry(box2);
  const line2 = new THREE.LineSegments(
    edges2,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  const material2 = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms: uniforms2,
  });
  scene.add(
    new THREE.Mesh(box, material),
    line,
    new THREE.Mesh(box2, material2),
    line2
  );

  camera.position.z = 5;
  controls.update();

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  let clock = new THREE.Clock();
  clock.start();

  function render(time) {
    time *= 0.001;

    box.rotateX(0.001);
    edges.rotateX(0.001);
    box.rotateY(0.001);
    edges.rotateY(0.001);
    box.rotateZ(0.002);
    edges.rotateZ(0.002);

    box2.rotateX(-0.001);
    edges2.rotateX(-0.001);
    box2.rotateY(-0.001);
    edges2.rotateY(-0.001);
    box2.rotateZ(-0.002);
    edges2.rotateZ(-0.002);

    resizeRendererToDisplaySize(renderer);

    const canvas = renderer.domElement;
    uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    uniforms2.iResolution.value.set(canvas.width, canvas.height, 1);
    uniforms.iTime.value = time / 2;
    uniforms2.iTime.value = time * 1.5;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  document.querySelector("h1").addEventListener("click", onclick, true);

  THREE.Vector4.prototype.damp = function (v, lambda, delta) {
    this.x = THREE.MathUtils.damp(this.x, v.x, lambda, delta);
    this.y = THREE.MathUtils.damp(this.y, v.y, lambda, delta);
    this.z = THREE.MathUtils.damp(this.z, v.z, lambda, delta);
    this.w = THREE.MathUtils.damp(this.w, v.w, lambda, delta);
  };
}

main();
