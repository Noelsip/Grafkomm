// input.js
export const controls = {
  throttleUp: false,
  throttleDown: false,
  pitchUp: false,
  pitchDown: false,
  yawLeft: false,
  yawRight: false,
  maxThrottle: false,
  engineCutoff: false
};

export function setupInputListeners() {
  document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
      case 'w': case 'arrowup': controls.pitchUp = true; break;
      case 's': case 'arrowdown': controls.pitchDown = true; break;
      case 'a': case 'arrowleft': controls.yawLeft = true; break;
      case 'd': case 'arrowright': controls.yawRight = true; break;
      case ' ': controls.maxThrottle = true; e.preventDefault(); break;
      case 'x': controls.engineCutoff = true; break;
    }
  });

  document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
      case 'w': case 'arrowup': controls.pitchUp = false; break;
      case 's': case 'arrowdown': controls.pitchDown = false; break;
      case 'a': case 'arrowleft': controls.yawLeft = false; break;
      case 'd': case 'arrowright': controls.yawRight = false; break;
      case ' ': controls.maxThrottle = false; break;
      case 'x': controls.engineCutoff = false; break;
    }
  });
}