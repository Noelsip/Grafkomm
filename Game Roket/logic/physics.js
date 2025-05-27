// physics.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

export function updatePhysics(deltaTime, rocketState, controls, ROCKET_CONFIG, GRAVITY, AIR_DENSITY_SEA_LEVEL) {
  if (!rocketState.launched) return;
  
  rocketState.flightTime += deltaTime;
  
  if (controls.maxThrottle) {
    rocketState.mainEngineThrottle = 1.0;
  }
  if (controls.engineCutoff) {
    rocketState.mainEngineThrottle = 0;
    rocketState.leftBoosterThrottle = 0;
    rocketState.rightBoosterThrottle = 0;
  }
  
  const gimbalRate = 30 * deltaTime;
  if (controls.pitchUp) rocketState.gimbalX = Math.max(-ROCKET_CONFIG.mainEngine.gimbalRange, rocketState.gimbalX - gimbalRate);
  if (controls.pitchDown) rocketState.gimbalX = Math.min(ROCKET_CONFIG.mainEngine.gimbalRange, rocketState.gimbalX + gimbalRate);
  if (controls.yawLeft) rocketState.gimbalZ = Math.max(-ROCKET_CONFIG.mainEngine.gimbalRange, rocketState.gimbalZ - gimbalRate);
  if (controls.yawRight) rocketState.gimbalZ = Math.min(ROCKET_CONFIG.mainEngine.gimbalRange, rocketState.gimbalZ + gimbalRate);
  
  let totalThrust = 0;
  let totalFuelFlow = 0;
  
  if (rocketState.mainEngineThrottle > 0 && rocketState.fuelRemaining > 0) {
    totalThrust += ROCKET_CONFIG.mainEngine.thrust * rocketState.mainEngineThrottle;
    totalFuelFlow += ROCKET_CONFIG.mainEngine.fuelFlow * rocketState.mainEngineThrottle;
  }
  
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
  
  if (rocketState.rcsActive && rocketState.fuelRemaining > 0) {
    totalFuelFlow += ROCKET_CONFIG.rcs.fuelFlow;
  }
  
  rocketState.fuelRemaining = Math.max(0, rocketState.fuelRemaining - totalFuelFlow * deltaTime);
  rocketState.currentMass = ROCKET_CONFIG.dryMass + rocketState.fuelRemaining;
  
  const altitude = Math.max(0, rocketState.position.y - 1.5);
  const atmosphericDensity = AIR_DENSITY_SEA_LEVEL * Math.exp(-altitude / 8500);
  
  const velocity = rocketState.velocity.length();
  const dragForce = 0.5 * atmosphericDensity * velocity * velocity * ROCKET_CONFIG.aerodynamics.dragCoefficient * ROCKET_CONFIG.aerodynamics.referenceArea;
  
  rocketState.acceleration.set(0, 0, 0);
  
  rocketState.acceleration.y -= GRAVITY;
  
  if (totalThrust > 0) {
    const thrustDirection = new THREE.Vector3(
      Math.sin(THREE.MathUtils.degToRad(rocketState.gimbalZ)),
      1,
      Math.sin(THREE.MathUtils.degToRad(rocketState.gimbalX))
    ).normalize();
    
    thrustDirection.applyEuler(rocketState.rotation);
    
    const thrustAcceleration = thrustDirection.multiplyScalar(totalThrust / rocketState.currentMass);
    rocketState.acceleration.add(thrustAcceleration);
  }
  
  if (velocity > 0) {
    const dragDirection = rocketState.velocity.clone().normalize().multiplyScalar(-1);
    const dragAcceleration = dragDirection.multiplyScalar(dragForce / rocketState.currentMass);
    rocketState.acceleration.add(dragAcceleration);
  }
  
  rocketState.velocity.add(rocketState.acceleration.clone().multiplyScalar(deltaTime));
  
  rocketState.position.add(rocketState.velocity.clone().multiplyScalar(deltaTime));
  
  const rotationDamping = 0.95;
  rocketState.angularVelocity.multiplyScalar(rotationDamping);
  
  if (rocketState.rcsActive) {
    const rcsForce = 0.001;
    if (controls.pitchUp || controls.pitchDown) {
      rocketState.angularVelocity.x += (controls.pitchUp ? -rcsForce : rcsForce);
    }
    if (controls.yawLeft || controls.yawRight) {
      rocketState.angularVelocity.z += (controls.yawLeft ? -rcsForce : rcsForce);
    }
  }
  
  rocketState.rotation.x += rocketState.angularVelocity.x * deltaTime;
  rocketState.rotation.z += rocketState.angularVelocity.z * deltaTime;
  
  if (!rocketState.boostersSeparated && altitude > ROCKET_CONFIG.sideBooster.separationAltitude) {
    rocketState.boostersSeparated = true;
    rocketState.leftBoosterThrottle = 0;
    rocketState.rightBoosterThrottle = 0;
  }
  
  rocketState.maxAltitude = Math.max(rocketState.maxAltitude, altitude);
  rocketState.maxVelocity = Math.max(rocketState.maxVelocity, velocity);
  
  if (totalThrust > 0) {
    const specificImpulse = 280;
    const deltaVIncrement = specificImpulse * GRAVITY * Math.log(1 + (totalFuelFlow * deltaTime) / rocketState.currentMass);
    rocketState.deltaV += deltaVIncrement;
  }
  
  const specificEnergy = (velocity * velocity) / 2 - (GRAVITY * 6371000) / (6371000 + altitude);
  if (specificEnergy < 0) {
    rocketState.apoapsis = -6371000 * specificEnergy / GRAVITY - 6371000;
  } else {
    rocketState.apoapsis = Infinity;
  }
}