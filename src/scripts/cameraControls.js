var clock = new THREE.Clock();

var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
orbitControl.enablePan = false;

// function updatePerspective(azimuthAngle) {
//     if (azimuthAngle < -Math.PI / 4 * 3) {
//         perspective = 1;
//     } else if (azimuthAngle < -Math.PI / 4) {
//         perspective = 0;
//     } else if (azimuthAngle < Math.PI / 4) {
//         perspective = 3;
//     } else if (azimuthAngle < Math.PI / 4 * 3) {
//         perspective = 2;
//     } else {
//         perspective = 1;
//     }
// }

window.RUBIK.clock = clock;
window.RUBIK.orbitControl = orbitControl;