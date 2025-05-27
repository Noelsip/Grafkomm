// engineEffects.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { scene } from './sceneSetup.js';

export class EngineEffect {
  constructor(position, scale = 1, color = 0xff6600) {
    this.particles = [];
    this.position = position;
    this.scale = scale;
    this.color = color;
    this.intensity = 0;
  }
  
  update(intensity) {
    this.intensity = intensity;
    
    if (intensity > 0) {
      for (let i = 0; i < intensity * 5; i++) {
        const particle = new THREE.Mesh(
          new THREE.SphereGeometry(0.1 * this.scale, 4, 4),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(
              Math.random() * 0.1 + 0.05,
              1,
              0.5 + Math.random() * 0.3
            ),
            transparent: true,
            opacity: 0.8
          })
        );
        
        particle.position.copy(this.position);
        particle.position.add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.5 * this.scale,
          -Math.random() * 2 * this.scale,
          (Math.random() - 0.5) * 0.5 * this.scale
        ));
        
        particle.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          -0.1 - Math.random() * 0.05,
          (Math.random() - 0.5) * 0.02
        );
        
        particle.life = 30 + Math.random() * 20;
        particle.maxLife = particle.life;
        
        scene.add(particle);
        this.particles.push(particle);
      }
    }
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.position.add(particle.velocity);
      particle.life--;
      
      const lifeRatio = particle.life / particle.maxLife;
      particle.material.opacity = lifeRatio * 0.8;
      particle.scale.setScalar(1 + (1 - lifeRatio) * 2);
      
      if (particle.life <= 0) {
        scene.remove(particle);
        this.particles.splice(i, 1);
      }
    }
  }
  
  clear() {
    this.particles.forEach(particle => scene.remove(particle));
    this.particles = [];
  }
}