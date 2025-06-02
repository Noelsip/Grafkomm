// environment.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { scene } from './sceneSetup.js';

export function createGround() {
  const groundGeometry = new THREE.PlaneGeometry(500, 500, 50, 50);
  const groundMaterial = new THREE.MeshLambertMaterial({ 
    color: 0x4a7c59,
    transparent: true,
    opacity: 0.9
  });

  const groundVertices = groundGeometry.attributes.position.array;
  for (let i = 0; i < groundVertices.length; i += 3) {
    groundVertices[i + 2] = Math.random() * 0.5;
  }
  groundGeometry.attributes.position.needsUpdate = true;
  groundGeometry.computeVertexNormals();

  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
}

export function createLaunchPlatform() {
  // --- Platform Utama ---
  const platformBase = new THREE.Mesh(
    new THREE.BoxGeometry(20, 1, 20),
    new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.3, roughness: 0.7 })
  );
  platformBase.position.y = 0.5;
  platformBase.receiveShadow = true;
  platformBase.castShadow = true;
  scene.add(platformBase);

  // --- Flame Trench ---
  const trenchGeometry = new THREE.BoxGeometry(8, 2, 3);
  const trench = new THREE.Mesh(
    trenchGeometry,
    new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.1, roughness: 0.8 })
  );
  trench.position.set(0, -0.5, 0);
  trench.receiveShadow = true;
  scene.add(trench);

  // --- Grid Besi Atas Trench ---
  const gridMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.3 });
  for (let i = -3.5; i <= 3.5; i += 1) {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.2, 3),
      gridMaterial
    );
    bar.position.set(i, 1.01, 0);
    bar.castShadow = true;
    bar.receiveShadow = true;
    scene.add(bar);
  }

  // --- Penyangga Besi Samping ---
  const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.4, roughness: 0.5 });
  const columnGeometry = new THREE.BoxGeometry(0.5, 5, 0.5);

  for (let x = -8; x <= 8; x += 8) {
    for (let z = -8; z <= 8; z += 8) {
      const column = new THREE.Mesh(columnGeometry, supportMaterial);
      column.position.set(x, 2.5, z);
      column.castShadow = true;
      column.receiveShadow = true;
      scene.add(column);
    }
  }

  // --- Tangga Samping (Opsional Tambahan Dekoratif) ---
  const stairMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.3, roughness: 0.6 });
  for (let i = 0; i < 5; i++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.2, 0.8),
      stairMaterial
    );
    step.position.set(-10, 0.2 + i * 0.2, -6);
    scene.add(step);
  }
}

export function createLaunchTower() {
  const towerGroup = new THREE.Group();
  const towerMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
  const braceMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
  const platformMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });

  // Main support structure - 4 tall pillars
  for (let i = 0; i < 4; i++) {
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.25, 20, 8),
      towerMaterial
    );
    const angle = (i * Math.PI) / 2;
    pillar.position.set(Math.cos(angle) * 4, 6, Math.sin(angle) * 4);
    pillar.castShadow = true;
    towerGroup.add(pillar);
  }

  // Horizontal cross braces between pillars
  for (let level = 0; level < 4; level++) {
    const height = level * 4 + 2;
    for (let i = 0; i < 4; i++) {
      const angle1 = (i * Math.PI) / 2;
      const angle2 = ((i + 1) * Math.PI) / 2;
      
      const brace = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 5.6),
        braceMaterial
      );
      
      const x1 = Math.cos(angle1) * 4;
      const z1 = Math.sin(angle1) * 4;
      const x2 = Math.cos(angle2) * 4;
      const z2 = Math.sin(angle2) * 4;
      
      brace.position.set((x1 + x2) / 2, height, (z1 + z2) / 2);
      brace.rotation.y = angle1 + Math.PI / 4;
      brace.rotation.z = Math.PI / 2;
      brace.castShadow = true;
      towerGroup.add(brace);
    }
  }

  // Diagonal cross braces for structural integrity
  for (let level = 0; level < 3; level++) {
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const nextAngle = ((i + 1) * Math.PI) / 2;
      
      // X-pattern braces
      const brace1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 7),
        braceMaterial
      );
      const brace2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 7),
        braceMaterial
      );
      
      const baseHeight = level * 4 + 2;
      const x1 = Math.cos(angle) * 4;
      const z1 = Math.sin(angle) * 4;
      const x2 = Math.cos(nextAngle) * 4;
      const z2 = Math.sin(nextAngle) * 4;
      
      brace1.position.set((x1 + x2) / 2, baseHeight + 2.5, (z1 + z2) / 2);
      brace1.rotation.y = angle + Math.PI / 4;
      brace1.rotation.z = Math.PI / 6;
      
      brace2.position.set((x1 + x2) / 2, baseHeight + 2.5, (z1 + z2) / 2);
      brace2.rotation.y = angle + Math.PI / 4;
      brace2.rotation.z = -Math.PI / 6;
      
      brace1.castShadow = true;
      brace2.castShadow = true;
      towerGroup.add(brace1);
      towerGroup.add(brace2);
    }
  }

  // Service platforms at different levels
  const platformLevels = [6, 12, 16];
  platformLevels.forEach(height => {
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(5, 5, 0.3, 16),
      platformMaterial
    );
    platform.position.set(0, height, 0);
    platform.castShadow = true;
    towerGroup.add(platform);
    
    // Platform railings
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const railing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.8),
        braceMaterial
      );
      railing.position.set(Math.cos(angle) * 4.8, height + 0.4, Math.sin(angle) * 4.8);
      railing.castShadow = true;
      towerGroup.add(railing);
    }
  });

  // Service arm (umbilical tower arm)
  const serviceArm = new THREE.Mesh(
    new THREE.BoxGeometry(8, 0.5, 1),
    towerMaterial
  );
  serviceArm.position.set(2, 14, 0);
  serviceArm.castShadow = true;
  towerGroup.add(serviceArm);


  // Base foundation
  const foundation = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 7, 2, 16),
    new THREE.MeshLambertMaterial({ color: 0x333333 })
  );
  foundation.position.set(0, 1, 0);
  foundation.castShadow = true;
  towerGroup.add(foundation);

  towerGroup.position.set(-12, 0, 0);
  scene.add(towerGroup);
  return towerGroup;
}

export function createRocketStationEnvironment() {
  const stationGroup = new THREE.Group();
  
  // Materials
  const concreteMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
  const metalMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
  const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
  const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87ceeb });
  const pipeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
  const tankMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

  // Extended Launch Pad
  const launchPad = new THREE.Mesh(
    new THREE.CylinderGeometry(15, 18, 1, 16),
    concreteMaterial
  );
  launchPad.position.set(0, 0.5, 0);
  launchPad.castShadow = true;
  stationGroup.add(launchPad);

  // Vehicle Assembly Building (VAB)
  const vab = new THREE.Mesh(
    new THREE.BoxGeometry(25, 30, 15),
    buildingMaterial
  );
  vab.position.set(-40, 15, -30);
  vab.castShadow = true;
  stationGroup.add(vab);

  // VAB Roof
  const vabRoof = new THREE.Mesh(
    new THREE.BoxGeometry(26, 2, 16),
    roofMaterial
  );
  vabRoof.position.set(-40, 31, -30);
  vabRoof.castShadow = true;
  stationGroup.add(vabRoof);

  // VAB Windows
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 4; j++) {
      const window = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 0.2),
        windowMaterial
      );
      window.position.set(-40 - 12.6, 5 + j * 6, -30 + (i - 3.5) * 3);
      stationGroup.add(window);
    }
  }

  // Mission Control Building
  const missionControl = new THREE.Mesh(
    new THREE.BoxGeometry(15, 8, 12),
    buildingMaterial
  );
  missionControl.position.set(30, 4, -25);
  missionControl.castShadow = true;
  stationGroup.add(missionControl);

  // Mission Control Roof
  const mcRoof = new THREE.Mesh(
    new THREE.BoxGeometry(16, 1, 13),
    roofMaterial
  );
  mcRoof.position.set(30, 8.5, -25);
  mcRoof.castShadow = true;
  stationGroup.add(mcRoof);

  // Fuel Storage Tanks
  for (let i = 0; i < 4; i++) {
    const tank = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 12, 16),
      tankMaterial
    );
    tank.position.set(-60 + i * 8, 6, 20);
    tank.castShadow = true;
    stationGroup.add(tank);

    // Tank tops
    const tankTop = new THREE.Mesh(
      new THREE.SphereGeometry(3, 16, 8),
      tankMaterial
    );
    tankTop.position.set(-60 + i * 8, 12, 20);
    tankTop.castShadow = true;
    stationGroup.add(tankTop);
  }

  // Service Roads
  const mainRoad = new THREE.Mesh(
    new THREE.BoxGeometry(100, 0.2, 8),
    new THREE.MeshLambertMaterial({ color: 0x222222 })
  );
  mainRoad.position.set(-10, 0.1, -40);
  stationGroup.add(mainRoad);

  const accessRoad = new THREE.Mesh(
    new THREE.BoxGeometry(8, 0.2, 60),
    new THREE.MeshLambertMaterial({ color: 0x222222 })
  );
  accessRoad.position.set(-15, 0.1, -10);
  stationGroup.add(accessRoad);

  // Crawler Transporter Path
  const crawlerway = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.3, 80),
    new THREE.MeshLambertMaterial({ color: 0x444444 })
  );
  crawlerway.position.set(-25, 0.15, 0);
  stationGroup.add(crawlerway);

  // Mobile Service Structure
  const mss = new THREE.Mesh(
    new THREE.BoxGeometry(8, 20, 6),
    metalMaterial
  );
  mss.position.set(20, 10, 5);
  mss.castShadow = true;
  stationGroup.add(mss);

  // Water Tower
  const waterTowerBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 20, 8),
    metalMaterial
  );
  waterTowerBase.position.set(40, 10, 15);
  waterTowerBase.castShadow = true;
  stationGroup.add(waterTowerBase);

  const waterTank = new THREE.Mesh(
    new THREE.CylinderGeometry(4, 4, 6, 16),
    tankMaterial
  );
  waterTank.position.set(40, 23, 15);
  waterTank.castShadow = true;
  stationGroup.add(waterTank);

  // Communication Arrays
  for (let i = 0; i < 3; i++) {
    const commTower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.3, 15, 8),
      metalMaterial
    );
    commTower.position.set(50 + i * 10, 7.5, -15);
    commTower.castShadow = true;
    stationGroup.add(commTower);

    const dish = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 0.5, 0.5, 16),
      metalMaterial
    );
    dish.position.set(50 + i * 10, 15, -15);
    dish.rotation.x = Math.PI / 4;
    dish.castShadow = true;
    stationGroup.add(dish);
  }

  // Fuel Pipelines
  for (let i = 0; i < 20; i++) {
    const pipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 2, 8),
      pipeMaterial
    );
    pipe.position.set(-45 + i * 2, 1, 15);
    pipe.rotation.z = Math.PI / 2;
    pipe.castShadow = true;
    stationGroup.add(pipe);
  }

  // Support Buildings
  const buildings = [
    { pos: [-70, 3, -10], size: [8, 6, 8] },
    { pos: [45, 2.5, -35], size: [6, 5, 6] },
    { pos: [-20, 2, -60], size: [10, 4, 8] },
    { pos: [25, 3.5, 30], size: [9, 7, 10] }
  ];

  buildings.forEach(building => {
    const structure = new THREE.Mesh(
      new THREE.BoxGeometry(...building.size),
      buildingMaterial
    );
    structure.position.set(...building.pos);
    structure.castShadow = true;
    stationGroup.add(structure);

    // Roof
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(building.size[0] + 1, 1, building.size[2] + 1),
      roofMaterial
    );
    roof.position.set(building.pos[0], building.pos[1] + building.size[1]/2 + 0.5, building.pos[2]);
    roof.castShadow = true;
    stationGroup.add(roof);
  });

  // Emergency Response Vehicles
  const fireStation = new THREE.Mesh(
    new THREE.BoxGeometry(12, 4, 8),
    new THREE.MeshLambertMaterial({ color: 0xff4444 })
  );
  fireStation.position.set(-30, 2, 40);
  fireStation.castShadow = true;
  stationGroup.add(fireStation);

  // Electrical Substations
  for (let i = 0; i < 2; i++) {
    const substation = new THREE.Mesh(
      new THREE.BoxGeometry(6, 3, 4),
      new THREE.MeshLambertMaterial({ color: 0x555555 })
    );
    substation.position.set(60, 1.5, -30 + i * 20);
    substation.castShadow = true;
    stationGroup.add(substation);

    // Power lines
    for (let j = 0; j < 5; j++) {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 8, 8),
        metalMaterial
      );
      pole.position.set(55 - j * 5, 4, -30 + i * 20);
      pole.castShadow = true;
      stationGroup.add(pole);
    }
  }

  // Launch Pad Perimeter Fence
  for (let i = 0; i < 32; i++) {
    const angle = (i * Math.PI) / 16;
    const fence = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3, 1),
      metalMaterial
    );
    fence.position.set(Math.cos(angle) * 25, 1.5, Math.sin(angle) * 25);
    fence.rotation.y = angle;
    stationGroup.add(fence);
  }

  // Weather Station
  const weatherStation = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 8, 8),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  weatherStation.position.set(-80, 4, -40);
  weatherStation.castShadow = true;
  stationGroup.add(weatherStation);

  // Equipment scattered around
  const equipment = [
    { pos: [15, 1, 20], size: [2, 2, 3] },
    { pos: [-10, 0.5, 25], size: [1, 1, 2] },
    { pos: [8, 1.5, -15], size: [3, 3, 2] },
    { pos: [-5, 1, -20], size: [2, 2, 4] }
  ];

  equipment.forEach(item => {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(...item.size),
      new THREE.MeshLambertMaterial({ color: 0x777777 })
    );
    box.position.set(...item.pos);
    box.castShadow = true;
    stationGroup.add(box);
  });

  scene.add(stationGroup);
  return stationGroup;
}