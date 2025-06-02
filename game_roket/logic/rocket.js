// rocket.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

export const rocket = new THREE.Group();
export const sideBoosterGroup = new THREE.Group();

export function createRocket() {
  // Reset posisi dan rotasi roket
  rocket.position.set(0, 1.5, 0);
  rocket.rotation.set(0, 0, 0);

  // Bersihkan isi sebelumnya
  rocket.clear();
  sideBoosterGroup.clear();

  // === MAIN BODY ===
  const mainBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 12, 16),
    new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 30,
      specular: 0x111111
    })
  );
  mainBody.position.y = 6;
  mainBody.castShadow = true;
  rocket.add(mainBody);

  // Tank sections
  for (let i = 0; i < 3; i++) {
    const tank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.82, 0.82, 0.3, 16),
      new THREE.MeshPhongMaterial({ color: 0x333333 })
    );
    tank.position.y = 2 + i * 4;
    tank.castShadow = true;
    rocket.add(tank);
  }

  // === NOSE CONE ===
  const noseCone = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 3, 16),
    new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 50
    })
  );
  noseCone.position.y = 13.5;
  noseCone.castShadow = true;
  rocket.add(noseCone);

  // === SIDE BOOSTERS ===
  for (let i = -1; i <= 1; i += 2) {
    const boosterGroup = new THREE.Group();
    boosterGroup.position.set(i * 1.5, 0, 0); // posisi relatif ke roket utama
    
    // Booster body
    const booster = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 10, 12),
      new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 20 })
    );
    booster.position.set(0, 5, 0);
    booster.castShadow = true;
    boosterGroup.add(booster);

    // Booster nose
    const boosterNose = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 1.5, 12),
      new THREE.MeshPhongMaterial({ color: 0x222222 })
    );
    boosterNose.position.set(0, 10.75, 0);
    boosterNose.castShadow = true;
    boosterGroup.add(boosterNose);

    // Booster nozzle
    const boosterNozzle = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.8, 8),
      new THREE.MeshPhongMaterial({ color: 0x444444, shininess: 80 })
    );
    boosterNozzle.position.set(0, -0.4, 0);
    boosterNozzle.castShadow = true;
    boosterGroup.add(boosterNozzle);

    sideBoosterGroup.add(boosterGroup);
  }

  // === MAIN ENGINE NOZZLE ===
  const mainNozzle = new THREE.Mesh(
    new THREE.ConeGeometry(0.6, 1.5, 12),
    new THREE.MeshPhongMaterial({ color: 0x444444, shininess: 80 })
  );
  mainNozzle.position.y = -0.75;
  mainNozzle.castShadow = true;
  rocket.add(mainNozzle);

  // === ADD BOOSTERS TO ROCKET ===
  rocket.add(sideBoosterGroup);
}