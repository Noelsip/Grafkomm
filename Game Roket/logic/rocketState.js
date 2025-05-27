// rocketState.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { ROCKET_CONFIG } from './constants.js';

export const rocketState = {
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
  
  gimbalX: 0, // pitch
  gimbalZ: 0, // yaw
  
  launched: false,
  boostersSeparated: false,
  flightTime: 0,
  maxAltitude: 0,
  maxVelocity: 0,
  
  deltaV: 0,
  apoapsis: 0
};