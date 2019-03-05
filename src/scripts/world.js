// create scene and renderer
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 25;

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xBBBBBB));
renderer.setSize(window.innerWidth, window.innerHeight);

// var spotLight = new THREE.SpotLight(0xffffff);
// spotLight.position.set(-30, 20, 60);
// spotLight.castShadow = true;
// spotLight.intensity = 0.3;
// scene.add(spotLight);

// var ambientLight = new THREE.AmbientLight(0xeeeeee);
// scene.add(ambientLight);

window.RUBIK = {};
window.RUBIK.scene = scene;
window.RUBIK.camera = camera;
window.RUBIK.renderer = renderer;

// render loop
window.RUBIK.render = function() {
    var delta = RUBIK.clock.getDelta();
    RUBIK.orbitControl.update(delta);
    var azimuthAngle = RUBIK.orbitControl.getAzimuthalAngle();
    // RUBIK.updatePerspective(azimuthAngle);
    requestAnimationFrame(RUBIK.render);
    RUBIK.renderer.render(RUBIK.scene, RUBIK.camera);
}