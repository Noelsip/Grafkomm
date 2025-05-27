// hud.js
export function updateHUD(rocketState, ROCKET_CONFIG, GRAVITY) {
  const altitude = Math.max(0, rocketState.position.y - 1.5);
  const velocity = rocketState.velocity.length();
  const acceleration = rocketState.acceleration.length();
  const gForce = acceleration / GRAVITY;
  
  document.getElementById('altitude').textContent = `${altitude.toFixed(1)} m`;
  document.getElementById('velocity').textContent = `${velocity.toFixed(1)} m/s`;
  document.getElementById('acceleration').textContent = `${acceleration.toFixed(1)} m/s²`;
  document.getElementById('gforce').textContent = `${gForce.toFixed(2)} G`;
  document.getElementById('mass').textContent = `${rocketState.currentMass.toFixed(0)} kg`;
  document.getElementById('deltav').textContent = `${rocketState.deltaV.toFixed(1)} m/s`;
  document.getElementById('apoapsis').textContent = rocketState.apoapsis === Infinity ? '∞' : `${(rocketState.apoapsis/1000).toFixed(1)} km`;
  
  document.getElementById('mainThrust').textContent = `${(rocketState.mainEngineThrottle * 100).toFixed(0)}%`;
  document.getElementById('boosterLThrust').textContent = `${(rocketState.leftBoosterThrottle * 100).toFixed(0)}%`;
  document.getElementById('boosterRThrust').textContent = `${(rocketState.rightBoosterThrottle * 100).toFixed(0)}%`;
  document.getElementById('rcsStatus').textContent = rocketState.rcsActive ? 'ON' : 'OFF';
  
  const fuelPercent = (rocketState.fuelRemaining / ROCKET_CONFIG.fuelMass) * 100;
  document.getElementById('fuelPercent').textContent = `${fuelPercent.toFixed(1)}%`;
  document.getElementById('fuelBar').style.width = `${fuelPercent}%`;
  
  const burnTime = rocketState.fuelRemaining > 0 ? 
    (rocketState.fuelRemaining / (ROCKET_CONFIG.mainEngine.fuelFlow * rocketState.mainEngineThrottle + 
    ROCKET_CONFIG.sideBooster.fuelFlow * (rocketState.leftBoosterThrottle + rocketState.rightBoosterThrottle))) : 0;
  document.getElementById('burnTime').textContent = burnTime > 0 ? `${burnTime.toFixed(0)}s` : '∞';
  
  document.getElementById('mainEngineIndicator').className = 
    `engine-indicator ${rocketState.mainEngineThrottle > 0 ? 'engine-active' : ''}`;
  document.getElementById('boosterLIndicator').className = 
    `engine-indicator ${rocketState.leftBoosterThrottle > 0 && !rocketState.boostersSeparated ? 'engine-active' : ''}`;
  document.getElementById('boosterRIndicator').className = 
    `engine-indicator ${rocketState.rightBoosterThrottle > 0 && !rocketState.boostersSeparated ? 'engine-active' : ''}`;
  document.getElementById('rcsIndicator').className = 
    `engine-indicator ${rocketState.rcsActive ? 'engine-active' : ''}`;
  
  let stage = 'Pre-Launch';
  if (rocketState.launched) {
    if (rocketState.boostersSeparated) {
      stage = 'Second Stage';
    } else {
      stage = 'First Stage';
    }
  }
  if (altitude > 100000) stage = 'Space Flight';
  
  document.getElementById('currentStage').textContent = stage;
  
  const minutes = Math.floor(rocketState.flightTime / 60);
  const seconds = Math.floor(rocketState.flightTime % 60);
  document.getElementById('flightTime').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  document.getElementById('maxAltitude').textContent = `${rocketState.maxAltitude.toFixed(1)} m`;
  document.getElementById('maxVelocity').textContent = `${rocketState.maxVelocity.toFixed(1)} m/s`;
  
  const statusElement = document.getElementById('missionStatus');
  if (rocketState.fuelRemaining <= 0 && rocketState.launched) {
    statusElement.textContent = 'FUEL DEPLETED';
    statusElement.className = 'warning';
  } else if (altitude < 1 && rocketState.launched && velocity > 5) {
    statusElement.textContent = 'CRASH';
    statusElement.className = 'critical';
  } else if (rocketState.launched) {
    statusElement.textContent = 'FLIGHT ACTIVE';
    statusElement.className = 'normal';
  } else {
    statusElement.textContent = 'READY';
    statusElement.className = 'normal';
  }
}