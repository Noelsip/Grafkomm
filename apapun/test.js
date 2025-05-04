import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('earthCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const textureLoader = new THREE.TextureLoader();
const dayTexture = textureLoader.load('assets/textures/earth.jpg');
const nightTexture = textureLoader.load('assets/textures/earthnight.jpg');

// ShaderMaterial untuk efek siang & malam
const earthMaterial = new THREE.ShaderMaterial({
  uniforms: {
    dayTexture: { value: dayTexture },
    nightTexture: { value: nightTexture },
    lightDirection: { value: new THREE.Vector3(5, 0, 5) }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform vec3 lightDirection;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    void main() {
      vec3 lightDir = normalize(lightDirection - vWorldPosition);
      float intensity = dot(normalize(vNormal), lightDir);
      intensity = clamp(intensity, 0.0, 1.0);
      vec4 day = texture2D(dayTexture, vUv);
      vec4 night = texture2D(nightTexture, vUv);
      gl_FragColor = mix(night, day, intensity);
    }
  `,
});

const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), earthMaterial);
scene.add(earth);

// Tambahkan setelah pembuatan `earth`
const cloudTexture = textureLoader.load('assets/textures/earthclouds.png');

const clouds = new THREE.Mesh(
  new THREE.SphereGeometry(1.005, 64, 64), // Sedikit lebih besar dari Bumi
  new THREE.MeshLambertMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  })
);
scene.add(clouds);


// Light sebagai sumber 'matahari'
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 0, 5);
scene.add(light);

// Ambient light kecil
scene.add(new THREE.AmbientLight(0x222222));

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animasi
function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.002;
clouds.rotation.y += 0.001; // Awan berputar lebih lambat dari bumi

  controls.update();
  renderer.render(scene, camera);
}

animate();
