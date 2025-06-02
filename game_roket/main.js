// main.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { ROCKET_CONFIG, GRAVITY, AIR_DENSITY_SEA_LEVEL } from './logic/constants.js';
import { setupScene, camera, renderer, scene, setCameraTarget } from './logic/sceneSetup.js';
import { createGround, createLaunchPlatform, createLaunchTower } from './logic/environment.js';
import { createRocket, rocket, sideBoosterGroup } from './logic/rocket.js';
import { EngineEffect } from './logic/engineEffects.js';
import { rocketState } from './logic/rocketState.js';
import { setupInputListeners, controls } from './logic/input.js';
import { setupUIListeners } from './logic/ui.js';
import { updatePhysics } from './logic/physics.js';
import { updateHUD } from './logic/hud.js';

// Camera control mode
let cameraMode = 'free'; // 'free' or 'follow'
let followCameraEnabled = false;

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

// Add camera toggle functionality
window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyC') {
    cameraMode = cameraMode === 'free' ? 'follow' : 'free';
    console.log(`Camera mode: ${cameraMode}`);
    
    // Show notification
    const notification = document.createElement('div');
    notification.textContent = `Camera Mode: ${cameraMode.toUpperCase()}`;
    notification.style.cssText = `
      position: fixed;
      top: 50px;
      right: 20px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      font-family: Arial, sans-serif;
      z-index: 1000;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
  }
});

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

// Update camera with mode switching
function updateCamera() {
  if (cameraMode === 'follow') {
    // Auto-follow camera mode
    const altitude = Math.max(0, rocketState.position.y - 1.5);
    const distance = Math.max(20, altitude * 0.3 + 20);
    
    camera.position.set(
      rocketState.position.x + distance * 0.8,
      Math.max(rocketState.position.y + distance * 0.3, 8),
      rocketState.position.z + distance
    );
    camera.lookAt(rocketState.position);
  } else {
    // Free camera mode - update target to follow rocket for smooth transitions
    if (setCameraTarget) {
      setCameraTarget(rocketState.position.x, rocketState.position.y, rocketState.position.z);
    }
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
// In main.js, update the animate function
function animate(currentTime) {
  requestAnimationFrame(animate);
  
  const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.02);
  lastTime = currentTime;
  
  if (deltaTime > 0) {
    if (rocketState.launched) {
      updatePhysics(deltaTime, rocketState, controls, ROCKET_CONFIG, GRAVITY, AIR_DENSITY_SEA_LEVEL);
      
      // Update separated boosters if they exist
      if (rocketState.separatedBoosters) {
        rocketState.separatedBoosters.forEach((boosterState, index) => {
          // Apply physics to separated boosters
          boosterState.velocity.y -= GRAVITY * deltaTime;
          boosterState.velocity.multiplyScalar(0.98); // Simple drag
          boosterState.position.add(boosterState.velocity.clone().multiplyScalar(deltaTime));
          
          // Update rotation
          boosterState.rotation.x += boosterState.angularVelocity.x * deltaTime;
          boosterState.rotation.y += boosterState.angularVelocity.y * deltaTime;
          boosterState.rotation.z += boosterState.angularVelocity.z * deltaTime;
          
          // Update visual position
          if (sideBoosterGroup.children[index]) {
            sideBoosterGroup.children[index].position.copy(boosterState.position);
            sideBoosterGroup.children[index].rotation.copy(boosterState.rotation);
          }
        });
      }
    }
  
    updateVisualEffects();
    updateCamera();
    updateHUD(rocketState, ROCKET_CONFIG, GRAVITY);
    checkCollisions();

    // Animate manually detached boosters
  scene.traverse(obj => {
    if (obj.userData.velocity) {
      // Apply gravity
      obj.userData.velocity.y -= GRAVITY * deltaTime;

      // Optional drag
      obj.userData.velocity.multiplyScalar(0.99);

      // Apply movement
      obj.position.add(obj.userData.velocity.clone().multiplyScalar(deltaTime));

      // Apply rotation
      obj.rotation.x += obj.userData.angularVelocity?.x ?? 0;
      obj.rotation.y += obj.userData.angularVelocity?.y ?? 0;
      obj.rotation.z += obj.userData.angularVelocity?.z ?? 0;
    }
  });

    // Update rocket visual position and rotation
    rocket.position.copy(rocketState.position);
    rocket.rotation.copy(rocketState.rotation);
  }
  
  renderer.render(scene, camera);
}

// Add instructions to HUD
const instructions = document.createElement('div');
instructions.innerHTML = `
  <div style="position: fixed; top: 50%; left: 10px; transform: translateY(-50%); background: rgba(0,0,0,0.7); color: white; padding: 15px; border-radius: 8px; font-family: Arial, sans-serif; font-size: 14px; z-index: 1000;">
    <h4 style="margin: 0 0 10px 0; color: #4CAF50;">🎮 Controls</h4>
    <div style="margin: 5px 0;"><strong>Camera:</strong></div>
    <div style="margin: 5px 0;">• Left Drag: Rotate</div>
    <div style="margin: 5px 0;">• Right Drag: Pan</div>
    <div style="margin: 5px 0;">• Scroll: Zoom</div>
    <div style="margin: 5px 0;">• <strong>C Key:</strong> Toggle Camera Mode</div>
  </div>

`;
document.body.appendChild(instructions);

// Start animation
animate(0);