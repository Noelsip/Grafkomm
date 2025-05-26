import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

// Physics Constants
const GRAVITY = 9.81;
const AIR_DENSITY_SEA_LEVEL = 1.225;
const SCALE_FACTOR = 0.1; // Visual scale factor

// Rocket Configuration
const ROCKET_CONFIG = {
  dryMass: 2000, // kg
  fuelMass: 18000, // kg
  mainEngine: {
    thrust: 180000, // N (18 tons force)
    specificImpulse: 280, // seconds
    fuelFlow: 65, // kg/s
    gimbalRange: 15 // degrees
  },
  sideBooster: {
    thrust: 120000, // N each
    specificImpulse: 260,
    fuelFlow: 47, // kg/s each
    separationAltitude: 50 // meters
  },
  rcs: {
    thrust: 400, // N total
    fuelFlow: 0.2 // kg/s
  },
  aerodynamics: {
    dragCoefficient: 0.3,
    referenceArea: 3.14 // m²
  }
};

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color('#87CEEB');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(15, 8, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// Enhanced Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(20, 30, 20);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
scene.add(directionalLight);

// Ground with texture
const groundGeometry = new THREE.PlaneGeometry(500, 500, 50, 50);
const groundMaterial = new THREE.MeshLambertMaterial({ 
  color: 0x4a7c59,
  transparent: true,
  opacity: 0.9
});

// Add some ground variation
const groundVertices = groundGeometry.attributes.position.array;
for (let i = 0; i < groundVertices.length; i += 3) {
  groundVertices[i + 2] = Math.random() * 0.5;
}
groundGeometry.attributes.position.needsUpdate = true;
groundGeometry.computeVertexNormals();

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Enhanced Launch Platform
const platformBase = new THREE.Mesh(
  new THREE.BoxGeometry(15, 1, 15),
  new THREE.MeshLambertMaterial({ color: 0x666666 })
);
platformBase.position.y = 0.5;
platformBase.receiveShadow = true;
platformBase.castShadow = true;
scene.add(platformBase);

// Flame Trench
const trenchGeometry = new THREE.BoxGeometry(8, 2, 2);
const trench = new THREE.Mesh(trenchGeometry, new THREE.MeshLambertMaterial({ color: 0x333333 }));
trench.position.set(0, -0.5, 0);
scene.add(trench);

// Launch Tower (more detailed)
const towerGroup = new THREE.Group();
const towerMaterial = new THREE.MeshLambertMaterial({ color: 0xcc3333 });

// Main support structure
for (let i = 0; i < 4; i++) {
  const pillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.3, 20, 8),
    towerMaterial
  );
  const angle = (i * Math.PI) / 2;
  pillar.position.set(Math.cos(angle) * 3, 10, Math.sin(angle) * 3);
  pillar.castShadow = true;
  towerGroup.add(pillar);
  
  // Cross braces
  for (let j = 1; j < 4; j++) {
    const brace = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 4.2),
      towerMaterial
    );
    brace.position.set(Math.cos(angle) * 3, j * 5, Math.sin(angle) * 3);
    brace.rotation.z = (i % 2 === 0) ? Math.PI / 4 : -Math.PI / 4;
    brace.castShadow = true;
    towerGroup.add(brace);
  }
}

towerGroup.position.set(-10, 0, 0);
scene.add(towerGroup);

// Enhanced Rocket
const rocket = new THREE.Group();
rocket.position.set(0, 1.5, 0);

// Main body with better proportions
const mainBody = new THREE.Mesh(
  new THREE.CylinderGeometry(0.8, 0.8, 12, 16),
  new THREE.MeshPhongMaterial({ 
    color: 0xffffff,
    shininess: 30,
    specular: 0x111111
  })
);
mainBody.position.y = 6;
mainBody.castShadow = true;
rocket.add(mainBody);

// Fuel tank sections
const tankMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0, shininess: 20 });
for (let i = 0; i < 3; i++) {
  const tank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.82, 0.82, 0.3, 16),
    new THREE.MeshPhongMaterial({ color: 0x333333 })
  );
  tank.position.y = 2 + i * 4;
  rocket.add(tank);
}

// Nose cone with better aerodynamics
const noseCone = new THREE.Mesh(
  new THREE.ConeGeometry(0.8, 3, 16),
  new THREE.MeshPhongMaterial({ 
    color: 0xffffff,
    shininess: 50
  })
);
noseCone.position.y = 13.5;
noseCone.castShadow = true;
rocket.add(noseCone);

// Side boosters with separation capability
const sideBoosterGroup = new THREE.Group();
for (let i = -1; i <= 1; i += 2) {
  const boosterGroup = new THREE.Group();
  
  const booster = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 10, 12),
    new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 20 })
  );
  booster.position.set(i * 1.5, 5, 0);
  booster.castShadow = true;
  boosterGroup.add(booster);
  
  const boosterNose = new THREE.Mesh(
    new THREE.ConeGeometry(0.4, 1.5, 12),
    new THREE.MeshPhongMaterial({ color: 0x222222 })
  );
  boosterNose.position.set(i * 1.5, 10.75, 0);
  boosterNose.castShadow = true;
  boosterGroup.add(boosterNose);
  
  sideBoosterGroup.add(boosterGroup);
}
rocket.add(sideBoosterGroup);

// Engine nozzles
const mainNozzle = new THREE.Mesh(
  new THREE.ConeGeometry(0.6, 1.5, 12),
  new THREE.MeshPhongMaterial({ color: 0x444444, shininess: 80 })
);
mainNozzle.position.y = -0.75;
mainNozzle.castShadow = true;
rocket.add(mainNozzle);

// Side booster nozzles
for (let i = -1; i <= 1; i += 2) {
  const nozzle = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.8, 8),
    new THREE.MeshPhongMaterial({ color: 0x444444, shininess: 80 })
  );
  nozzle.position.set(i * 1.5, -0.4, 0);
  nozzle.castShadow = true;
  sideBoosterGroup.add(nozzle);
}

scene.add(rocket);

// Enhanced Particle System for Engine Effects
class EngineEffect {
  constructor(position, scale = 1, color = 0xff6600) {
    this.particles = [];
    this.position = position;
    this.scale = scale;
    this.color = color;
    this.intensity = 0;
  }
  
  update(intensity) {
    this.intensity = intensity;
    
    if (intensity > 0) {
      // Create new flame particles
      for (let i = 0; i < intensity * 5; i++) {
        const particle = new THREE.Mesh(
          new THREE.SphereGeometry(0.1 * this.scale, 4, 4),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(
              Math.random() * 0.1 + 0.05,
              1,
              0.5 + Math.random() * 0.3
            ),
            transparent: true,
            opacity: 0.8
          })
        );
        
        particle.position.copy(this.position);
        particle.position.add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.5 * this.scale,
          -Math.random() * 2 * this.scale,
          (Math.random() - 0.5) * 0.5 * this.scale
        ));
        
        particle.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          -0.1 - Math.random() * 0.05,
          (Math.random() - 0.5) * 0.02
        );
        
        particle.life = 30 + Math.random() * 20;
        particle.maxLife = particle.life;
        
        scene.add(particle);
        this.particles.push(particle);
      }
    }
    
    // Update existing particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.position.add(particle.velocity);
      particle.life--;
      
      const lifeRatio = particle.life / particle.maxLife;
      particle.material.opacity = lifeRatio * 0.8;
      particle.scale.setScalar(1 + (1 - lifeRatio) * 2);
      
      if (particle.life <= 0) {
        scene.remove(particle);
        this.particles.splice(i, 1);
      }
    }
  }
  
  clear() {
    this.particles.forEach(particle => scene.remove(particle));
    this.particles = [];
  }
}

// Engine Effects
const mainEngineEffect = new EngineEffect(new THREE.Vector3(0, -1.5, 0), 1.5);
const leftBoosterEffect = new EngineEffect(new THREE.Vector3(-1.5, -1, 0), 1);
const rightBoosterEffect = new EngineEffect(new THREE.Vector3(1.5, -1, 0), 1);

// Rocket Physics State
const rocketState = {
  // Physical properties
  position: new THREE.Vector3(0, 1.5, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  acceleration: new THREE.Vector3(0, 0, 0),
  rotation: new THREE.Euler(0, 0, 0),
  angularVelocity: new THREE.Vector3(0, 0, 0),
  
  // Mass properties
  currentMass: ROCKET_CONFIG.dryMass + ROCKET_CONFIG.fuelMass,
  fuelRemaining: ROCKET_CONFIG.fuelMass,
  
  // Engine states
  mainEngineThrottle: 0,
  leftBoosterThrottle: 0,
  rightBoosterThrottle: 0,
  rcsActive: false,
  
  // Flight parameters
  gimbalX: 0, // pitch
  gimbalZ: 0, // yaw
  
  // Mission state
  launched: false,
  boostersSeparated: false,
  flightTime: 0,
  maxAltitude: 0,
  maxVelocity: 0,
  
  // Performance tracking
  deltaV: 0,
  apoapsis: 0
};

// Input handling
const controls = {
  throttleUp: false,
  throttleDown: false,
  pitchUp: false,
  pitchDown: false,
  yawLeft: false,
  yawRight: false,
  maxThrottle: false,
  engineCutoff: false
};

document.addEventListener('keydown', (e) => {
  switch(e.key.toLowerCase()) {
    case 'w': case 'arrowup': controls.pitchUp = true; break;
    case 's': case 'arrowdown': controls.pitchDown = true; break;
    case 'a': case 'arrowleft': controls.yawLeft = true; break;
    case 'd': case 'arrowright': controls.yawRight = true; break;
    case ' ': controls.maxThrottle = true; e.preventDefault(); break;
    case 'x': controls.engineCutoff = true; break;
  }
});

document.addEventListener('keyup', (e) => {
  switch(e.key.toLowerCase()) {
    case 'w': case 'arrowup': controls.pitchUp = false; break;
    case 's': case 'arrowdown': controls.pitchDown = false; break;
    case 'a': case 'arrowleft': controls.yawLeft = false; break;
    case 'd': case 'arrowright': controls.yawRight = false; break;
    case ' ': controls.maxThrottle = false; break;
    case 'x': controls.engineCutoff = false; break;
  }
});

// UI Controls
document.getElementById('launchBtn').addEventListener('click', () => {
  if (!rocketState.launched) {
    rocketState.launched = true;
    rocketState.mainEngineThrottle = 0.8;
    rocketState.leftBoosterThrottle = 1.0;
    rocketState.rightBoosterThrottle = 1.0;
    
    // Play ignition sound
    document.getElementById('engineIgnition').play().catch(() => {});
  }
});

document.getElementById('throttleUpBtn').addEventListener('click', () => {
  rocketState.mainEngineThrottle = Math.min(1.0, rocketState.mainEngineThrottle + 0.1);
});

document.getElementById('throttleDownBtn').addEventListener('click', () => {
  rocketState.mainEngineThrottle = Math.max(0, rocketState.mainEngineThrottle - 0.1);
});

const detachedBoosters = []; // Untuk animasi booster terlepas

document.getElementById('separateBoostersBtn').addEventListener('click', () => {
  if (rocketState.launched && !rocketState.boostersSeparated) {
    rocketState.boostersSeparated = true;
    rocketState.leftBoosterThrottle = 0;
    rocketState.rightBoosterThrottle = 0;

    // Animasi pemisahan booster
    sideBoosterGroup.children.forEach((booster, index) => {
      const direction = index === 0 ? -1 : 1; // kiri atau kanan
      const boosterClone = booster.clone();
      boosterClone.position.copy(booster.position);
      boosterClone.velocity = new THREE.Vector3(direction * 0.5, -1, 0); // ke samping + turun
      boosterClone.initialY = booster.position.y;

      scene.add(boosterClone);
      detachedBoosters.push(boosterClone);
    });

    // Hapus booster lama dari roket
    rocket.remove(sideBoosterGroup);
  }
});

function updateDetachedBoosters(deltaTime) {
  detachedBoosters.forEach((booster) => {
    booster.position.addScaledVector(booster.velocity, deltaTime);
    booster.velocity.y -= GRAVITY * deltaTime; // efek gravitasi
  });
}



document.getElementById('rcsToggleBtn').addEventListener('click', () => {
  rocketState.rcsActive = !rocketState.rcsActive;
});

document.getElementById('emergencyShutdownBtn').addEventListener('click', () => {
  rocketState.mainEngineThrottle = 0;
  rocketState.leftBoosterThrottle = 0;
  rocketState.rightBoosterThrottle = 0;
});

document.getElementById('resetBtn').addEventListener('click', () => {
  // Reset all state
  Object.assign(rocketState, {
    position: new THREE.Vector3(0, 1.5, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    acceleration: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
    angularVelocity: new THREE.Vector3(0, 0, 0),
    currentMass: ROCKET_CONFIG.dryMass + ROCKET_CONFIG.fuelMass,
    fuelRemaining: ROCKET_CONFIG.fuelMass,
    mainEngineThrottle: 0,
    leftBoosterThrottle: 0,
    rightBoosterThrottle: 0,
    rcsActive: false,
    gimbalX: 0,
    gimbalZ: 0,
    launched: false,
    boostersSeparated: false,
    flightTime: 0,
    maxAltitude: 0,
    maxVelocity: 0,
    deltaV: 0,
    apoapsis: 0
  });
  
  rocket.position.copy(rocketState.position);
  rocket.rotation.copy(rocketState.rotation);
  camera.position.set(15, 8, 20);
  scene.background = new THREE.Color('#87CEEB');
  
  // Clear particle effects
  mainEngineEffect.clear();
  leftBoosterEffect.clear();
  rightBoosterEffect.clear();
});

// Physics simulation
function updatePhysics(deltaTime) {
  if (!rocketState.launched) return;
  
  // Update flight time
  rocketState.flightTime += deltaTime;
  
  // Handle controls
  if (controls.maxThrottle) {
    rocketState.mainEngineThrottle = 1.0;
  }
  if (controls.engineCutoff) {
    rocketState.mainEngineThrottle = 0;
    rocketState.leftBoosterThrottle = 0;
    rocketState.rightBoosterThrottle = 0;
  }
  
  // Thrust vectoring (gimbal control)
  const gimbalRate = 30 * deltaTime; // degrees per second
  if (controls.pitchUp) rocketState.gimbalX = Math.max(-ROCKET_CONFIG.mainEngine.gimbalRange, rocketState.gimbalX - gimbalRate);
  if (controls.pitchDown) rocketState.gimbalX = Math.min(ROCKET_CONFIG.mainEngine.gimbalRange, rocketState.gimbalX + gimbalRate);
  if (controls.yawLeft) rocketState.gimbalZ = Math.max(-ROCKET_CONFIG.mainEngine.gimbalRange, rocketState.gimbalZ - gimbalRate);
  if (controls.yawRight) rocketState.gimbalZ = Math.min(ROCKET_CONFIG.mainEngine.gimbalRange, rocketState.gimbalZ + gimbalRate);
  
  // Calculate total thrust
  let totalThrust = 0;
  let totalFuelFlow = 0;
  
  // Main engine
  if (rocketState.mainEngineThrottle > 0 && rocketState.fuelRemaining > 0) {
    totalThrust += ROCKET_CONFIG.mainEngine.thrust * rocketState.mainEngineThrottle;
    totalFuelFlow += ROCKET_CONFIG.mainEngine.fuelFlow * rocketState.mainEngineThrottle;
  }
  
  // Side boosters (only if not separated)
  if (!rocketState.boostersSeparated && rocketState.fuelRemaining > 0) {
    if (rocketState.leftBoosterThrottle > 0) {
      totalThrust += ROCKET_CONFIG.sideBooster.thrust * rocketState.leftBoosterThrottle;
      totalFuelFlow += ROCKET_CONFIG.sideBooster.fuelFlow * rocketState.leftBoosterThrottle;
    }
    if (rocketState.rightBoosterThrottle > 0) {
      totalThrust += ROCKET_CONFIG.sideBooster.thrust * rocketState.rightBoosterThrottle;
      totalFuelFlow += ROCKET_CONFIG.sideBooster.fuelFlow * rocketState.rightBoosterThrottle;
    }
  }
  
  // RCS thrusters
  if (rocketState.rcsActive && rocketState.fuelRemaining > 0) {
    totalFuelFlow += ROCKET_CONFIG.rcs.fuelFlow;
  }
  
  // Update fuel consumption
  rocketState.fuelRemaining = Math.max(0, rocketState.fuelRemaining - totalFuelFlow * deltaTime);
  rocketState.currentMass = ROCKET_CONFIG.dryMass + rocketState.fuelRemaining;
  
  // Calculate atmospheric density (simplified exponential model)
  const altitude = Math.max(0, rocketState.position.y - 1.5);
  const atmosphericDensity = AIR_DENSITY_SEA_LEVEL * Math.exp(-altitude / 8500);
  
  // Calculate drag
  const velocity = rocketState.velocity.length();
  const dragForce = 0.5 * atmosphericDensity * velocity * velocity * 
                   ROCKET_CONFIG.aerodynamics.dragCoefficient * 
                   ROCKET_CONFIG.aerodynamics.referenceArea;
  
  // Reset acceleration
  rocketState.acceleration.set(0, 0, 0);
  
  // Apply gravity
  rocketState.acceleration.y -= GRAVITY;
  
  // Apply thrust (considering gimbal angles)
  if (totalThrust > 0) {
    const thrustDirection = new THREE.Vector3(
      Math.sin(THREE.MathUtils.degToRad(rocketState.gimbalZ)),
      1,
      Math.sin(THREE.MathUtils.degToRad(rocketState.gimbalX))
    ).normalize();
    
    // Apply rocket rotation to thrust direction
    thrustDirection.applyEuler(rocketState.rotation);
    
    const thrustAcceleration = thrustDirection.multiplyScalar(totalThrust / rocketState.currentMass);
    rocketState.acceleration.add(thrustAcceleration);
  }
  
  // Apply drag
  if (velocity > 0) {
    const dragDirection = rocketState.velocity.clone().normalize().multiplyScalar(-1);
    const dragAcceleration = dragDirection.multiplyScalar(dragForce / rocketState.currentMass);
    rocketState.acceleration.add(dragAcceleration);
  }
  
  // Update velocity
  rocketState.velocity.add(rocketState.acceleration.clone().multiplyScalar(deltaTime));
  
  // Update position
  rocketState.position.add(rocketState.velocity.clone().multiplyScalar(deltaTime));
  
  // Update rotation based on gimbal and aerodynamics
  const rotationDamping = 0.95;
  rocketState.angularVelocity.multiplyScalar(rotationDamping);
  
  // Add gimbal-induced rotation
  if (rocketState.rcsActive) {
    const rcsForce = 0.001; // Small rotation forces
    if (controls.pitchUp || controls.pitchDown) {
      rocketState.angularVelocity.x += (controls.pitchUp ? -rcsForce : rcsForce);
    }
    if (controls.yawLeft || controls.yawRight) {
      rocketState.angularVelocity.z += (controls.yawLeft ? -rcsForce : rcsForce);
    }
  }
  
  // Apply angular velocity to rotation
  rocketState.rotation.x += rocketState.angularVelocity.x * deltaTime;
  rocketState.rotation.z += rocketState.angularVelocity.z * deltaTime;
  
  // Auto-separate boosters at altitude
  if (!rocketState.boostersSeparated && altitude > ROCKET_CONFIG.sideBooster.separationAltitude) {
    rocketState.boostersSeparated = true;
    rocketState.leftBoosterThrottle = 0;
    rocketState.rightBoosterThrottle = 0;
  }
  
  // Update performance metrics
  rocketState.maxAltitude = Math.max(rocketState.maxAltitude, altitude);
  rocketState.maxVelocity = Math.max(rocketState.maxVelocity, velocity);
  
  // Calculate delta-V (simplified)
  if (totalThrust > 0) {
    const specificImpulse = 280; // Average Isp
    const deltaVIncrement = specificImpulse * GRAVITY * Math.log(1 + (totalFuelFlow * deltaTime) / rocketState.currentMass);
    rocketState.deltaV += deltaVIncrement;
  }
  
  // Calculate apoapsis (simplified orbital mechanics)
  const specificEnergy = (velocity * velocity) / 2 - (GRAVITY * 6371000) / (6371000 + altitude);
  if (specificEnergy < 0) {
    rocketState.apoapsis = -6371000 * specificEnergy / GRAVITY - 6371000;
  } else {
    rocketState.apoapsis = Infinity;
  }
}

// Update visual effects
function updateVisualEffects() {
  // Update engine effects
  const mainEngineIntensity = rocketState.mainEngineThrottle * (rocketState.fuelRemaining > 0 ? 1 : 0);
  const leftBoosterIntensity = (!rocketState.boostersSeparated && rocketState.fuelRemaining > 0) ? rocketState.leftBoosterThrottle : 0;
  const rightBoosterIntensity = (!rocketState.boostersSeparated && rocketState.fuelRemaining > 0) ? rocketState.rightBoosterThrottle : 0;
  
  // Update particle effects positions
  mainEngineEffect.position.copy(rocket.position).add(new THREE.Vector3(0, -1.5, 0));
  leftBoosterEffect.position.copy(rocket.position).add(new THREE.Vector3(-1.5, -1, 0));
  rightBoosterEffect.position.copy(rocket.position).add(new THREE.Vector3(1.5, -1, 0));
  
  mainEngineEffect.update(mainEngineIntensity);
  leftBoosterEffect.update(leftBoosterIntensity);
  rightBoosterEffect.update(rightBoosterIntensity);
  
  // Update background based on altitude
  const altitude = Math.max(0, rocketState.position.y - 1.5);
  if (altitude > 20000) {
    scene.background = new THREE.Color('#000011');
  } else if (altitude > 10000) {
    const t = (altitude - 10000) / 10000;
    scene.background = new THREE.Color().lerpColors(
      new THREE.Color('#4169E1'),
      new THREE.Color('#000011'),
      t
    );
  } else if (altitude > 5000) {
    const t = (altitude - 5000) / 5000;
    scene.background = new THREE.Color().lerpColors(
      new THREE.Color('#87CEEB'),
      new THREE.Color('#4169E1'),
      t
    );
  } else {
    scene.background = new THREE.Color('#87CEEB');
  }
}

// Update camera
function updateCamera() {
  const altitude = Math.max(0, rocketState.position.y - 1.5);
  const distance = Math.max(20, altitude * 0.3 + 20);
  
  camera.position.set(
    rocketState.position.x + distance * 0.8,
    Math.max(rocketState.position.y + distance * 0.3, 8),
    rocketState.position.z + distance
  );
  camera.lookAt(rocketState.position);
}

// Update HUD
function updateHUD() {
  const altitude = Math.max(0, rocketState.position.y - 1.5);
  const velocity = rocketState.velocity.length();
  const acceleration = rocketState.acceleration.length();
  const gForce = acceleration / GRAVITY;
  
  // Telemetry
  document.getElementById('altitude').textContent = `${altitude.toFixed(1)} m`;
  document.getElementById('velocity').textContent = `${velocity.toFixed(1)} m/s`;
  document.getElementById('acceleration').textContent = `${acceleration.toFixed(1)} m/s²`;
  document.getElementById('gforce').textContent = `${gForce.toFixed(2)} G`;
  document.getElementById('mass').textContent = `${rocketState.currentMass.toFixed(0)} kg`;
  document.getElementById('deltav').textContent = `${rocketState.deltaV.toFixed(1)} m/s`;
  document.getElementById('apoapsis').textContent = rocketState.apoapsis === Infinity ? '∞' : `${(rocketState.apoapsis/1000).toFixed(1)} km`;
  
  // Engine status
  document.getElementById('mainThrust').textContent = `${(rocketState.mainEngineThrottle * 100).toFixed(0)}%`;
  document.getElementById('boosterLThrust').textContent = `${(rocketState.leftBoosterThrottle * 100).toFixed(0)}%`;
  document.getElementById('boosterRThrust').textContent = `${(rocketState.rightBoosterThrottle * 100).toFixed(0)}%`;
  document.getElementById('rcsStatus').textContent = rocketState.rcsActive ? 'ON' : 'OFF';
  
  const fuelPercent = (rocketState.fuelRemaining / ROCKET_CONFIG.fuelMass) * 100;
  document.getElementById('fuelPercent').textContent = `${fuelPercent.toFixed(1)}%`;
  document.getElementById('fuelBar').style.width = `${fuelPercent}%`;
  
  const burnTime = rocketState.fuelRemaining > 0 ? 
    (rocketState.fuelRemaining / (ROCKET_CONFIG.mainEngine.fuelFlow * rocketState.mainEngineThrottle + 
    ROCKET_CONFIG.sideBooster.fuelFlow * (rocketState.leftBoosterThrottle + rocketState.rightBoosterThrottle))) : 0;
  document.getElementById('burnTime').textContent = burnTime > 0 ? `${burnTime.toFixed(0)}s` : '∞';
  
  // Engine indicators
  document.getElementById('mainEngineIndicator').className = 
    `engine-indicator ${rocketState.mainEngineThrottle > 0 ? 'engine-active' : ''}`;
  document.getElementById('boosterLIndicator').className = 
    `engine-indicator ${rocketState.leftBoosterThrottle > 0 && !rocketState.boostersSeparated ? 'engine-active' : ''}`;
  document.getElementById('boosterRIndicator').className = 
    `engine-indicator ${rocketState.rightBoosterThrottle > 0 && !rocketState.boostersSeparated ? 'engine-active' : ''}`;
  document.getElementById('rcsIndicator').className = 
    `engine-indicator ${rocketState.rcsActive ? 'engine-active' : ''}`;
  
  // Mission status
  let stage = 'Pre-Launch';
  if (rocketState.launched) {
    if (rocketState.boostersSeparated) {
      stage = 'Second Stage';
    } else {
      stage = 'First Stage';
    }
  }
  if (altitude > 100000) stage = 'Space Flight';
  
  document.getElementById('currentStage').textContent = stage;
  
  const minutes = Math.floor(rocketState.flightTime / 60);
  const seconds = Math.floor(rocketState.flightTime % 60);
  document.getElementById('flightTime').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  document.getElementById('maxAltitude').textContent = `${rocketState.maxAltitude.toFixed(1)} m`;
  document.getElementById('maxVelocity').textContent = `${rocketState.maxVelocity.toFixed(1)} m/s`;
  
  // Mission status color coding
  const statusElement = document.getElementById('missionStatus');
  if (rocketState.fuelRemaining <= 0 && rocketState.launched) {
    statusElement.textContent = 'FUEL DEPLETED';
    statusElement.className = 'warning';
  } else if (altitude < 1 && rocketState.launched && velocity > 5) {
    statusElement.textContent = 'CRASH';
    statusElement.className = 'critical';
  } else if (rocketState.launched) {
    statusElement.textContent = 'FLIGHT ACTIVE';
    statusElement.className = 'normal';
  } else {
    statusElement.textContent = 'READY';
    statusElement.className = 'normal';
  }
}

// Ground collision detection
function checkCollisions() {
  if (rocketState.position.y <= 1.5 && rocketState.velocity.y < -5 && rocketState.launched) {
    // Crash landing
    rocketState.velocity.set(0, 0, 0);
    rocketState.acceleration.set(0, 0, 0);
    rocketState.mainEngineThrottle = 0;
    rocketState.leftBoosterThrottle = 0;
    rocketState.rightBoosterThrottle = 0;
    
    // Add explosion effect here if desired
  } else if (rocketState.position.y <= 1.5) {
    // Soft landing
    rocketState.position.y = 1.5;
    if (rocketState.velocity.y < 0) {
      rocketState.velocity.y = 0;
    }
  }
}

// Main animation loop
let lastTime = 0;
function animate(currentTime) {
  requestAnimationFrame(animate);
  
  const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.02); // Cap at 50fps
  lastTime = currentTime;
  
  if (deltaTime > 0) {
    updatePhysics(deltaTime);
    updateVisualEffects();
    updateCamera();
    updateHUD();
    checkCollisions();
    
    // Update rocket visual position and rotation
    rocket.position.copy(rocketState.position);
    rocket.rotation.copy(rocketState.rotation);
  }
  
  updateDetachedBoosters(deltaTime);
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate(0);