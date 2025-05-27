import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

// --- Setup Scene, Camera, Renderer ---
const scene = new THREE.Scene();
scene.background = new THREE.Color('#87CEEB');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(15, 8, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Mouse Controls
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;
let cameraDistance = 30;
let cameraAngleX = 0;
let cameraAngleY = 0.3;
let followsRocket = true;
let targetPosition = new THREE.Vector3(0, 0, 0);

function updateCameraPosition(){

  targetPosition.copy(rocket.position);
  
  const x = targetPosition.x + Math.cos(cameraAngleX) * Math.cos(cameraAngleY) * cameraDistance;
  const y = targetPosition.y + Math.sin(cameraAngleY) * cameraDistance;
  const z = targetPosition.z + Math.sin(cameraAngleX) * Math.cos(cameraAngleY) * cameraDistance;

  camera.position.set(x, y, z);
  camera.lookAt(targetPosition);
}

// Mouse Event Listener for Camera Control
renderer.domElement.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  mouseX = event.clientX;
  mouseY = event.clientY;
  renderer.domElement.style.cursor = 'grabbing';
});

renderer.domElement.addEventListener('mouseup', () => {
  isMouseDown = false;
  renderer.domElement.style.cursor = 'grab';
});

renderer.domElement.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const deltaX = event.clientX - mouseX;
    const deltaY = event.clientY - mouseY;

    cameraAngleX -= deltaX * 0.003;
    cameraAngleY += deltaY * 0.003;
    
    cameraAngleY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2 - 0.1, cameraAngleY)); // Limit vertical angle
    
    mouseX = event.clientX;
    mouseY = event.clientY;

    updateCameraPosition();
  }
});

// Mouse wheel for zoom
renderer.domElement.addEventListener('wheel', (e) => {
  e.preventDefault();
  cameraDistance += e.deltaY * 0.01;
  cameraDistance = Math.max(5, Math.min(200, cameraDistance));
  updateCameraPosition();
});

renderer.domElement.style.cursor = 'grab';

// --- Lights ---
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(20, 30, 20);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// --- Ground (hijau seperti rumput) ---
const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x4a7c59 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// --- Launch Platform (persegi dengan lingkaran) ---
const platformBase = new THREE.Mesh(
  new THREE.BoxGeometry(12, 0.5, 12),
  new THREE.MeshLambertMaterial({ color: 0x666666 })
);
platformBase.position.y = 0.25;
platformBase.receiveShadow = true;
scene.add(platformBase);

const launchPad = new THREE.Mesh(
  new THREE.CylinderGeometry(4, 4, 0.3, 32),
  new THREE.MeshLambertMaterial({ color: 0x444444 })
);
launchPad.position.y = 0.65;
launchPad.receiveShadow = true;
scene.add(launchPad);

// Lingkaran putih di platform
const circle = new THREE.Mesh(
  new THREE.RingGeometry(3, 3.5, 32),
  new THREE.MeshLambertMaterial({ color: 0xffffff })
);
circle.rotation.x = -Math.PI / 2;
circle.position.y = 0.81;
scene.add(circle);

// --- Launch Tower (struktur merah dengan bentuk X) ---
const towerGroup = new THREE.Group();
const towerMaterial = new THREE.MeshLambertMaterial({ color: 0xcc3333 });

// Tiang utama vertikal
for (let i = 0; i < 4; i++) {
  const pillar = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 12, 0.3),
    towerMaterial
  );
  const angle = (i * Math.PI) / 2;
  pillar.position.set(Math.cos(angle) * 2.5, 6, Math.sin(angle) * 2.5);
  pillar.castShadow = true;
  towerGroup.add(pillar);
}

// Struktur X horizontal pada beberapa level
for (let level = 0; level < 4; level++) {
  const y = 2 + level * 2.5;
  
  // X patterns
  for (let side = 0; side < 4; side++) {
    const angle = (side * Math.PI) / 2;
    
    // Diagonal bars untuk membuat pola X
    const bar1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 3.5),
      towerMaterial
    );
    bar1.position.set(Math.cos(angle) * 2.5, y, Math.sin(angle) * 2.5);
    bar1.rotation.y = angle;
    bar1.rotation.z = Math.PI / 6;
    bar1.castShadow = true;
    towerGroup.add(bar1);
    
    const bar2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 3.5),
      towerMaterial
    );
    bar2.position.set(Math.cos(angle) * 2.5, y, Math.sin(angle) * 2.5);
    bar2.rotation.y = angle;
    bar2.rotation.z = -Math.PI / 6;
    bar2.castShadow = true;
    towerGroup.add(bar2);
  }
}

towerGroup.position.set(-8, 0, 0);
scene.add(towerGroup);

// --- Rocket ---
const rocket = new THREE.Group();
rocket.position.set(0, 1, 0);

// Badan roket utama (putih dengan garis hitam)
const mainBody = new THREE.Mesh(
  new THREE.CylinderGeometry(0.6, 0.6, 8, 16),
  new THREE.MeshLambertMaterial({ color: 0xffffff })
);
mainBody.position.y = 4;
mainBody.castShadow = true;
rocket.add(mainBody);

// Garis hitam di badan roket
const blackBand1 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.61, 0.61, 0.4, 16),
  new THREE.MeshLambertMaterial({ color: 0x000000 })
);
blackBand1.position.y = 2;
rocket.add(blackBand1);

const blackBand2 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.61, 0.61, 0.4, 16),
  new THREE.MeshLambertMaterial({ color: 0x000000 })
);
blackBand2.position.y = 6;
rocket.add(blackBand2);

// --- Main engine nozzle (corong utama) ---
const mainNozzle = new THREE.Mesh(
  new THREE.ConeGeometry(0.6, 2, 16),
  new THREE.MeshLambertMaterial({ color: 0x333333})
);
mainNozzle.position.y = 0.3;
rocket.add(mainNozzle);

// Nose cone (kerucut atas)
const noseCone = new THREE.Mesh(
  new THREE.ConeGeometry(0.6, 2, 16),
  new THREE.MeshLambertMaterial({ color: 0xffffff })
);
noseCone.position.y = 9;
noseCone.castShadow = true;
rocket.add(noseCone);

// Side boosters (2 roket samping hitam)
for (let i = -1; i <= 1; i += 2) {
  const booster = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 6, 12),
    new THREE.MeshLambertMaterial({ color: 0x222222 })
  );
  booster.position.set(i * 1.2, 3, 0);
  booster.castShadow = true;
  rocket.add(booster);
  
  // Nose cone untuk booster
  const boosterNose = new THREE.Mesh(
    new THREE.ConeGeometry(0.25, 0.8, 12),
    new THREE.MeshLambertMaterial({ color: 0x222222 })
  );
  boosterNose.position.set(i * 1.2, 6.4, 0);
  boosterNose.castShadow = true;
  rocket.add(boosterNose);

  // Booster nozzle
  const boosterNozzle = new THREE.Mesh(
    new THREE.ConeGeometry(0.35, 1, 12, 1, true),
    new THREE.MeshLambertMaterial({ color: 0x333333, side: THREE.DoubleSide })
  );
  boosterNozzle.position.set(i * 1.2, 0, 0);
  boosterNose.castShadow = true;
  rocket.add(boosterNozzle);

}

// Main engine flame
const mainFlame = new THREE.Mesh(
  new THREE.ConeGeometry(0.4, 2, 8),
  new THREE.MeshBasicMaterial({ 
    color: 0xff6600,
    transparent: true,
    opacity: 0.6
  })
);
mainFlame.rotation.x = Math.PI;
mainFlame.position.y = -1;
rocket.add(mainFlame);
mainFlame.visible = false;

// Side booster flames
const sideFlames = [];
for (let i = -1; i <= 1; i += 2) {
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 1, 6),
    new THREE.MeshBasicMaterial({ 
      color: 0xff6600,
      transparent: true,
      opacity: 0.8
    })
  );
  flame.rotation.x = Math.PI;
  flame.position.set(i * 1.2, -0.5, 0);
  rocket.add(flame);
  flame.visible = false;
  sideFlames.push(flame);
}
scene.add(rocket);

// --- Smoke System ---
const smokeParticles = [];

function createSmokeParticle(position, velocity, isGroundSmoke = false) {
  const material = new THREE.SpriteMaterial({
    color: isGroundSmoke ? 0xaaaaaa : 0xcccccc,
    transparent: true,
    opacity: isGroundSmoke ? 0.4 : 0.6,
    depthWrite: false
  });

  const sprite = new THREE.Sprite(material);
  sprite.position.copy(position);
  sprite.scale.set(isGroundSmoke ? 1 : 0.5, isGroundSmoke ? 1 : 0.5, 1);
  
  scene.add(sprite);
  
  smokeParticles.push({
    sprite: sprite,
    velocity: velocity.clone(),
    life: isGroundSmoke ? 2.0 : 1.0,
    maxLife: isGroundSmoke ? 2.0 : 1.0,
    initialScale: isGroundSmoke ? 1 : 0.5,
    isGroundSmoke: isGroundSmoke
  });
}

function generateSmoke() {
  // Get the world position and rotation of the rocket
  const rocketWorldPosition = new THREE.Vector3();
  const rocketWorldQuaternion = new THREE.Quaternion();
  rocket.getWorldPosition(rocketWorldPosition);
  rocket.getWorldQuaternion(rocketWorldQuaternion);

  // Main engine smoke - follows rocket's orientation
  const mainSmokeOffset = new THREE.Vector3(0, -1.5, 0);
  mainSmokeOffset.applyQuaternion(rocketWorldQuaternion);
  const mainSmokePos = rocketWorldPosition.clone().add(mainSmokeOffset);
  
  // Smoke velocity follows the opposite direction of rocket's thrust
  const thrustDirection = new THREE.Vector3(0, -1, 0);
  thrustDirection.applyQuaternion(rocketWorldQuaternion);
  const mainVelocity = thrustDirection.clone().multiplyScalar(0.09);
  mainVelocity.add(new THREE.Vector3(
    (Math.random() - 0.5) * 0.1,
    0,
    (Math.random() - 0.5) * 0.1
  ));
  createSmokeParticle(mainSmokePos, mainVelocity);
  
  // Side booster smoke - also follows rocket orientation
  for (let i = -1; i <= 1; i += 2) {
    const sideSmokeOffset = new THREE.Vector3(i * 1.2, -1, 0);
    sideSmokeOffset.applyQuaternion(rocketWorldQuaternion);
    const sidePos = rocketWorldPosition.clone().add(sideSmokeOffset);
    
    const sideVelocity = thrustDirection.clone().multiplyScalar(0.09);
    sideVelocity.add(new THREE.Vector3(
      (Math.random() - 0.5) * 0.08 + i * 0.05,
      0,
      (Math.random() - 0.5) * 0.08
    ));
    createSmokeParticle(sidePos, sideVelocity);
  }
  
  // Ground smoke - hanya jika roket masih dekat dengan platform
  if (rocket.position.y < 5) {
    for (let i = 0; i < 3; i++) {
      const groundSmokePos = new THREE.Vector3(
        (Math.random() - 0.5) * 2, // mulai dari area dekat roket
        0.8, // sedikit di atas platform
        (Math.random() - 0.5) * 2
      );
      const groundVelocity = new THREE.Vector3(
        (Math.random() - 0.05) * 0.002, // menyebar horizontal lebih cepat
        0, // tidak naik ke atas
        (Math.random() - 0.05) * 0.002
      );
      createSmokeParticle(groundSmokePos, groundVelocity, true);
    }
  }
}

function updateSmoke() {
  for (let i = smokeParticles.length - 1; i >= 0; i--) {
    const particle = smokeParticles[i];
    
    // Update position
    particle.sprite.position.add(particle.velocity);
    
    if (particle.isGroundSmoke) {
      // Ground smoke spreads horizontally and stays low
      particle.velocity.x += (Math.random() - 0.5) * 0.004;
      particle.velocity.z += (Math.random() - 0.5) * 0.004;
      particle.velocity.y -= 0.001; // slight downward movement to keep it grounded
      
      // Accelerate horizontal spread over time
      particle.velocity.x *= 1.01;
      particle.velocity.z *= 1.01;
      
      // Keep it from going too low
      if (particle.sprite.position.y < 0.5) {
        particle.velocity.y = 0;
        particle.sprite.position.y = 0.5;
      }
    } else {
      // Regular engine smoke
      particle.velocity.x += (Math.random() - 0.5) * 0.002;
      particle.velocity.z += (Math.random() - 0.5) * 0.002;
    }
    
    // Reduce life
    particle.life -= particle.isGroundSmoke ? 0.005 : 0.01;
    
    // Update visual properties
    const lifeRatio = particle.life / particle.maxLife;
    particle.sprite.material.opacity = lifeRatio * (particle.isGroundSmoke ? 0.4 : 0.6);
    
    if (particle.isGroundSmoke) {
      // Ground smoke grows larger and spreads more, staying flat
      particle.sprite.scale.setScalar(particle.initialScale + (1 - lifeRatio) * 6);
    } else {
      particle.sprite.scale.setScalar(particle.initialScale + (1 - lifeRatio) * 2);
    }
    
    // Remove dead particles
    if (particle.life <= 0) {
      scene.remove(particle.sprite);
      smokeParticles.splice(i, 1);
    }
  }
}

// --- Animation Variables ---
let islaunching = false;
let hasExploded = false;
let launchStartTime = null;
let velocity = 0;
let tiltAngle = 0;
const delayBeforeLiftOff = 2000;
const acceleration = 2;

const initialRocketPosition = rocket.position.clone();
const initialRocketRotation = rocket.rotation.clone();
const initialCameraPosition = camera.position.clone();

// --- Controls ---
let moveLeft = false, moveRight = false;

document.addEventListener('keydown', (e) => {
  if (e.key === 'a' || e.key === 'ArrowLeft') moveLeft = true;
  if (e.key === 'd' || e.key === 'ArrowRight') moveRight = true;
  if (e.key === ' ' && !islaunching)
    islaunching = true,
    mainFlame.visible = true,
    sideFlames.forEach(flame => flame.visible = true),
    launchStartTime = performance.now(),
    velocity = 0;
    updateCameraPosition();

});

document.addEventListener('keyup', (e) => {
  if (e.key === 'a' || e.key === 'ArrowLeft') moveLeft = false;
  if (e.key === 'd' || e.key === 'ArrowRight') moveRight = false;
});

document.getElementById('launchButton').addEventListener('click', () => {
  if (!islaunching) {
    islaunching = true;
    mainFlame.visible = true;
    sideFlames.forEach(flame => flame.visible = true);
    launchStartTime = performance.now();
    velocity = 0;
  }
});

document.getElementById('resetButton').addEventListener('click', () => {
  islaunching = false;
  hasExploded = false;
  velocity = 0;
  tiltAngle = 0;

  rocket.position.copy(initialRocketPosition);
  rocket.rotation.copy(initialRocketRotation);
  camera.position.copy(initialCameraPosition);
  camera.lookAt(rocket.position);

  mainFlame.visible = false;
  sideFlames.forEach(flame => flame.visible = false);

  if (!scene.children.includes(rocket)) {
    scene.add(rocket);
  }

  // Clear smoke particles
  smokeParticles.forEach(particle => scene.remove(particle.sprite));
  smokeParticles.length = 0;

  scene.background = new THREE.Color('#87CEEB');
  launchStartTime = null;
});

// --- Explosion Functions ---
function shakeCamera() {
  const originalPosition = camera.position.clone();
  let shakeFrame = 0;
  
  function shakeStep() {
    if (shakeFrame++ < 30) {
      camera.position.set(
        originalPosition.x + (Math.random() - 0.5) * 0.8,
        originalPosition.y + (Math.random() - 0.5) * 0.8,
        originalPosition.z + (Math.random() - 0.5) * 0.8
      );
      requestAnimationFrame(shakeStep);
    } else {
      camera.position.copy(originalPosition);
    }
  }
  shakeStep();
}

function createExplosionParticles(position) {
  for (let i = 0; i < 30; i++) {
    const material = new THREE.SpriteMaterial({
      color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.05, 1, 0.5),
      transparent: true,
      opacity: 1,
      depthWrite: false
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.scale.set(1, 1, 1);
    scene.add(sprite);

    const velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 3,
      Math.random() * 3 + 1,
      (Math.random() - 0.5) * 3
    );
    
    let frame = 0;
    const maxFrame = 80;
    
    function animateExplosion() {
      if (frame++ < maxFrame) {
        sprite.position.add(velocity);
        velocity.y -= 0.02;
        sprite.material.opacity -= 1 / maxFrame;
        sprite.scale.multiplyScalar(1.02);
        requestAnimationFrame(animateExplosion);
      } else {
        scene.remove(sprite);
      }
    }
    animateExplosion();
  }
}

function explodeRocket() {
  hasExploded = true;
  scene.remove(rocket);

  createExplosionParticles(rocket.position);
  document.getElementById('explosionSound').play().catch(() => {});
  shakeCamera();
}

// --- Main Animation Loop ---
function animate() {
  requestAnimationFrame(animate);

  if (islaunching && !hasExploded) {
    const now = performance.now();
    const elapsed = now - launchStartTime;
    generateSmoke();
    // Handle rocket tilting
    if (moveLeft) {
      tiltAngle -= 0.01;
    }
    if (moveRight) {
      tiltAngle += 0.01;
    }
    // Apply tilt to rocket
    rocket.rotation.z = THREE.MathUtils.degToRad(tiltAngle);

    if (elapsed > delayBeforeLiftOff) {
      const timeSinceLiftOff = (elapsed - delayBeforeLiftOff) / 1000;
      velocity = acceleration * timeSinceLiftOff;
      const distance = 0.5 * acceleration * timeSinceLiftOff * timeSinceLiftOff;

       // Calculate movement direction based on rocket's tilt
      const direction = new THREE.Vector3(0, 1, 0);
      direction.applyQuaternion(rocket.quaternion);
      
      const newPosition = initialRocketPosition.clone().add(direction.multiplyScalar(distance));
      rocket.position.copy(newPosition);

      // // Camera follows rocket
      // camera.position.set(
      //   rocket.position.x + 15, 
      //   Math.max(rocket.position.y + 5, 8), 
      //   rocket.position.z + 20
      // );
      // camera.lookAt(rocket.position);
      if (islaunching) {
        updateCameraPosition();
        
      }
    }
  }
  camera.lookAt(rocket.position);
  // Update smoke particles
  updateSmoke();

  // Change background based on altitude
  if (rocket.position.y > 100) {
    scene.background = new THREE.Color('#000011');
  } else if (rocket.position.y > 50) {
    const t = (rocket.position.y - 50) / 50;
    scene.background = new THREE.Color().lerpColors(
      new THREE.Color('#87CEEB'),
      new THREE.Color('#000011'),
      t
    );
  } else {
    scene.background = new THREE.Color('#87CEEB');
  }

  // Ground collision detection
  if (!hasExploded && rocket.position.y <= 0.5) {
    explodeRocket();
  }

  // Update UI
  document.getElementById('rocketHeight').textContent = Math.max(0, rocket.position.y - 1).toFixed(1);
  document.getElementById('kecepatan').textContent = velocity.toFixed(1);

  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate()