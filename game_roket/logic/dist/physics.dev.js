"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePhysics = updatePhysics;

var THREE = _interopRequireWildcard(require("https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"));

var _rocket = require("./rocket.js");

var _sceneSetup = require("./sceneSetup.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

//physics.js
function updatePhysics(deltaTime, rocketState, controls, ROCKET_CONFIG, GRAVITY, AIR_DENSITY_SEA_LEVEL) {
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

  var gimbalRate = 30 * deltaTime;
  if (controls.pitchUp) rocketState.gimbalX = Math.max(-ROCKET_CONFIG.mainEngine.gimbalRange, rocketState.gimbalX - gimbalRate);
  if (controls.pitchDown) rocketState.gimbalX = Math.min(ROCKET_CONFIG.mainEngine.gimbalRange, rocketState.gimbalX + gimbalRate);
  if (controls.yawLeft) rocketState.gimbalZ = Math.max(-ROCKET_CONFIG.mainEngine.gimbalRange, rocketState.gimbalZ - gimbalRate);
  if (controls.yawRight) rocketState.gimbalZ = Math.min(ROCKET_CONFIG.mainEngine.gimbalRange, rocketState.gimbalZ + gimbalRate);
  var totalThrust = 0;
  var totalFuelFlow = 0;

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
  var altitude = Math.max(0, rocketState.position.y - 1.5);
  var atmosphericDensity = AIR_DENSITY_SEA_LEVEL * Math.exp(-altitude / 8500);
  var velocity = rocketState.velocity.length();
  var dragForce = 0.5 * atmosphericDensity * velocity * velocity * ROCKET_CONFIG.aerodynamics.dragCoefficient * ROCKET_CONFIG.aerodynamics.referenceArea;
  rocketState.acceleration.set(0, 0, 0);
  rocketState.acceleration.y -= GRAVITY;

  if (totalThrust > 0) {
    var thrustDirection = new THREE.Vector3(Math.sin(THREE.MathUtils.degToRad(rocketState.gimbalZ)), 1, Math.sin(THREE.MathUtils.degToRad(rocketState.gimbalX))).normalize();
    thrustDirection.applyEuler(rocketState.rotation);
    var thrustAcceleration = thrustDirection.multiplyScalar(totalThrust / rocketState.currentMass);
    rocketState.acceleration.add(thrustAcceleration);
  }

  if (velocity > 0) {
    var dragDirection = rocketState.velocity.clone().normalize().multiplyScalar(-1);
    var dragAcceleration = dragDirection.multiplyScalar(dragForce / rocketState.currentMass);
    rocketState.acceleration.add(dragAcceleration);
  }

  rocketState.velocity.add(rocketState.acceleration.clone().multiplyScalar(deltaTime));
  rocketState.position.add(rocketState.velocity.clone().multiplyScalar(deltaTime));
  var rotationDamping = 0.95;
  rocketState.angularVelocity.multiplyScalar(rotationDamping);

  if (rocketState.rcsActive) {
    var rcsForce = 0.001;

    if (controls.pitchUp || controls.pitchDown) {
      rocketState.angularVelocity.x += controls.pitchUp ? -rcsForce : rcsForce;
    }

    if (controls.yawLeft || controls.yawRight) {
      rocketState.angularVelocity.z += controls.yawLeft ? -rcsForce : rcsForce;
    }
  }

  rocketState.rotation.x += rocketState.angularVelocity.x * deltaTime;
  rocketState.rotation.z += rocketState.angularVelocity.z * deltaTime;
  rocketState.maxAltitude = Math.max(rocketState.maxAltitude, altitude);
  rocketState.maxVelocity = Math.max(rocketState.maxVelocity, velocity);

  if (totalThrust > 0) {
    var specificImpulse = 280;
    var deltaVIncrement = specificImpulse * GRAVITY * Math.log(1 + totalFuelFlow * deltaTime / rocketState.currentMass);
    rocketState.deltaV += deltaVIncrement;
  }

  var specificEnergy = velocity * velocity / 2 - GRAVITY * 6371000 / (6371000 + altitude);

  if (specificEnergy < 0) {
    rocketState.apoapsis = -6371000 * specificEnergy / GRAVITY - 6371000;
  } else {
    rocketState.apoapsis = Infinity;
  } // === AUTO-SEPARATION LOGIC ===


  if (!rocketState.boostersSeparated && altitude > ROCKET_CONFIG.sideBooster.separationAltitude) {
    rocketState.boostersSeparated = true;
    rocketState.leftBoosterThrottle = 0;
    rocketState.rightBoosterThrottle = 0;

    _rocket.sideBoosterGroup.children.forEach(function (boosterGroup, index) {
      var worldPosition = new THREE.Vector3();
      boosterGroup.getWorldPosition(worldPosition);

      _rocket.rocket.remove(boosterGroup);

      _sceneSetup.scene.add(boosterGroup);

      boosterGroup.position.copy(worldPosition);
      boosterGroup.userData.velocity = new THREE.Vector3((index === 0 ? -1 : 1) * 2, rocketState.velocity.y - 2, 0);
      boosterGroup.userData.angularVelocity = new THREE.Vector3(0, 0, (index === 0 ? -1 : 1) * 0.01);
      boosterGroup.userData.life = 3;
    });

    _rocket.sideBoosterGroup.clear();
  }
}