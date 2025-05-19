import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Setup
const scene = new THREE.Scene();

// Background bintang
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load('assets/textures/star_background.jpg');

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
const sunTexture = textureLoader.load('assets/textures/sun.jpg');
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.name = "Sun";
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
    { name: 'Merkurius', texture: 'markurius.jpg', radius: 10, size: 0.3, speed: 0.04 },
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
    { name: 'Saturnus', texture: 'saturnus.jpg',ringTexture: 'saturnusring.jpg', radius: 43, size: 1.3, speed: 0.016 },
    { name: 'Uranus', texture: 'uranus.jpg', radius: 50, size: 1.0, speed: 0.013 },
    { name: 'Neptunus', texture: 'neptunus.jpg', radius: 57, size: 0.95, speed: 0.01 }
];

// Asteroid Belt
const asteroidGroup = [];

const asteroidCount = 1000;
const asteroidInnerRadius = 29;
const asteroidOuterRadius = 32;

for(let i = 0; i < asteroidCount; i++){
    const angle = Math.random() * Math.PI * 2;
    const radius = THREE.MathUtils.lerp(asteroidInnerRadius, asteroidOuterRadius, Math.random());

    // fix asteroid size which then small
    const asteroidSize = Math.random() * 0.1 + 0.05;
    const geometry = new THREE.SphereGeometry(asteroidSize, 8, 8);

    // Add the materials for asteroid with gray color for variation
    const grayScale = Math.random() * 0.4 + 0.4;
    const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(grayScale, grayScale, grayScale),
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
        speed: 0.02 + Math.random() * 0.01
    });
}

// Planet array
const planets = [];

// Membuat planet dan orbit
planetsData.forEach(data => {
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);

    let material;
    let planetMesh;

    if (data.name === 'Bumi') {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                dayTexture: { value: textureLoader.load(`assets/textures/${data.texture}`) },
                nightTexture: { value: textureLoader.load(`assets/textures/${data.nightTexture}`) },
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
        const cloudTexture = textureLoader.load(`assets/textures/${data.cloudTexture}`);
        const clouds = new THREE.Mesh(
            new THREE.SphereGeometry(data.size * 1.01, 64, 64),
            new THREE.MeshLambertMaterial({
                map: cloudTexture,
                transparent: true,
                opacity: 0.5,
                depthWrite: false
            })
        );

        planetMesh = new THREE.Group();
        planetMesh.add(earthMesh);
        planetMesh.add(clouds);


    } else if (data.name === 'Saturnus') {
        material = new THREE.MeshLambertMaterial({
            map: textureLoader.load(`assets/textures/${data.texture}`)
        });

        const saturnusMesh = new THREE.Mesh(geometry, material);

        const ringTexture = textureLoader.load(`assets/textures/${data.ringTexture}`);
        ringTexture.wrapS = THREE.RepeatWrapping;
        ringTexture.wrapT = THREE.ClampToEdgeWrapping; // karena kita tidak ingin vertikal diulang
        ringTexture.repeat.set(10, 1);

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
                (angle + Math.PI) / (2 * Math.PI) * ringTexture.repeat.x, // U
                (radius - innerRadius) / (outerRadius - innerRadius)       // V
            );
        }

        const ringMaterial = new THREE.MeshBasicMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true
        });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2;        

        // ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = 0.01;
    
        // Jika planetMesh adalah Mesh, ubah jadi Group agar bisa ditambahkan cincin
        planetMesh = new THREE.Group();
        planetMesh.add(saturnusMesh);
        planetMesh.add(ringMesh);
    
    }else {
        material = new THREE.MeshLambertMaterial({
            map: textureLoader.load(`assets/textures/${data.texture}`)
        });

        planetMesh = new THREE.Mesh(geometry, material);
    }

    scene.add(planetMesh);

    const orbit = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(createOrbitPath(data.radius)),
        new THREE.LineBasicMaterial({ color: 0xffffff })
    )
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);

    const planetSatellites = [];

    data.satellites?.forEach(sat => {
        const satGeometry = new THREE.SphereGeometry(sat.size, 32, 32);
        const satMaterial = new THREE.MeshLambertMaterial({
            map: textureLoader.load(`assets/textures/${sat.texture}`)
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
    
    planets.push({
        mesh: planetMesh,
        radius: data.radius,
        speed: data.speed,
        angle: Math.random() * Math.PI * 2,
        satellites: planetSatellites
    })
});

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
document.getElementById('speedControl').addEventListener('input', (e) => {
    simulationSpeed = parseFloat(e.target.value);
});

// Animasi
function animate() {
    requestAnimationFrame(animate);

    // const delta = simulationSpeed * 0.1;

    glowMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(
        camera.position, glowMesh.position
    );

    sun.rotation.y += 0.001 * simulationSpeed;

    planets.forEach(planet => {
        planet.angle += planet.speed * simulationSpeed;

        planet.mesh.position.x = planet.radius * Math.cos(planet.angle);
        planet.mesh.position.z = planet.radius * Math.sin(planet.angle);

        planet.mesh.rotation.y += 0.01 * simulationSpeed;

        // Jika planet adalah grup (seperti Bumi), rotasi awannya
        if (planet.mesh.children && planet.mesh.children.length > 1) {
            const clouds = planet.mesh.children[1];
            clouds.rotation.y += 0.001 * simulationSpeed;
        }

        planet.satellites?.forEach(sat => {
            sat.angle += sat.speed * simulationSpeed;
            sat.mesh.position.x = planet.mesh.position.x + sat.radius * Math.cos(sat.angle);
            sat.mesh.position.z = planet.mesh.position.z + sat.radius * Math.sin(sat.angle);
            sat.mesh.position.y = planet.mesh.position.y;

            sat.mesh.rotation.y += 0.01 * simulationSpeed;
        });


    });

    asteroidGroup.forEach(ast => {
        ast.angle += ast.speed * simulationSpeed;
        ast.mesh.position.x = Math.cos(ast.angle) * ast.radius;
        ast.mesh.position.z = Math.sin(ast.angle) * ast.radius;

        // small rotate for asteroid
        ast.mesh.rotation.x += 0.01 * simulationSpeed;
        ast.mesh.rotation.y += 0.02 * simulationSpeed;
    })

    TWEEN.update();

    if (focusedPlanet) {
        const planetPos = focusedPlanet.getWorldPosition(new THREE.Vector3());
        const desiredPos = new THREE.Vector3().addVectors(
            planetPos,
            cameraOffset.clone().setLength(followDistance)
        );
        camera.position.lerp(desiredPos, 0.05); // Smooth follow
        controls.target.copy(planetPos);
    }

    controls.update();
    renderer.render(scene, camera);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let focusedPlanet = null;
let followDistance = 10; // Jarak kamera dari planet yang difokuskan
let cameraOffset = new THREE.Vector3();

window.addEventListener("click", onclick, false);

function onclick(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));

    if (intersects.length > 0) {
        const selected = intersects[0].object;

        // Cek apakah yang diklik adalah matahari
        if (focusedPlanet == selected){
            focusedPlanet = null;

            const resetPos = new THREE.Vector3(0, 50, 150);
            new TWEEN.Tween(camera.position)
                .to({x: resetPos.x, y: resetPos.y, z:resetPos.z}, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    controls.target.set(0, 0, 0);
                    controls.update();
                })
                .start();
            return;
        }

        // Fokus ke planet selain matahari
        focusedPlanet = selected;

        const planetPos = focusedPlanet.getWorldPosition(new THREE.Vector3());
        cameraOffset.copy(camera.position).sub(planetPos);

        const targetCamPos = new THREE.Vector3().addVectors(
            planetPos,
            cameraOffset.clone().setLength(followDistance)
        );

        new TWEEN.Tween(camera.position)
            .to({ x: targetCamPos.x, y: targetCamPos.y, z: targetCamPos.z }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                controls.target.copy(focusedPlanet.getWorldPosition(new THREE.Vector3()));
                controls.update();
            })
            .start();
    }
}

animate();
