// constants.js
export const GRAVITY = 9.81;
export const AIR_DENSITY_SEA_LEVEL = 1.225;
export const SCALE_FACTOR = 0.1; // Visual scale factor

export const ROCKET_CONFIG = {
  dryMass: 2000, // kg
  fuelMass: 18000, // kg
  mainEngine: {
    thrust: 180000, // N (18 tons force)
    specificImpulse: 280, // seconds
    fuelFlow: 65, // kg/s
    gimbalRange: 15 // degrees
  },
  sideBooster: {
    thrust: 120000, // N each
    specificImpulse: 260,
    fuelFlow: 47, // kg/s each
<<<<<<< HEAD
    separationAltitude: 1500 // meters
=======
    separationAltitude: 250 // meters
>>>>>>> 56691899fc08db7e1385eaf0a9ac72267ec5a8a6
  },
  rcs: {
    thrust: 400, // N total
    fuelFlow: 0.2 // kg/s
  },
  aerodynamics: {
    dragCoefficient: 0.3,
    referenceArea: 3.14 // m²
  }
};