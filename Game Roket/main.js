// main.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { ROCKET_CONFIG, GRAVITY, AIR_DENSITY_SEA_LEVEL } from './logic/constants.js';
import { setupScene, camera, renderer, scene } from './logic/sceneSetup.js';
import { createGround, createLaunchPlatform, createLaunchTower } from './logic/environment.js';
import { createRocket, rocket, sideBoosterGroup } from './logic/rocket.js';
import { EngineEffect } from './logic/engineEffects.js';
import { rocketState } from './logic/rocketState.js';
import { setupInputListeners, controls } from './logic/input.js';
import { setupUIListeners } from './logic/ui.js';
import { updatePhysics } from './logic/physics.js';
import { updateHUD } from './logic/hud.js';

// Initialize scene, camera, and renderer
setupScene();

// Create environment elements
createGround();
createLaunchPlatform();
createLaunchTower();

// Create rocket
createRocket();
scene.add(rocket);

// Engine Effects
const mainEngineEffect = new EngineEffect(new THREE.Vector3(0, -1.5, 0), 1.5);
const leftBoosterEffect = new EngineEffect(new THREE.Vector3(-1.5, -1, 0), 1);
const rightBoosterEffect = new EngineEffect(new THREE.Vector3(1.5, -1, 0), 1);

// Input handling
setupInputListeners();

// UI Controls
setupUIListeners(rocketState, sideBoosterGroup, mainEngineEffect, leftBoosterEffect, rightBoosterEffect);

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
    updatePhysics(deltaTime, rocketState, controls, ROCKET_CONFIG, GRAVITY, AIR_DENSITY_SEA_LEVEL);
    updateVisualEffects();
    updateCamera();
    updateHUD(rocketState, ROCKET_CONFIG, GRAVITY);
    checkCollisions();
    
    // Update rocket visual position and rotation
    rocket.position.copy(rocketState.position);
    rocket.rotation.copy(rocketState.rotation);
  }
  
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