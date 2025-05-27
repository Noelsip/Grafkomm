// rocket.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

export const rocket = new THREE.Group();
export const sideBoosterGroup = new THREE.Group();

export function createRocket() {
  rocket.position.set(0, 1.5, 0);

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

  const tankMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0, shininess: 20 });
  for (let i = 0; i < 3; i++) {
    const tank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.82, 0.82, 0.3, 16),
      new THREE.MeshPhongMaterial({ color: 0x333333 })
    );
    tank.position.y = 2 + i * 4;
    rocket.add(tank);
  }

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

  for (let i = -1; i <= 1; i += 2) {
    const boosterGroup = new THREE.Group();
    
    const booster = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 10, 12),
      new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 20 })
    );
    booster.position.set(i * 1.5, 5, 0);
    booster.castShadow = true;
    boosterGroup.add(booster);
    
    const boosterNose = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 1.5, 12),
      new THREE.MeshPhongMaterial({ color: 0x222222 })
    );
    boosterNose.position.set(i * 1.5, 10.75, 0);
    boosterNose.castShadow = true;
    boosterGroup.add(boosterNose);
    
    sideBoosterGroup.add(boosterGroup);
  }
  rocket.add(sideBoosterGroup);

  const mainNozzle = new THREE.Mesh(
    new THREE.ConeGeometry(0.6, 1.5, 12),
    new THREE.MeshPhongMaterial({ color: 0x444444, shininess: 80 })
  );
  mainNozzle.position.y = -0.75;
  mainNozzle.castShadow = true;
  rocket.add(mainNozzle);

  for (let i = -1; i <= 1; i += 2) {
    const nozzle = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.8, 8),
      new THREE.MeshPhongMaterial({ color: 0x444444, shininess: 80 })
    );
    nozzle.position.set(i * 1.5, -0.4, 0);
    nozzle.castShadow = true;
    sideBoosterGroup.add(nozzle);
  }
}