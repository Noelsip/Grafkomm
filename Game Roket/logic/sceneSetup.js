// sceneSetup.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
export const renderer = new THREE.WebGLRenderer({ antialias: true });

// Camera control variables
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;
let cameraDistance = 25;
let cameraAngleX = 0;
let cameraAngleY = 0;
let targetPosition = new THREE.Vector3(0, 0, 0); // Point camera looks at
let isRightMouseDown = false;
let touchDistance = 0;

export function setupScene() {
  scene.background = new THREE.Color('#87CEEB');

  // Set initial camera position
  cameraDistance = 25;
  cameraAngleX = Math.PI * 0.1; // Slight angle from above
  cameraAngleY = Math.PI * 0.25; // 45 degrees around Y axis
  updateCameraPosition();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  document.body.appendChild(renderer.domElement);

  // Enhanced Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(20, 30, 20);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 4096;
  directionalLight.shadow.mapSize.height = 4096;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 500;
  directionalLight.shadow.camera.left = -50;
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;
  scene.add(directionalLight);

  // Setup camera controls
  setupCameraControls();
}

function updateCameraPosition() {
  // Calculate camera position based on spherical coordinates
  const x = targetPosition.x + cameraDistance * Math.cos(cameraAngleX) * Math.cos(cameraAngleY);
  const y = targetPosition.y + cameraDistance * Math.sin(cameraAngleX);
  const z = targetPosition.z + cameraDistance * Math.cos(cameraAngleX) * Math.sin(cameraAngleY);
  
  camera.position.set(x, y, z);
  camera.lookAt(targetPosition);
}

function setupCameraControls() {
  const canvas = renderer.domElement;

  // Mouse event listeners
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('wheel', onMouseWheel);
  canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // Disable right-click menu

  // Touch events for mobile support
  canvas.addEventListener('touchstart', onTouchStart);
  canvas.addEventListener('touchmove', onTouchMove);
  canvas.addEventListener('touchend', onTouchEnd);

  // Window resize
  window.addEventListener('resize', onWindowResize);
}

function onMouseDown(event) {
  event.preventDefault();
  
  if (event.button === 0) { // Left mouse button - rotate
    isMouseDown = true;
  } else if (event.button === 2) { // Right mouse button - pan
    isRightMouseDown = true;
  }
  
  mouseX = event.clientX;
  mouseY = event.clientY;
}

function onMouseMove(event) {
  event.preventDefault();
  
  if (!isMouseDown && !isRightMouseDown) return;
  
  const deltaX = event.clientX - mouseX;
  const deltaY = event.clientY - mouseY;
  
  if (isMouseDown) {
    // Rotate camera around target
    cameraAngleY -= deltaX * 0.01;
    cameraAngleX -= deltaY * 0.01;
    
    // Limit vertical rotation
    cameraAngleX = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, cameraAngleX));
  } else if (isRightMouseDown) {
    // Pan camera target
    const panSpeed = cameraDistance * 0.001;
    const right = new THREE.Vector3();
    const up = new THREE.Vector3();
    
    right.setFromMatrixColumn(camera.matrix, 0);
    up.setFromMatrixColumn(camera.matrix, 1);
    
    targetPosition.addScaledVector(right, -deltaX * panSpeed);
    targetPosition.addScaledVector(up, deltaY * panSpeed);
  }
  
  mouseX = event.clientX;
  mouseY = event.clientY;
  
  updateCameraPosition();
}

function onMouseUp(event) {
  event.preventDefault();
  isMouseDown = false;
  isRightMouseDown = false;
}

function onMouseWheel(event) {
  event.preventDefault();
  
  const zoomSpeed = cameraDistance * 0.1;
  cameraDistance += event.deltaY * 0.01 * zoomSpeed;
  
  // Limit zoom range
  cameraDistance = Math.max(2, Math.min(100, cameraDistance));
  
  updateCameraPosition();
}

// Touch events for mobile support
function onTouchStart(event) {
  event.preventDefault();
  
  if (event.touches.length === 1) {
    isMouseDown = true;
    mouseX = event.touches[0].clientX;
    mouseY = event.touches[0].clientY;
  } else if (event.touches.length === 2) {
    // Two finger touch for zoom
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    touchDistance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }
}

function onTouchMove(event) {
  event.preventDefault();
  
  if (event.touches.length === 1 && isMouseDown) {
    const deltaX = event.touches[0].clientX - mouseX;
    const deltaY = event.touches[0].clientY - mouseY;
    
    cameraAngleY -= deltaX * 0.01;
    cameraAngleX -= deltaY * 0.01;
    cameraAngleX = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, cameraAngleX));
    
    mouseX = event.touches[0].clientX;
    mouseY = event.touches[0].clientY;
    
    updateCameraPosition();
  } else if (event.touches.length === 2) {
    // Pinch to zoom
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    
    if (touchDistance > 0) {
      const zoomFactor = (touchDistance - distance) * 0.1;
      cameraDistance += zoomFactor;
      cameraDistance = Math.max(2, Math.min(100, cameraDistance));
      updateCameraPosition();
    }
    
    touchDistance = distance;
  }
}

function onTouchEnd(event) {
  event.preventDefault();
  isMouseDown = false;
  touchDistance = 0;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Export camera control functions for external use
export function setCameraTarget(x, y, z) {
  targetPosition.set(x, y, z);
  updateCameraPosition();
}

export function setCameraDistance(distance) {
  cameraDistance = Math.max(2, Math.min(100, distance));
  updateCameraPosition();
}

export function setCameraAngles(angleX, angleY) {
  cameraAngleX = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, angleX));
  cameraAngleY = angleY;
  updateCameraPosition();
}

export function resetCamera() {
  cameraDistance = 25;
  cameraAngleX = Math.PI * 0.1;
  cameraAngleY = Math.PI * 0.25;
  targetPosition.set(0, 0, 0);
  updateCameraPosition();
}