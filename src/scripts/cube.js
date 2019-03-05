var createCubes = function() {
    var cubes = [];
    // var cubesEdges = [];
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            for (var z = 0; z < 3; z++) {
                var materials = [
                    new THREE.MeshBasicMaterial({
                        color: 0xff7800
                    }), // orange
                    new THREE.MeshBasicMaterial({
                        color: 0xd92b2c
                    }), // red
                    new THREE.MeshBasicMaterial({
                        color: 0xffffff
                    }), // white
                    new THREE.MeshBasicMaterial({
                        color: 0xe6e621
                    }), // yellow
                    new THREE.MeshBasicMaterial({
                        color: 0x2f55cf
                    }), // blue
                    new THREE.MeshBasicMaterial({
                        color: 0x26b143
                    }), // green
                ];

                var faceMaterial = new THREE.MeshFaceMaterial(materials);
                var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
                var cube = new THREE.Mesh(cubeGeometry, faceMaterial);

                cube.position.x = (x - 1) * 4.1;
                cube.position.y = (y - 1) * 4.1;
                cube.position.z = (z - 1) * 4.1;

                cube.myRotation = {
                    x: 0,
                    y: 0,
                    z: 0
                };

                // var cubeEdges = new THREE.EdgesHelper(cube, 0x000000);
                // cubeEdges.material.linewidth = 3;

                cubes.push(cube);
                // cubesEdges.push(cubeEdges);
            }
        }
    }

    cubes.forEach(function(cube) {
        scene.add(cube);
    });

    // cubesEdges.forEach(function(cubeEdges) {
    //     scene.add(cubeEdges);
    // });

    return cubes;
};
var cubes = createCubes();

window.RUBIK.cubes = cubes;