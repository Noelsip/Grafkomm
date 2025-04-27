import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Setup
const scene = new THREE.Scene();

// Background bintang
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load('assets/textures/star_background.jpg');

// Kamera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 100);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('solarSystem'),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Cahaya
const pointLight = new THREE.PointLight(0xffffff, 2, 500);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);


// Matahari
const sunTexture = textureLoader.load('assets/textures/sun.jpg');
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Data planet
const planetsData = [
    { name: 'Merkurius', texture: 'markurius.jpg', radius: 8, size: 0.5, speed: 0.04 },
    { name: 'Venus',     texture: 'venus.jpg',   radius: 12, size: 0.8, speed: 0.035 },
    { name: 'Bumi',      texture: 'earth.jpg',   radius: 16, size: 1, speed: 0.03 },
    { name: 'Mars',      texture: 'mars.jpg',    radius: 20, size: 0.7, speed: 0.025 },
    { name: 'Jupiter',   texture: 'jupiter.jpg', radius: 28, size: 2, speed: 0.02 },
    { name: 'Saturnus',  texture: 'saturnus.jpg',  radius: 36, size: 1.8, speed: 0.018 },
    { name: 'Uranus',    texture: 'uranus.jpg',  radius: 42, size: 1.5, speed: 0.015 },
    { name: 'Neptunus',  texture: 'neptunus.jpg', radius: 48, size: 1.4, speed: 0.013 }
];

// Array planet
const planets = [];

// Membuat planet dan label
planetsData.forEach(data => {
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(`assets/textures/${data.texture}`)
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Orbit (path lingkaran)
    const orbit = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(createOrbitPath(data.radius)),
        new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    orbit.rotation.x = Math.PI / 2; // Biar sejajar XY
    scene.add(orbit);

    planets.push({
        mesh,
        radius: data.radius,
        speed: data.speed,
        angle: Math.random() * Math.PI * 2
    });
});

// Fungsi bikin path orbit
function createOrbitPath(radius) {
    const points = [];
    for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
    }
    return points;
}

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animasi
function animate() {
    requestAnimationFrame(animate);

    sun.rotation.y += 0.001; // Matahari berputar

    planets.forEach(planet => {
        planet.angle += planet.speed;

        planet.mesh.position.x = planet.radius * Math.cos(planet.angle);
        planet.mesh.position.z = planet.radius * Math.sin(planet.angle);
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();
