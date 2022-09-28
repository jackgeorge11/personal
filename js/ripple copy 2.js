import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "../style.scss";
import fragmentShader from "../shaders/lava/fragment.glsl?raw";
import vertexShader from "../shaders/lava/vertex.glsl?raw";
import fragmentShaderSquare from "../shaders/lava/square/fragment.glsl?raw";
import vertexShaderSquare from "../shaders/lava/square/vertex.glsl?raw";
import fragmentShaderRectangle from "../shaders/lava/rectangle/fragment.glsl?raw";
import vertexShaderRectangle from "../shaders/lava/rectangle/vertex.glsl?raw";
import tigrisFragmentShader from "../shaders/tigris/fragment.glsl?raw";
import tigrisVertexShader from "../shaders/tigris/vertex.glsl?raw";
import tigris from "../images/tigris.jpg";
import brush from "../images/brush.png";

function main() {
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setClearColor = (0x000000, 1);

  let height = window.innerHeight;
  let width = window.innerWidth;
  let aspect = width / height;
  const camera = new THREE.OrthographicCamera(
    (height * aspect) / -2,
    (height * aspect) / 2,
    height / 2,
    height / -2,
    -1000,
    1000
  );

  const swatch = document.querySelector(".swatch");

  const scene = new THREE.Scene();
  const scene1 = new THREE.Scene();
  const spazio = new THREE.Scene();

  const baseTexture = new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  });

  // PLANE
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        uDisplacement: { value: null },
        uTexture: { value: new THREE.TextureLoader().load(tigris) },
        resolution: { value: new THREE.Vector4() },
      },
      vertexShader: tigrisVertexShader,
      fragmentShader: tigrisFragmentShader,
    })
  );
  scene1.add(plane);

  // RIPPLES
  const maxRipples = 100;
  const ripples = [];
  const rippleGeometry = new THREE.PlaneGeometry(64, 64, 1, 1);

  for (let i = 0; i < maxRipples; i++) {
    let m = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(brush),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    });
    let ripple = new THREE.Mesh(rippleGeometry, m);
    ripple.visible = false;
    ripple.rotation.z = 2 * Math.PI * Math.random();
    scene.add(ripple);
    ripples.push(ripple);
  }

  let mouse = new THREE.Vector2(0, 0);
  let prevMouse = new THREE.Vector2(0, 0);
  let currentRipple = 0;
  function mouseEvents() {
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX - width / 2;
      mouse.y = height / 2 - e.clientY;
    });
  }
  mouseEvents();
  function setNewRipple(x, y, i) {
    let ripple = ripples[i];
    ripple.visible = true;
    ripple.position.x = x;
    ripple.position.y = y;
    ripple.material.opacity = 0.5;
    ripple.scale.x = ripple.scale.y = 0.2;
  }
  function trackMousePos() {
    if (
      Math.abs(mouse.x - prevMouse.x) > 4 ||
      Math.abs(mouse.y - prevMouse.y) > 4
    ) {
      setNewRipple(mouse.x, mouse.y, currentRipple);
      currentRipple = (currentRipple + 1) % maxRipples;
    }

    prevMouse.x = mouse.x;
    prevMouse.y = mouse.y;
  }

  // PRISMS

  const uniforms = {
    bg: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3() },
      uDisplacement: { value: null },
      colorSwap: { value: new THREE.Vector4(0.4, 0.7, 0.8, 1) },
      rings: { value: 3.14 },
    },
    square: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3() },
      uDisplacement: { value: null },
      colorSwap: { value: new THREE.Vector4(0.4, 0.7, 0.8, 1) },
      rings: { value: 3.14 },
    },
    rectangle: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3() },
      uDisplacement: { value: null },
      colorSwap: { value: new THREE.Vector4(0.6, 0.2, 0.5, 0.05) },
      rings: { value: 5 },
    },
  };

  const squareGeometry = new THREE.BoxGeometry(300, 300, 50);
  const rectangleGeometry = new THREE.BoxGeometry(200, 400, 25);

  const squareEdges = new THREE.EdgesGeometry(squareGeometry);
  const rectangleEdges = new THREE.EdgesGeometry(rectangleGeometry);

  const squareLines = new THREE.LineSegments(
    squareEdges,
    new THREE.LineBasicMaterial({ color: 0x000000 })
  );
  const rectangleLines = new THREE.LineSegments(
    rectangleEdges,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );

  const squareGradient = new THREE.ShaderMaterial({
    vertexShader: vertexShaderSquare,
    fragmentShader: fragmentShaderSquare,
    uniforms: uniforms.square,
    side: THREE.DoubleSide,
  });
  const rectangleGradient = new THREE.ShaderMaterial({
    vertexShader: vertexShaderRectangle,
    fragmentShader: fragmentShaderRectangle,
    uniforms: uniforms.rectangle,
    side: THREE.DoubleSide,
  });

  const squareMaterials = [
    null,
    null,
    null,
    null,
    squareGradient,
    squareGradient,
  ];
  const rectangleMaterials = [
    null,
    null,
    null,
    null,
    rectangleGradient,
    rectangleGradient,
  ];

  const squarePrism = new THREE.Mesh(squareGeometry, squareMaterials);
  const rectanglePrism = new THREE.Mesh(rectangleGeometry, rectangleMaterials);

  // PLANE

  const testPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: uniforms.bg,
      vertexShader,
      fragmentShader,
    })
  );

  spazio.add(testPlane);

  // spazio.add(
  //   squarePrism,
  //   squareLines,
  //   rectanglePrism,
  //   rectangleLines,
  //   testPlane
  // );

  camera.position.z = 5;
  // controls.update();

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(canvasWidth, canvasHeight, false);
      width = canvasWidth;
      height - canvasHeight;
    }
    return needResize;
  }

  function prismRotation(prism, edges, v, d) {
    prism.rotateX(v * d);
    edges.rotateX(v * d);
    prism.rotateY(v * d);
    edges.rotateY(v * d);
    prism.rotateZ(v * d * 2);
    edges.rotateZ(v * d * 2);
  }

  function render(time) {
    time *= 0.001;
    trackMousePos();
    ripples.forEach((r, i) => {
      if (r.visible) {
        r.scale.y = r.scale.x = 0.982 * r.scale.x + 0.108;
        r.rotation.z += 0.005 + 0.001 * (i % 15);
        r.material.opacity *= 0.96;

        if (r.material.opacity < 0.002) {
          r.visible = false;
        }
      }
    });

    prismRotation(squarePrism, squareEdges, 0.001, 1);
    prismRotation(rectanglePrism, rectangleEdges, 0.001, -1);

    uniforms.square.iResolution.value.set(canvas.width, canvas.height, 1);
    uniforms.square.iTime.value = time / 2;
    uniforms.rectangle.iResolution.value.set(canvas.width, canvas.height, 1);
    uniforms.rectangle.iTime.value = time / 2;
    uniforms.bg.iResolution.value.set(canvas.width, canvas.height, 1);
    uniforms.bg.iTime.value = time / 2;

    resizeRendererToDisplaySize(renderer);

    renderer.setRenderTarget(baseTexture);
    renderer.render(scene, camera);
    squareGradient.uniforms.uDisplacement.value = baseTexture.texture;
    rectangleGradient.uniforms.uDisplacement.value = baseTexture.texture;
    testPlane.material.uniforms.uDisplacement.value = baseTexture.texture;
    renderer.setRenderTarget(null);
    renderer.clear();
    // renderer.render(scene1, camera);
    renderer.render(spazio, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
