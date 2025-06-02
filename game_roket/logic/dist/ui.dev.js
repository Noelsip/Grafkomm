"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupUIListeners = setupUIListeners;

var THREE = _interopRequireWildcard(require("https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"));

var _constants = require("./constants.js");

var _sceneSetup = require("./sceneSetup.js");

var _rocket = require("./rocket.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// ui.js
function setupUIListeners(rocketState, sideBoosterGroup, mainEngineEffect, leftBoosterEffect, rightBoosterEffect) {
  document.getElementById('launchBtn').addEventListener('click', function () {
    if (!rocketState.launched) {
      rocketState.launched = true;
      rocketState.mainEngineThrottle = 0.8;
      rocketState.leftBoosterThrottle = 1.0;
      rocketState.rightBoosterThrottle = 1.0;
      document.getElementById('engineIgnition').play()["catch"](function () {});
    }
  });
  document.getElementById('throttleUpBtn').addEventListener('click', function () {
    rocketState.mainEngineThrottle = Math.min(1.0, rocketState.mainEngineThrottle + 0.1);
  });
  document.getElementById('throttleDownBtn').addEventListener('click', function () {
    rocketState.mainEngineThrottle = Math.max(0, rocketState.mainEngineThrottle - 0.1);
  });
  document.getElementById('separateBoostersBtn').addEventListener('click', function () {
    if (rocketState.launched && !rocketState.boostersSeparated) {
      rocketState.boostersSeparated = true;
      rocketState.leftBoosterThrottle = 0;
      rocketState.rightBoosterThrottle = 0;
      sideBoosterGroup.children.forEach(function (boosterGroup, index) {
        var worldPosition = new THREE.Vector3();
        boosterGroup.getWorldPosition(worldPosition); // Remove from rocket and re-add to scene

        _rocket.rocket.remove(boosterGroup);

        _sceneSetup.scene.add(boosterGroup);

        boosterGroup.position.copy(worldPosition); // Assign some movement to make them visually separate

        boosterGroup.userData.velocity = new THREE.Vector3((index === 0 ? -1 : 1) * 2, // side velocity
        rocketState.velocity.y - 2, // falling slightly down
        0);
        boosterGroup.userData.angularVelocity = new THREE.Vector3(0, 0, (index === 0 ? -1 : 1) * 0.01);
        boosterGroup.userData.life = 3;
      });
      sideBoosterGroup.clear(); // Clear from main rocket group
    }
  });
  document.getElementById('rcsToggleBtn').addEventListener('click', function () {
    rocketState.rcsActive = !rocketState.rcsActive;
  });
  document.getElementById('emergencyShutdownBtn').addEventListener('click', function () {
    rocketState.mainEngineThrottle = 0;
    rocketState.leftBoosterThrottle = 0;
    rocketState.rightBoosterThrottle = 0;
  }); // In ui.js, update the resetBtn event listener

  document.getElementById('resetBtn').addEventListener('click', function () {
    // Remove any separated boosters from scene
    if (rocketState.separatedBoosters) {
      sideBoosterGroup.children.forEach(function (booster) {
        _sceneSetup.scene.remove(booster);
      });
    } // Remove manually detached boosters (those with userData.velocity)


    _sceneSetup.scene.traverse(function (obj) {
      if (obj.userData.velocity) {
        _sceneSetup.scene.remove(obj);
      }
    }); // Reset rocket state


    Object.assign(rocketState, {
      position: new THREE.Vector3(0, 1.5, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      acceleration: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      angularVelocity: new THREE.Vector3(0, 0, 0),
      currentMass: _constants.ROCKET_CONFIG.dryMass + _constants.ROCKET_CONFIG.fuelMass,
      fuelRemaining: _constants.ROCKET_CONFIG.fuelMass,
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
    }); // Reset rocket visual position and rotation

    _rocket.rocket.position.copy(rocketState.position);

    _rocket.rocket.rotation.copy(rocketState.rotation); // Recreate boosters


    sideBoosterGroup.clear();

    for (var i = -1; i <= 1; i += 2) {
      var boosterGroup = new THREE.Group();
      boosterGroup.position.set(i * 1.5, 0, 0);
      var booster = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 10, 12), new THREE.MeshPhongMaterial({
        color: 0x222222,
        shininess: 20
      }));
      booster.position.set(0, 5, 0);
      boosterGroup.add(booster);
      var boosterNose = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.5, 12), new THREE.MeshPhongMaterial({
        color: 0x222222
      }));
      boosterNose.position.set(0, 10.75, 0);
      boosterGroup.add(boosterNose);
      var nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 8), new THREE.MeshPhongMaterial({
        color: 0x444444,
        shininess: 80
      }));
      nozzle.position.set(0, -0.4, 0);
      boosterGroup.add(nozzle);
      sideBoosterGroup.add(boosterGroup);
    } // Reset camera


    _sceneSetup.camera.position.set(15, 8, 20);

    _sceneSetup.camera.lookAt(0, 0, 0);

    _sceneSetup.scene.background = new THREE.Color('#87CEEB'); // Clear engine effects

    mainEngineEffect.clear();
    leftBoosterEffect.clear();
    rightBoosterEffect.clear();
  });
}