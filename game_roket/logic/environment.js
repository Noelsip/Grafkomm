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
  const platformBase = new THREE.Mesh(
    new THREE.BoxGeometry(15, 1, 15),
    new THREE.MeshLambertMaterial({ color: 0x666666 })
  );
  platformBase.position.y = 0.5;
  platformBase.receiveShadow = true;
  platformBase.castShadow = true;
  scene.add(platformBase);

  const trenchGeometry = new THREE.BoxGeometry(8, 2, 2);
  const trench = new THREE.Mesh(trenchGeometry, new THREE.MeshLambertMaterial({ color: 0x333333 }));
  trench.position.set(0, -0.5, 0);
  scene.add(trench);
}

export function createLaunchTower() {
  const towerGroup = new THREE.Group();
  const towerMaterial = new THREE.MeshLambertMaterial({ color: 0xcc3333 });

  for (let i = 0; i < 4; i++) {
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.3, 20, 8),
      towerMaterial
    );
    const angle = (i * Math.PI) / 2;
    pillar.position.set(Math.cos(angle) * 3, 10, Math.sin(angle) * 3);
    pillar.castShadow = true;
    towerGroup.add(pillar);
    
    for (let j = 1; j < 4; j++) {
      const brace = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 4.2),
        towerMaterial
      );
      brace.position.set(Math.cos(angle) * 3, j * 5, Math.sin(angle) * 3);
      brace.rotation.z = (i % 2 === 0) ? Math.PI / 4 : -Math.PI / 4;
      brace.castShadow = true;
      towerGroup.add(brace);
    }
  }

  towerGroup.position.set(-10, 0, 0);
  scene.add(towerGroup);
}