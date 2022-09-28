import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "../style.css";
import fragmentShader from "../shaders/lava/fragment.glsl?raw";
import tigris from "../images/tigris.jpg";
import tigrisFragmentShader from "../shaders/tigris/fragment.glsl?raw";
import tigrisVertexShader from "../shaders/tigris/vertex.glsl?raw";

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
  const foreground = new THREE.Scene();

  const baseTexture = new THREE.WebGLRenderTarget({
    width: window.innerWidth,
    height: window.innerHeight,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  });

  // PLANE
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 7),
    new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
        uDisplacement: { value: null },
        uTexture: { value: new THREE.TextureLoader().load(tigris) },
      },
      vertexShader: tigrisVertexShader,
      fragmentShader: tigrisFragmentShader,
    })
  );

  foreground.add(plane);

  // PRISM
  const box = new THREE.BoxGeometry(3, 3, 0.5);
  const edges = new THREE.EdgesGeometry(box);
  const outline = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x000000 })
  );
  const prismMaterial = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3() },
      iMouse: { value: new THREE.Vector4() },
      colorSwap: { value: new THREE.Vector4(0.4, 0.7, 0.8, 1) },
      rings: { value: 3.14 },
    },
  });
  const prismMesh = new THREE.Mesh(box, prismMaterial);
  const prism = new THREE.Group();
  prism.add(prismMesh, outline);
  scene.add(prism);

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

  console.log(baseTexture);

  function render(time) {
    time *= 0.001;

    box.rotateX(0.001);
    edges.rotateX(0.001);
    box.rotateY(0.001);
    edges.rotateY(0.001);
    box.rotateZ(0.002);
    edges.rotateZ(0.002);

    resizeRendererToDisplaySize(renderer);

    const canvas = renderer.domElement;
    prismMaterial.uniforms.iResolution.value.set(
      canvas.width,
      canvas.height,
      1
    );
    prismMaterial.uniforms.iTime.value = time / 2;

    renderer.setRenderTarget(baseTexture);
    renderer.render(scene, camera);
    plane.material.uniforms.uDisplacement.value = baseTexture.texture;
    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(foreground, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
