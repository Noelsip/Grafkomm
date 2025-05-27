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

  document.getElementById('rcsToggleBtn').addEventListener('click', () => {
    rocketState.rcsActive = !rocketState.rcsActive;
  });

  document.getElementById('emergencyShutdownBtn').addEventListener('click', () => {
    rocketState.mainEngineThrottle = 0;
    rocketState.leftBoosterThrottle = 0;
    rocketState.rightBoosterThrottle = 0;
  });

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
}