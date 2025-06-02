"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGround = createGround;
exports.createLaunchPlatform = createLaunchPlatform;
exports.createLaunchTower = createLaunchTower;
exports.createRocketStationEnvironment = createRocketStationEnvironment;

var THREE = _interopRequireWildcard(require("https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"));

var _sceneSetup = require("./sceneSetup.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function createGround() {
  var groundGeometry = new THREE.PlaneGeometry(500, 500, 50, 50);
  var groundMaterial = new THREE.MeshLambertMaterial({
    color: 0x4a7c59,
    transparent: true,
    opacity: 0.9
  });
  var groundVertices = groundGeometry.attributes.position.array;

  for (var i = 0; i < groundVertices.length; i += 3) {
    groundVertices[i + 2] = Math.random() * 0.5;
  }

  groundGeometry.attributes.position.needsUpdate = true;
  groundGeometry.computeVertexNormals();
  var ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  _sceneSetup.scene.add(ground);
}

function createLaunchPlatform() {
  // --- Platform Utama ---
  var platformBase = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 20), new THREE.MeshStandardMaterial({
    color: 0x555555,
    metalness: 0.3,
    roughness: 0.7
  }));
  platformBase.position.y = 0.5;
  platformBase.receiveShadow = true;
  platformBase.castShadow = true;

  _sceneSetup.scene.add(platformBase); // --- Flame Trench ---


  var trenchGeometry = new THREE.BoxGeometry(8, 2, 3);
  var trench = new THREE.Mesh(trenchGeometry, new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.1,
    roughness: 0.8
  }));
  trench.position.set(0, -0.5, 0);
  trench.receiveShadow = true;

  _sceneSetup.scene.add(trench); // --- Grid Besi Atas Trench ---


  var gridMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.5,
    roughness: 0.3
  });

  for (var i = -3.5; i <= 3.5; i += 1) {
    var bar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 3), gridMaterial);
    bar.position.set(i, 1.01, 0);
    bar.castShadow = true;
    bar.receiveShadow = true;

    _sceneSetup.scene.add(bar);
  } // --- Penyangga Besi Samping ---


  var supportMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.4,
    roughness: 0.5
  });
  var columnGeometry = new THREE.BoxGeometry(0.5, 5, 0.5);

  for (var x = -8; x <= 8; x += 8) {
    for (var z = -8; z <= 8; z += 8) {
      var column = new THREE.Mesh(columnGeometry, supportMaterial);
      column.position.set(x, 2.5, z);
      column.castShadow = true;
      column.receiveShadow = true;

      _sceneSetup.scene.add(column);
    }
  } // --- Tangga Samping (Opsional Tambahan Dekoratif) ---


  var stairMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.3,
    roughness: 0.6
  });

  for (var _i = 0; _i < 5; _i++) {
    var step = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 0.8), stairMaterial);
    step.position.set(-10, 0.2 + _i * 0.2, -6);

    _sceneSetup.scene.add(step);
  }
}

function createLaunchTower() {
  var towerGroup = new THREE.Group();
  var towerMaterial = new THREE.MeshLambertMaterial({
    color: 0x888888
  });
  var braceMaterial = new THREE.MeshLambertMaterial({
    color: 0x666666
  });
  var platformMaterial = new THREE.MeshLambertMaterial({
    color: 0x444444
  }); // Main support structure - 4 tall pillars

  for (var i = 0; i < 4; i++) {
    var pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 20, 8), towerMaterial);
    var angle = i * Math.PI / 2;
    pillar.position.set(Math.cos(angle) * 4, 6, Math.sin(angle) * 4);
    pillar.castShadow = true;
    towerGroup.add(pillar);
  } // Horizontal cross braces between pillars


  for (var level = 0; level < 4; level++) {
    var height = level * 4 + 2;

    for (var _i2 = 0; _i2 < 4; _i2++) {
      var angle1 = _i2 * Math.PI / 2;
      var angle2 = (_i2 + 1) * Math.PI / 2;
      var brace = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 5.6), braceMaterial);
      var x1 = Math.cos(angle1) * 4;
      var z1 = Math.sin(angle1) * 4;
      var x2 = Math.cos(angle2) * 4;
      var z2 = Math.sin(angle2) * 4;
      brace.position.set((x1 + x2) / 2, height, (z1 + z2) / 2);
      brace.rotation.y = angle1 + Math.PI / 4;
      brace.rotation.z = Math.PI / 2;
      brace.castShadow = true;
      towerGroup.add(brace);
    }
  } // Diagonal cross braces for structural integrity


  for (var _level = 0; _level < 3; _level++) {
    for (var _i3 = 0; _i3 < 4; _i3++) {
      var _angle = _i3 * Math.PI / 2;

      var nextAngle = (_i3 + 1) * Math.PI / 2; // X-pattern braces

      var brace1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 7), braceMaterial);
      var brace2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 7), braceMaterial);
      var baseHeight = _level * 4 + 2;

      var _x = Math.cos(_angle) * 4;

      var _z = Math.sin(_angle) * 4;

      var _x2 = Math.cos(nextAngle) * 4;

      var _z2 = Math.sin(nextAngle) * 4;

      brace1.position.set((_x + _x2) / 2, baseHeight + 2.5, (_z + _z2) / 2);
      brace1.rotation.y = _angle + Math.PI / 4;
      brace1.rotation.z = Math.PI / 6;
      brace2.position.set((_x + _x2) / 2, baseHeight + 2.5, (_z + _z2) / 2);
      brace2.rotation.y = _angle + Math.PI / 4;
      brace2.rotation.z = -Math.PI / 6;
      brace1.castShadow = true;
      brace2.castShadow = true;
      towerGroup.add(brace1);
      towerGroup.add(brace2);
    }
  } // Service platforms at different levels


  var platformLevels = [6, 12, 16];
  platformLevels.forEach(function (height) {
    var platform = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 0.3, 16), platformMaterial);
    platform.position.set(0, height, 0);
    platform.castShadow = true;
    towerGroup.add(platform); // Platform railings

    for (var _i4 = 0; _i4 < 8; _i4++) {
      var _angle2 = _i4 * Math.PI / 4;

      var railing = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8), braceMaterial);
      railing.position.set(Math.cos(_angle2) * 4.8, height + 0.4, Math.sin(_angle2) * 4.8);
      railing.castShadow = true;
      towerGroup.add(railing);
    }
  }); // Service arm (umbilical tower arm)

  var serviceArm = new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 1), towerMaterial);
  serviceArm.position.set(2, 14, 0);
  serviceArm.castShadow = true;
  towerGroup.add(serviceArm); // Base foundation

  var foundation = new THREE.Mesh(new THREE.CylinderGeometry(6, 7, 2, 16), new THREE.MeshLambertMaterial({
    color: 0x333333
  }));
  foundation.position.set(0, 1, 0);
  foundation.castShadow = true;
  towerGroup.add(foundation);
  towerGroup.position.set(-12, 0, 0);

  _sceneSetup.scene.add(towerGroup);

  return towerGroup;
}

function createRocketStationEnvironment() {
  var stationGroup = new THREE.Group(); // Materials

  var concreteMaterial = new THREE.MeshLambertMaterial({
    color: 0x666666
  });
  var metalMaterial = new THREE.MeshLambertMaterial({
    color: 0x888888
  });
  var buildingMaterial = new THREE.MeshLambertMaterial({
    color: 0x4a4a4a
  });
  var roofMaterial = new THREE.MeshLambertMaterial({
    color: 0x333333
  });
  var windowMaterial = new THREE.MeshLambertMaterial({
    color: 0x87ceeb
  });
  var pipeMaterial = new THREE.MeshLambertMaterial({
    color: 0xaaaaaa
  });
  var tankMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff
  }); // Extended Launch Pad

  var launchPad = new THREE.Mesh(new THREE.CylinderGeometry(15, 18, 1, 16), concreteMaterial);
  launchPad.position.set(0, 0.5, 0);
  launchPad.castShadow = true;
  stationGroup.add(launchPad); // Vehicle Assembly Building (VAB)

  var vab = new THREE.Mesh(new THREE.BoxGeometry(25, 30, 15), buildingMaterial);
  vab.position.set(-40, 15, -30);
  vab.castShadow = true;
  stationGroup.add(vab); // VAB Roof

  var vabRoof = new THREE.Mesh(new THREE.BoxGeometry(26, 2, 16), roofMaterial);
  vabRoof.position.set(-40, 31, -30);
  vabRoof.castShadow = true;
  stationGroup.add(vabRoof); // VAB Windows

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 4; j++) {
      var window = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 0.2), windowMaterial);
      window.position.set(-40 - 12.6, 5 + j * 6, -30 + (i - 3.5) * 3);
      stationGroup.add(window);
    }
  } // Mission Control Building


  var missionControl = new THREE.Mesh(new THREE.BoxGeometry(15, 8, 12), buildingMaterial);
  missionControl.position.set(30, 4, -25);
  missionControl.castShadow = true;
  stationGroup.add(missionControl); // Mission Control Roof

  var mcRoof = new THREE.Mesh(new THREE.BoxGeometry(16, 1, 13), roofMaterial);
  mcRoof.position.set(30, 8.5, -25);
  mcRoof.castShadow = true;
  stationGroup.add(mcRoof); // Fuel Storage Tanks

  for (var _i5 = 0; _i5 < 4; _i5++) {
    var tank = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 12, 16), tankMaterial);
    tank.position.set(-60 + _i5 * 8, 6, 20);
    tank.castShadow = true;
    stationGroup.add(tank); // Tank tops

    var tankTop = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 8), tankMaterial);
    tankTop.position.set(-60 + _i5 * 8, 12, 20);
    tankTop.castShadow = true;
    stationGroup.add(tankTop);
  } // Service Roads


  var mainRoad = new THREE.Mesh(new THREE.BoxGeometry(100, 0.2, 8), new THREE.MeshLambertMaterial({
    color: 0x222222
  }));
  mainRoad.position.set(-10, 0.1, -40);
  stationGroup.add(mainRoad);
  var accessRoad = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 60), new THREE.MeshLambertMaterial({
    color: 0x222222
  }));
  accessRoad.position.set(-15, 0.1, -10);
  stationGroup.add(accessRoad); // Crawler Transporter Path

  var crawlerway = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 80), new THREE.MeshLambertMaterial({
    color: 0x444444
  }));
  crawlerway.position.set(-25, 0.15, 0);
  stationGroup.add(crawlerway); // Mobile Service Structure

  var mss = new THREE.Mesh(new THREE.BoxGeometry(8, 20, 6), metalMaterial);
  mss.position.set(20, 10, 5);
  mss.castShadow = true;
  stationGroup.add(mss); // Water Tower

  var waterTowerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 20, 8), metalMaterial);
  waterTowerBase.position.set(40, 10, 15);
  waterTowerBase.castShadow = true;
  stationGroup.add(waterTowerBase);
  var waterTank = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 6, 16), tankMaterial);
  waterTank.position.set(40, 23, 15);
  waterTank.castShadow = true;
  stationGroup.add(waterTank); // Communication Arrays

  for (var _i6 = 0; _i6 < 3; _i6++) {
    var commTower = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 15, 8), metalMaterial);
    commTower.position.set(50 + _i6 * 10, 7.5, -15);
    commTower.castShadow = true;
    stationGroup.add(commTower);
    var dish = new THREE.Mesh(new THREE.CylinderGeometry(3, 0.5, 0.5, 16), metalMaterial);
    dish.position.set(50 + _i6 * 10, 15, -15);
    dish.rotation.x = Math.PI / 4;
    dish.castShadow = true;
    stationGroup.add(dish);
  } // Fuel Pipelines


  for (var _i7 = 0; _i7 < 20; _i7++) {
    var pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2, 8), pipeMaterial);
    pipe.position.set(-45 + _i7 * 2, 1, 15);
    pipe.rotation.z = Math.PI / 2;
    pipe.castShadow = true;
    stationGroup.add(pipe);
  } // Support Buildings


  var buildings = [{
    pos: [-70, 3, -10],
    size: [8, 6, 8]
  }, {
    pos: [45, 2.5, -35],
    size: [6, 5, 6]
  }, {
    pos: [-20, 2, -60],
    size: [10, 4, 8]
  }, {
    pos: [25, 3.5, 30],
    size: [9, 7, 10]
  }];
  buildings.forEach(function (building) {
    var _structure$position;

    var structure = new THREE.Mesh(_construct(THREE.BoxGeometry, _toConsumableArray(building.size)), buildingMaterial);

    (_structure$position = structure.position).set.apply(_structure$position, _toConsumableArray(building.pos));

    structure.castShadow = true;
    stationGroup.add(structure); // Roof

    var roof = new THREE.Mesh(new THREE.BoxGeometry(building.size[0] + 1, 1, building.size[2] + 1), roofMaterial);
    roof.position.set(building.pos[0], building.pos[1] + building.size[1] / 2 + 0.5, building.pos[2]);
    roof.castShadow = true;
    stationGroup.add(roof);
  }); // Emergency Response Vehicles

  var fireStation = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 8), new THREE.MeshLambertMaterial({
    color: 0xff4444
  }));
  fireStation.position.set(-30, 2, 40);
  fireStation.castShadow = true;
  stationGroup.add(fireStation); // Electrical Substations

  for (var _i8 = 0; _i8 < 2; _i8++) {
    var substation = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 4), new THREE.MeshLambertMaterial({
      color: 0x555555
    }));
    substation.position.set(60, 1.5, -30 + _i8 * 20);
    substation.castShadow = true;
    stationGroup.add(substation); // Power lines

    for (var _j = 0; _j < 5; _j++) {
      var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 8, 8), metalMaterial);
      pole.position.set(55 - _j * 5, 4, -30 + _i8 * 20);
      pole.castShadow = true;
      stationGroup.add(pole);
    }
  } // Launch Pad Perimeter Fence


  for (var _i9 = 0; _i9 < 32; _i9++) {
    var angle = _i9 * Math.PI / 16;
    var fence = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 1), metalMaterial);
    fence.position.set(Math.cos(angle) * 25, 1.5, Math.sin(angle) * 25);
    fence.rotation.y = angle;
    stationGroup.add(fence);
  } // Weather Station


  var weatherStation = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 8, 8), new THREE.MeshLambertMaterial({
    color: 0xffffff
  }));
  weatherStation.position.set(-80, 4, -40);
  weatherStation.castShadow = true;
  stationGroup.add(weatherStation); // Equipment scattered around

  var equipment = [{
    pos: [15, 1, 20],
    size: [2, 2, 3]
  }, {
    pos: [-10, 0.5, 25],
    size: [1, 1, 2]
  }, {
    pos: [8, 1.5, -15],
    size: [3, 3, 2]
  }, {
    pos: [-5, 1, -20],
    size: [2, 2, 4]
  }];
  equipment.forEach(function (item) {
    var _box$position;

    var box = new THREE.Mesh(_construct(THREE.BoxGeometry, _toConsumableArray(item.size)), new THREE.MeshLambertMaterial({
      color: 0x777777
    }));

    (_box$position = box.position).set.apply(_box$position, _toConsumableArray(item.pos));

    box.castShadow = true;
    stationGroup.add(box);
  });

  _sceneSetup.scene.add(stationGroup);

  return stationGroup;
}