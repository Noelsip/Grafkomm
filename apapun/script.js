import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Setup
const scene = new THREE.Scene();

// Background bintang
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load('assets/textures/stars-map.jpg');

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

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Cahaya
const pointLight = new THREE.PointLight(0xffffff, 2, 500);
pointLight.position.set(0, 0, 0);

pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
pointLight.shadow.bias = -0.0005;

scene.add(pointLight);


// Matahari
const sunTexture = textureLoader.load('assets/textures/sun-map.jpg');
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Data planet
const planetsData = [
    { name: 'Merkurius', texture: 'mercury-map.jpg', radius: 8, size: 0.5, speed: 0.005, rotationSpeed: 0.002 },
    { name: 'Venus',     texture: 'venus-map.jpg',   radius: 12, size: 0.8, speed: 0.0035, rotationSpeed: -0.001 },
    { name: 'Bumi',      texture: 'earth-map.jpg',   radius: 16, size: 1, speed: 0.003, rotationSpeed: 0.01, hasMoon: true, moonSize: 0.27, moonDistance: 2 },
    { name: 'Mars',      texture: 'mars-map.jpg',    radius: 20, size: 0.7, speed: 0.0025, rotationSpeed: 0.009 },
    { name: 'Jupiter',   texture: 'jupiter-map.jpg', radius: 36, size: 2, speed: 0.002, rotationSpeed: 0.03 },
    { name: 'Saturnus',  texture: 'saturn-map.jpg',  radius: 46, size: 1.8, speed: 0.0015, rotationSpeed: 0.025, hasRing: true, ringInner: 2.2, ringOuter: 4, ringTilt: 0 },
    { name: 'Uranus',    texture: 'uranus-map.jpg',  radius: 54, size: 1.5, speed: 0.001, rotationSpeed: -0.02, hasRing: true, ringInner: 1.7, ringOuter: 2, ringTilt: Math.PI / 4 },
    { name: 'Neptunus',  texture: 'neptune-map.jpg', radius: 60, size: 1.4, speed: 0.0005, rotationSpeed: 0.02, hasRing: true, ringInner: 1.5, ringOuter: 1.8, ringTilt: 0 }
];

// Array planet
const planets = [];

// Asteroid belt
const asteroidGroup = []; // Array untuk asteroid-asteroid

const asteroidCount = 500;
const asteroidInnerRadius = 25;
const asteroidOuterRadius = 30;

for (let i = 0; i < asteroidCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = THREE.MathUtils.lerp(asteroidInnerRadius, asteroidOuterRadius, Math.random());

    const geometry = new THREE.SphereGeometry(Math.random() * 0.1 + 0.05, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const asteroid = new THREE.Mesh(geometry, material);

    asteroid.position.x = Math.cos(angle) * radius;
    asteroid.position.z = Math.sin(angle) * radius;
    asteroid.position.y = (Math.random() - 0.5) * 2;

    scene.add(asteroid);

    asteroidGroup.push({
        mesh: asteroid,
        radius: radius,
        angle: angle,
        speed: 0.02 + Math.random() * 0.01 // speed random sedikit supaya alami
    });
}

// Membuat planet dan label
planetsData.forEach(data => {
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(`assets/textures/${data.texture}`)
    });
    const mesh = new THREE.Mesh(geometry, material);
    if (data.name === 'Bumi') {
        const cloudTexture = textureLoader.load('assets/textures/earthclouds-map.jpg');
        
        const cloudGeometry = new THREE.SphereGeometry(data.size * 1.01, 32, 32); // Sedikit lebih besar dari bumi
        const cloudMaterial = new THREE.MeshPhongMaterial({
            map: cloudTexture,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
            side: THREE.DoubleSide
        });
    
        const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        mesh.add(cloudMesh); // cloud mengikuti planet
    }
    scene.add(mesh);

    // Jika planet punya cincin
    if (data.hasRing) {
        const ringTexture = textureLoader.load('assets/textures/ring-map.png'); // Texture cincin (contohnya)
        
        const ringGeometry = new THREE.RingGeometry(data.ringInner, data.ringOuter, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
            map: ringTexture,
            side: THREE.DoubleSide, 
            transparent: true,
            opacity: 0.8
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);

       // Rotasi cincin
        ring.rotation.x = Math.PI / 2; // Normal (sejajar orbit)

        if (data.name === 'Uranus') {
            ring.rotation.x = Math.PI / 2; // Awalnya sejajar
            ring.rotation.z = Math.PI / 2; // Tambah berdiri tegak
        } else if (data.ringTilt) {
            ring.rotation.z = data.ringTilt; // Untuk planet lain (kayak Saturnus/Neptunus)
        }
        mesh.add(ring); // attach ke planet
    }

    if (data.hasMoon) {
        const moonTexture = textureLoader.load('assets/textures/moon-map.jpg');
        const moonGeometry = new THREE.SphereGeometry(data.moonSize, 32, 32);
        const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);

        moon.position.set(data.moonDistance, 0, 0); // posisi relatif ke planet
        mesh.add(moon);

        // Simpan info buat animasi
        mesh.userData.moon = moon;
        mesh.userData.moonAngle = 0;
        mesh.userData.moonDistance = data.moonDistance;

        // (Opsional) Bikin lintasan orbit bulan
    const moonOrbit = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(createOrbitPath(data.moonDistance)),
        new THREE.LineBasicMaterial({ color: 0xaaaaaa })
    );
    moonOrbit.rotation.x = Math.PI / 2;
    mesh.add(moonOrbit);
    }

    planets.push({
        mesh,
        radius: data.radius,
        speed: data.speed,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: data.rotationSpeed
    });

    // Orbit (path lingkaran)
    const orbit = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(createOrbitPath(data.radius)),
        new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    orbit.rotation.x = Math.PI / 2; // Biar sejajar XY
    scene.add(orbit);

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
        planet.mesh.rotation.y += 0.01;

    if (planet.mesh.userData.moon) {
        const moon = planet.mesh.userData.moon;
        planet.mesh.userData.moonAngle += 0.002;
        moon.position.x = Math.cos(planet.mesh.userData.moonAngle) * planet.mesh.userData.moonDistance;
        moon.position.z = Math.sin(planet.mesh.userData.moonAngle) * planet.mesh.userData.moonDistance;
        planet.mesh.rotation.y += planet.rotationSpeed;
    }
    });

    controls.update();
    renderer.render(scene, camera);

    asteroidGroup.forEach(asteroid => {
        asteroid.angle += asteroid.speed * 0.00235; // lebih lambat dari planet
        asteroid.mesh.position.x = asteroid.radius * Math.cos(asteroid.angle);
        asteroid.mesh.position.z = asteroid.radius * Math.sin(asteroid.angle);
    });
    
}


animate();
