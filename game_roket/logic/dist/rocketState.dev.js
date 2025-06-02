"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rocketState = void 0;

var THREE = _interopRequireWildcard(require("https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"));

var _constants = require("./constants.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// rocketState.js
var rocketState = {
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
  // pitch
  gimbalZ: 0,
  // yaw
  launched: false,
  boostersSeparated: false,
  flightTime: 0,
  maxAltitude: 0,
  maxVelocity: 0,
  separatedBoosters: null,
  deltaV: 0,
  apoapsis: 0
};
exports.rocketState = rocketState;