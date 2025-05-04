import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// Tidak perlu mengimpor gsap karena sudah diimpor melalui CDN di HTML

// Setup
const scene = new THREE.Scene();

// Background bintang
const textureLoader = new THREE.TextureLoader();
try {
    scene.background = textureLoader.load('assets/textures/star_background.jpg');
} catch (error) {
    console.warn('Texture tidak ditemukan:', error);
    scene.background = new THREE.Color(0x000011); // Fallback ke warna biru gelap
}

// Kamera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
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

// Matahari
let sunTexture;
try {
    sunTexture = textureLoader.load('assets/textures/sun.jpg');
} catch (error) {
    console.warn('Texture matahari tidak ditemukan:', error);
    sunTexture = null;
}

const sunMaterial = sunTexture ? 
    new THREE.MeshBasicMaterial({ map: sunTexture }) : 
    new THREE.MeshBasicMaterial({ color: 0xffdd00 });

const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Cahaya matahari
const sunLight = new THREE.PointLight(0xffffff, 50, 500, 1);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Ambient light
const ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

// Efek glow matahari
const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
        'c': { type: 'f', value: 0.5 },
        'p': { type: 'f', value: 3.5 },
        glowColor: { type: 'c', value: new THREE.Color(0xffff66) },
        viewVector: { type: 'v3', value: camera.position }
    },
    vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
            vec3 vNormal = normalize(normalMatrix * normal);
            vec3 vNormel = normalize(normalMatrix * viewVector);
            intensity = pow(c - dot(vNormal, vNormel), p);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4(glow, 1.0);
        }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
});
const glowMesh = new THREE.Mesh(
    new THREE.SphereGeometry(5.3, 64, 64),
    glowMaterial
);
scene.add(glowMesh);

// Data planet
const planetsData = [
    { name: 'Merkurius', texture: 'merkurius.jpg', radius: 10, size: 0.3, speed: 0.04 },
    { name: 'Venus', texture: 'venus.jpg', radius: 15, size: 0.6, speed: 0.032 },
    {
        name: 'Bumi',
        dayTexture: 'earth.jpg',
        nightTexture: 'earthnight.jpg',
        cloudTexture: 'earthclouds.png',
        radius: 21,
        size: 0.65,
        speed: 0.028,
        satellites: [
            { name: 'Bulan', texture: 'moon.jpg', radius: 1.2, size: 0.18, speed: 0.05 }
        ]
    },
    { name: 'Mars', texture: 'mars.jpg', radius: 26, size: 0.4, speed: 0.023 },
    { name: 'Jupiter', texture: 'jupiter.jpg', radius: 35, size: 1.5, speed: 0.019 },
    { name: 'Saturnus', texture: 'saturnus.jpg', ringTexture: 'saturnusring.jpg', radius: 43, size: 1.3, speed: 0.016 },
    { name: 'Uranus', texture: 'uranus.jpg', radius: 50, size: 1.0, speed: 0.013 },
    { name: 'Neptunus', texture: 'neptunus.jpg', radius: 57, size: 0.95, speed: 0.01 }
];

// Asteroid belt
const asteroidGroup = []; // Array untuk asteroid-asteroid

const asteroidCount = 1000;
const asteroidInnerRadius = 29;
const asteroidOuterRadius = 32;

for (let i = 0; i < asteroidCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = THREE.MathUtils.lerp(asteroidInnerRadius, asteroidOuterRadius, Math.random());

    // Perbaiki ukuran asteroid yang terlalu kecil
    const asteroidSize = Math.random() * 0.1 + 0.05;
    const geometry = new THREE.SphereGeometry(asteroidSize, 8, 8);
    
    // Tambahkan material untuk asteroid dengan warna abu-abu acak untuk variasi
    const grayScale = Math.random() * 0.4 + 0.4; // Nilai antara 0.4-0.8
    const material = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color(grayScale, grayScale, grayScale) 
    });
    
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

// Planet array
const planets = [];

// Fungsi untuk menangani kesalahan loading texture
function loadTexture(path) {
    try {
        return textureLoader.load(path, 
            undefined, 
            undefined, 
            (err) => {
                console.warn(`Texture tidak ditemukan: ${path}`, err);
                return null;
            }
        );
    } catch (error) {
        console.warn(`Error loading texture ${path}:`, error);
        return null;
    }
}

// Membuat planet dan orbit
planetsData.forEach(data => {
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);

    let material;
    let planetMesh;

    if (data.name === 'Bumi') {
        // Load textures with error handling
        const dayTexture = loadTexture(`assets/textures/${data.dayTexture}`);
        const nightTexture = loadTexture(`assets/textures/${data.nightTexture}`);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                dayTexture: { value: dayTexture || new THREE.Texture() },
                nightTexture: { value: nightTexture || new THREE.Texture() },
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

        const earthMesh = new THREE.Mesh(geometry, material);

        // Awan
        const cloudTexture = loadTexture(`assets/textures/${data.cloudTexture}`);
        const clouds = new THREE.Mesh(
            new THREE.SphereGeometry(data.size * 1.01, 64, 64),
            new THREE.MeshLambertMaterial({
                map: cloudTexture || new THREE.Texture(),
                transparent: true,
                opacity: 0.5,
                depthWrite: false
            })
        );

        planetMesh = new THREE.Group();
        planetMesh.add(earthMesh);
        planetMesh.add(clouds);
        planetMesh.userData.name = data.name;

    } else if (data.name === 'Saturnus') {
        const saturnTexture = loadTexture(`assets/textures/${data.texture}`);
        material = new THREE.MeshLambertMaterial({
            map: saturnTexture || new THREE.Texture(),
            color: saturnTexture ? 0xffffff : 0xc2a579 // Fallback color if texture fails
        });

        const saturnusMesh = new THREE.Mesh(geometry, material);

        const ringTexture = loadTexture(`assets/textures/${data.ringTexture}`);
        if (ringTexture) {
            ringTexture.wrapS = THREE.RepeatWrapping;
            ringTexture.wrapT = THREE.ClampToEdgeWrapping; // karena kita tidak ingin vertikal diulang
        }

        const innerRadius = 1.7;
        const outerRadius = 2.5;
        const segments = 128;
        const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);

        const positions = ringGeometry.attributes.position;
        const uvs = ringGeometry.attributes.uv;

        for (let i = 0; i < uvs.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const angle = Math.atan2(y, x);
            const radius = Math.sqrt(x * x + y * y);

            uvs.setXY(i,
                (angle + Math.PI) / (2 * Math.PI), // U
                (radius - innerRadius) / (outerRadius - innerRadius)       // V
            );
        }

        const ringMaterial = new THREE.MeshBasicMaterial({
            map: ringTexture || null,
            color: ringTexture ? 0xffffff : 0xc2a579, // Fallback color
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: true
        });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);

        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = 0.01;
    
        // Jika planetMesh adalah Mesh, ubah jadi Group agar bisa ditambahkan cincin
        planetMesh = new THREE.Group();
        planetMesh.add(saturnusMesh);
        planetMesh.add(ringMesh);
        planetMesh.userData.name = data.name;
    
    } else {
        const planetTexture = loadTexture(`assets/textures/${data.texture}`);
        material = new THREE.MeshLambertMaterial({
            map: planetTexture || null,
            color: planetTexture ? 0xffffff : getDefaultPlanetColor(data.name) // Fallback color
        });

        planetMesh = new THREE.Mesh(geometry, material);
        planetMesh.userData.name = data.name;
    }

    scene.add(planetMesh);

    const orbit = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(createOrbitPath(data.radius)),
        new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);

    const planetSatellites = [];

    if (data.satellites) {
        data.satellites.forEach(sat => {
            const satGeometry = new THREE.SphereGeometry(sat.size, 32, 32);
            const satTexture = loadTexture(`assets/textures/${sat.texture}`);
            const satMaterial = new THREE.MeshLambertMaterial({
                map: satTexture || null,
                color: satTexture ? 0xffffff : 0xcccccc // Fallback color for moon
            });
            const satMesh = new THREE.Mesh(satGeometry, satMaterial);

            satMesh.castShadow = true;
            satMesh.receiveShadow = false;

            scene.add(satMesh);

            const satOrbit = new THREE.LineLoop(
                new THREE.BufferGeometry().setFromPoints(createOrbitPath(sat.radius)),
                new THREE.LineBasicMaterial({ color: 0xffffff })
            );
            satOrbit.rotation.x = Math.PI / 2;
            planetMesh.add(satOrbit);

            planetSatellites.push({
                mesh: satMesh,
                radius: sat.radius,
                speed: sat.speed,
                angle: Math.random() * Math.PI * 2
            });
        });
    }
    
    planets.push({
        mesh: planetMesh,
        radius: data.radius,
        speed: data.speed,
        angle: Math.random() * Math.PI * 2,
        satellites: planetSatellites
    });
});

// Fungsi untuk mendapatkan warna default planet jika texture gagal dimuat
function getDefaultPlanetColor(planetName) {
    const colors = {
        'Merkurius': 0x8c8c8c, // Abu-abu
        'Venus': 0xffd700,     // Kuning
        'Bumi': 0x0077be,      // Biru
        'Mars': 0xb22222,      // Merah
        'Jupiter': 0xdeb887,   // Coklat terang
        'Saturnus': 0xf0e68c,  // Khaki
        'Uranus': 0xadd8e6,    // Biru muda
        'Neptunus': 0x4169e1   // Biru tua
    };
    return colors[planetName] || 0xcccccc; // Default abu-abu muda
}

// Orbit path helper
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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Kecepatan simulasi
let simulationSpeed = 1;
const speedControl = document.getElementById('speedControl');
const speedValue = document.getElementById('speedValue');

speedControl.addEventListener('input', (e) => {
    simulationSpeed = parseFloat(e.target.value);
    speedValue.textContent = simulationSpeed.toFixed(1);
});

// Variables for planet tracking
let currentlyTracking = null;
let trackingOffset = new THREE.Vector3(0, 5, 10); // Inisialisasi tracking offset

function zoomOut() {
    currentlyTracking = null;

    const endPosition = new THREE.Vector3(0, 50, 100);
    const endTarget = new THREE.Vector3(0, 0, 0);

    gsap.to(camera.position, {
        duration: 2,
        x: endPosition.x,
        y: endPosition.y,
        z: endPosition.z,
        onUpdate: () => controls.update()
    });

    gsap.to(controls.target, {
        duration: 2,
        x: endTarget.x,
        y: endTarget.y,
        z: endTarget.z,
        onUpdate: () => controls.update()
    });

    document.getElementById('trackingStatus').textContent = 'Tidak melacak';
    document.getElementById('planetSelector').value = '';
}

// Fungsi zoom ke planet tertentu dan otomatis tracking
function zoomToPlanet(planetName) {
    const planet = planets.find(p => p.mesh.userData?.name === planetName);
    if (!planet) return;

    currentlyTracking = planet;

    const planetWorldPosition = new THREE.Vector3();
    planet.mesh.getWorldPosition(planetWorldPosition);

    // Menghitung offset berdasarkan ukuran planet (planet lebih besar = offset lebih jauh)
    const radius = planet.mesh instanceof THREE.Mesh ? 
        planet.mesh.geometry.parameters.radius : 
        (planet.mesh.children[0]?.geometry?.parameters?.radius || 1);
    
    // Membuat offset berdasarkan ukuran planet (jarak kamera dari planet)
    const offsetDistance = radius ;
    trackingOffset = new THREE.Vector3(0, offsetDistance/2, offsetDistance);

    // Posisi baru kamera
    const newPosition = planetWorldPosition.clone().add(trackingOffset);

    // GSAP animasi posisi kamera dan target
    gsap.to(camera.position, {
        duration: 2,
        x: newPosition.x,
        y: newPosition.y,
        z: newPosition.z,
        ease: "power2.inOut",
        onUpdate: () => {
            camera.lookAt(planet.position); // pastikan selalu melihat planet
        }
    });

    gsap.to(controls.target, {
        duration: 2,
        x: planetWorldPosition.x,
        y: planetWorldPosition.y,
        z: planetWorldPosition.z,
        onUpdate: () => controls.update()
    });

    document.getElementById('trackingStatus').textContent = `Melacak ${planetName}`;
}

// Dropdown handler - langsung tracking planet saat dipilih
document.getElementById('planetSelector').addEventListener('change', (e) => {
    const name = e.target.value;
    if (name === "") {
        // Stop tracking if empty selection
        zoomOut();
    } else if (name) {
        // Zoom dan mulai tracking otomatis
        zoomToPlanet(name);
    }
});

// Animasi
function animate() {
    requestAnimationFrame(animate);

    const delta = simulationSpeed * 0.1;

    // Rotasi matahari
    sun.rotation.y += 0.005 * delta;
    
    // Update glowMesh position and viewVector
    glowMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(
        camera.position,
        glowMesh.position
    );

    // Update planet posisi
    planets.forEach(planet => {
        planet.angle += planet.speed * delta;
        const x = Math.cos(planet.angle) * planet.radius;
        const z = Math.sin(planet.angle) * planet.radius;
        planet.mesh.position.set(x, 0, z);
        
        // Tambahkan rotasi planet
        if (planet.mesh instanceof THREE.Mesh) {
            planet.mesh.rotation.y += planet.speed * 2 * delta;
        } else if (planet.mesh instanceof THREE.Group) {
            // Jika planet adalah group (Bumi atau Saturnus), rotasi child pertama
            if (planet.mesh.children[0]) {
                planet.mesh.children[0].rotation.y += planet.speed * 2 * delta;
            }
            
            // Untuk Bumi, rotasi awan sedikit lebih cepat
            if (planet.mesh.userData.name === 'Bumi' && planet.mesh.children[1]) {
                planet.mesh.children[1].rotation.y += planet.speed * 2.2 * delta;
            }
        }

        // Update satelit jika ada
        if (planet.satellites) {
            planet.satellites.forEach(sat => {
                sat.angle += sat.speed * delta;
                const sx = x + Math.cos(sat.angle) * sat.radius;
                const sz = z + Math.sin(sat.angle) * sat.radius;
                sat.mesh.position.set(sx, 0, sz);
                
                // Tambahkan rotasi satelit
                sat.mesh.rotation.y += sat.speed * 1.5 * delta;
            });
        }
    });

    // Update asteroid belt
    asteroidGroup.forEach(ast => {
        ast.angle += ast.speed * delta;
        ast.mesh.position.x = Math.cos(ast.angle) * ast.radius;
        ast.mesh.position.z = Math.sin(ast.angle) * ast.radius;
        
        // Rotasi kecil untuk asteroid
        ast.mesh.rotation.x += 0.01 * delta;
        ast.mesh.rotation.y += 0.02 * delta;
    });

    // Update pelacakan planet
    if (currentlyTracking) {
        const planetPos = new THREE.Vector3();
        currentlyTracking.mesh.getWorldPosition(planetPos);
        
        // Hitung posisi kamera relatif terhadap planet dengan offset
        const desiredPos = planetPos.clone().add(trackingOffset);
        

        // Gunakan lerp untuk animasi smooth
        camera.position.lerp(desiredPos, 0.05);
        controls.target.lerp(planetPos, 0.05);
        controls.update();
    }

    renderer.render(scene, camera);
}
animate();