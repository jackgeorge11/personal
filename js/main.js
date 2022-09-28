import "../style.css";
import * as THREE from "three";
import vertexShader from "./shaders/globe/vertex.glsl?raw";
import fragmentShader from "./shaders/globe/fragment.glsl?raw";

console.log(vertexShader, fragmentShader);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0xffffff, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// const tigris = new THREE.TextureLoader().load("./images/tigris.jpg");
// tigris.wrapS = THREE.RepeatWrapping;
// tigris.wrapT = THREE.RepeatWrapping;
// tigris.repeat.set(18, 9);

// const sphere = new THREE.Mesh(
// new THREE.SphereGeometry(5, 50, 50),
//   new THREE.ShaderMaterial({
//     vertexShader,
//     fragmentShader,
//     uniforms: {
//       globeTexture: {
//         value: new THREE.TextureLoader().load("./images/earth.jpeg"),
//       },
//     },
//   })
// );

// scene.add(sphere);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 1),
  new THREE.MeshBasicMaterial({ color: 0xf6530d })
);

scene.add(plane);

camera.position.z = 500;

function animate() {
  // sphere.rotation.y += 0.006;
  // sphere.rotation.x += 0.001;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onWindowScroll(e) {
  if (e.deltaY > 0 && camera.position.z < 1000) {
    camera.position.z += 5;
  } else if (e.deltaY < 0 && camera.position.z > 50) {
    camera.position.z -= 5;
  }
}

animate();

window.addEventListener("resize", onWindowResize, false);
window.addEventListener("wheel", onWindowScroll);
