"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRocket = createRocket;
exports.sideBoosterGroup = exports.rocket = void 0;

var THREE = _interopRequireWildcard(require("https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var rocket = new THREE.Group();
exports.rocket = rocket;
var sideBoosterGroup = new THREE.Group();
exports.sideBoosterGroup = sideBoosterGroup;

function createRocket() {
  // Reset posisi dan rotasi roket
  rocket.position.set(0, 1.5, 0);
  rocket.rotation.set(0, 0, 0); // Bersihkan isi sebelumnya

  rocket.clear();
  sideBoosterGroup.clear(); // === MAIN BODY ===

  var mainBody = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 12, 16), new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 30,
    specular: 0x111111
  }));
  mainBody.position.y = 6;
  mainBody.castShadow = true;
  rocket.add(mainBody); // === TANKS ===

  for (var i = 0; i < 3; i++) {
    var tank = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.3, 16), new THREE.MeshPhongMaterial({
      color: 0x333333
    }));
    tank.position.y = 2 + i * 4;
    rocket.add(tank);
  } // === NOSE CONE ===


  var noseCone = new THREE.Mesh(new THREE.ConeGeometry(0.8, 3, 16), new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 50
  }));
  noseCone.position.y = 13.5;
  noseCone.castShadow = true;
  rocket.add(noseCone); // === SIDE BOOSTERS ===

  for (var _i = -1; _i <= 1; _i += 2) {
    var boosterGroup = new THREE.Group();
    boosterGroup.position.set(_i * 1.5, 0, 0); // posisi relatif ke roket utama

    var booster = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 10, 12), new THREE.MeshPhongMaterial({
      color: 0x222222,
      shininess: 20
    }));
    booster.position.set(0, 5, 0);
    booster.castShadow = true;
    boosterGroup.add(booster);
    var boosterNose = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.5, 12), new THREE.MeshPhongMaterial({
      color: 0x222222
    }));
    boosterNose.position.set(0, 10.75, 0);
    boosterNose.castShadow = true;
    boosterGroup.add(boosterNose);
    var nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 8), new THREE.MeshPhongMaterial({
      color: 0x444444,
      shininess: 80
    }));
    nozzle.position.set(0, -0.4, 0);
    nozzle.castShadow = true;
    boosterGroup.add(nozzle);
    sideBoosterGroup.add(boosterGroup);
  } // === MAIN ENGINE NOZZLE ===


  var mainNozzle = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.5, 12), new THREE.MeshPhongMaterial({
    color: 0x444444,
    shininess: 80
  }));
  mainNozzle.position.y = -0.75;
  mainNozzle.castShadow = true;
  rocket.add(mainNozzle); // === ADD BOOSTERS TO ROCKET ===

  rocket.add(sideBoosterGroup);
}