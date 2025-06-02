// ui.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { ROCKET_CONFIG } from './constants.js';
import { camera, scene } from './sceneSetup.js';
import { rocket } from './rocket.js';

export function setupUIListeners(rocketState, sideBoosterGroup, mainEngineEffect, leftBoosterEffect, rightBoosterEffect) {
  document.getElementById('launchBtn').addEventListener('click', () => {
    if (!rocketState.launched) {
      rocketState.launched = true;
      rocketState.mainEngineThrottle = 0.8;
      rocketState.leftBoosterThrottle = 1.0;
      rocketState.rightBoosterThrottle = 1.0;
      
      document.getElementById('engineIgnition').play().catch(() => {});
    }
  });

  document.getElementById('throttleUpBtn').addEventListener('click', () => {
    rocketState.mainEngineThrottle = Math.min(1.0, rocketState.mainEngineThrottle + 0.1);
  });

  document.getElementById('throttleDownBtn').addEventListener('click', () => {
    rocketState.mainEngineThrottle = Math.max(0, rocketState.mainEngineThrottle - 0.1);
  });

<<<<<<< HEAD
document.getElementById('separateBoostersBtn').addEventListener('click', () => {
  if (rocketState.launched && !rocketState.boostersSeparated) {
    rocketState.boostersSeparated = true;
    rocketState.leftBoosterThrottle = 0;
    rocketState.rightBoosterThrottle = 0;

    sideBoosterGroup.children.forEach((boosterGroup, index) => {
      const worldPosition = new THREE.Vector3();
      boosterGroup.getWorldPosition(worldPosition);

      // Remove from rocket and re-add to scene
      rocket.remove(boosterGroup);
      scene.add(boosterGroup);
      boosterGroup.position.copy(worldPosition);

      // Assign some movement to make them visually separate
      boosterGroup.userData.velocity = new THREE.Vector3(
        (index === 0 ? -1 : 1) * 2, // side velocity
        rocketState.velocity.y * 0.5 - 2, // falling slightly down
        0
      );
      boosterGroup.userData.angularVelocity = new THREE.Vector3(
        0,
        0,
        (index === 0 ? -1 : 1) * 0.01
      );
    });

    sideBoosterGroup.clear(); // Clear from main rocket group
  }
});
=======
  document.getElementById('separateBoostersBtn').addEventListener('click', () => {
    if (rocketState.launched && !rocketState.boostersSeparated) {
      rocketState.boostersSeparated = true;
      rocketState.leftBoosterThrottle = 0;
      rocketState.rightBoosterThrottle = 0;
      
      sideBoosterGroup.children.forEach((booster, index) => {
        const separationVelocity = new THREE.Vector3(
          (index === 0 ? -1 : 1) * 2,
          -1,
          0
        );
        // Add separation animation here
      });
    }
  });
>>>>>>> 56691899fc08db7e1385eaf0a9ac72267ec5a8a6

  document.getElementById('rcsToggleBtn').addEventListener('click', () => {
    rocketState.rcsActive = !rocketState.rcsActive;
  });

  document.getElementById('emergencyShutdownBtn').addEventListener('click', () => {
    rocketState.mainEngineThrottle = 0;
    rocketState.leftBoosterThrottle = 0;
    rocketState.rightBoosterThrottle = 0;
  });

<<<<<<< HEAD
// In ui.js, update the resetBtn event listener
document.getElementById('resetBtn').addEventListener('click', () => {
  // Remove any separated boosters from scene
  if (rocketState.separatedBoosters) {
    sideBoosterGroup.children.forEach(booster => {
      scene.remove(booster);
    });
  }

  // Remove manually detached boosters (those with userData.velocity)
scene.traverse(obj => {
  if (obj.userData.velocity) {
    scene.remove(obj);
  }
});

  // Reset rocket state
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
    apoapsis: 0,
    separatedBoosters: null
  });

  // Reset rocket visual position and rotation
  rocket.position.copy(rocketState.position);
  rocket.rotation.copy(rocketState.rotation);

  // Recreate boosters
  sideBoosterGroup.clear();
  for (let i = -1; i <= 1; i += 2) {
    const boosterGroup = new THREE.Group();
    boosterGroup.position.set(i * 1.5, 0, 0);
    
    const booster = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 10, 12),
      new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 20 })
    );
    booster.position.set(0, 5, 0);
    boosterGroup.add(booster);
    
    const boosterNose = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 1.5, 12),
      new THREE.MeshPhongMaterial({ color: 0x222222 })
    );
    boosterNose.position.set(0, 10.75, 0);
    boosterGroup.add(boosterNose);
    
    const nozzle = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.8, 8),
      new THREE.MeshPhongMaterial({ color: 0x444444, shininess: 80 })
    );
    nozzle.position.set(0, -0.4, 0);
    boosterGroup.add(nozzle);
    
    sideBoosterGroup.add(boosterGroup);
  }

  // Reset camera
  camera.position.set(15, 8, 20);
  camera.lookAt(0, 0, 0);
  scene.background = new THREE.Color('#87CEEB');
  
  // Clear engine effects
  mainEngineEffect.clear();
  leftBoosterEffect.clear();
  rightBoosterEffect.clear();
});
=======
  document.getElementById('resetBtn').addEventListener('click', () => {
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
    
    mainEngineEffect.clear();
    leftBoosterEffect.clear();
    rightBoosterEffect.clear();
  });
>>>>>>> 56691899fc08db7e1385eaf0a9ac72267ec5a8a6
}