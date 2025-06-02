"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ROCKET_CONFIG = exports.SCALE_FACTOR = exports.AIR_DENSITY_SEA_LEVEL = exports.GRAVITY = void 0;
// constants.js
var GRAVITY = 9.81;
exports.GRAVITY = GRAVITY;
var AIR_DENSITY_SEA_LEVEL = 1.225;
exports.AIR_DENSITY_SEA_LEVEL = AIR_DENSITY_SEA_LEVEL;
var SCALE_FACTOR = 0.1; // Visual scale factor

exports.SCALE_FACTOR = SCALE_FACTOR;
var ROCKET_CONFIG = {
  dryMass: 2000,
  // kg
  fuelMass: 18000,
  // kg
  mainEngine: {
    thrust: 180000,
    // N (18 tons force)
    specificImpulse: 280,
    // seconds
    fuelFlow: 65,
    // kg/s
    gimbalRange: 15 // degrees

  },
  sideBooster: {
    thrust: 120000,
    // N each
    specificImpulse: 260,
    fuelFlow: 47,
    // kg/s each
    separationAltitude: 1500 // meters

  },
  rcs: {
    thrust: 400,
    // N total
    fuelFlow: 0.2 // kg/s

  },
  aerodynamics: {
    dragCoefficient: 0.3,
    referenceArea: 3.14 // m²

  }
};
exports.ROCKET_CONFIG = ROCKET_CONFIG;