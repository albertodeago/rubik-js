var isMovingObj = false;
var isMovingHorizontally = false;
var isMovingVertically = false;

var initialX = null;
var initialY = null;
var axis = null;

var intersects = null
var group = null;

function onMouseDown(event) {
    event.preventDefault();

    RUBIK.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    RUBIK.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    RUBIK.raycaster.setFromCamera(mouse, camera);

    intersects = RUBIK.raycaster.intersectObjects(scene.children);

    initialX = RUBIK.mouse.x;
    initialY = RUBIK.mouse.y;

    if (intersects.length > 0) {
        // console.log("Mouse on ", intersects);
        RUBIK.orbitControl.enableRotate = false;
        isMovingObj = true;
    }
}
window.addEventListener('mousedown', onMouseDown, false);


function onMouseUp(event) {
    event.preventDefault();
    RUBIK.orbitControl.enableRotate = true;
    isMovingObj = false;

    initialX = null;
    initialY = null;

    intersects = null;

    if (group) {
        var endRotationAmount = function() {
            if (axis.y !== 0) {
                var rotation = group.rotation.y;
                var axisY = axis.y;

                if (axisY < 0) {
                    if (Math.abs(rotation) < THREE.Math.degToRad(45)) {
                        // rotating towards left and less than 45 deg. Reset to 0
                        return rotation;
                    } else {
                        // rotating towards left and passed 45 deg. Go to 90
                        return -THREE.Math.degToRad(90) + rotation;
                    }
                } else {
                    if (Math.abs(rotation) < THREE.Math.degToRad(45)) {
                        // rotating towards left and less than 45 deg. Reset to 0
                        return -rotation;
                    } else {
                        // rotating towards right and passed 45 deg. Go to 90
                        return THREE.Math.degToRad(90) - rotation;
                    }
                }
            } else if (axis.x !== 0) {
                var rotation = group.rotation.x;
                var axisX = axis.x;

                if (axisX < 0) {
                    if (Math.abs(rotation) < THREE.Math.degToRad(45)) {
                        return rotation;
                    } else {
                        return THREE.Math.degToRad(90) + rotation;
                    }
                } else {
                    if (Math.abs(rotation) < THREE.Math.degToRad(45)) {
                        return -rotation;
                    } else {
                        return THREE.Math.degToRad(90) - rotation;
                    }
                }
            }
        }();

        // console.log(group.rotation.y, endRotationAmount, group.rotation.y + endRotationAmount);
        group.rotateOnAxis(axis, endRotationAmount);

        setTimeout(() => {
            var rotatedCubes = [];
            group.children.forEach(function(cube) {
                var worldPos = group.localToWorld(cube.position);
                cube.position.x = worldPos.x;
                cube.position.y = worldPos.y;
                cube.position.z = worldPos.z;

                if (isMovingVertically) {
                    if (Math.abs(group.rotation.x) !== THREE.Math.degToRad(0) && Math.abs(group.rotation.x) !== THREE.Math.degToRad(90)) {
                        if (group.rotation.x < 0)
                            group.rotation.x = (group.rotation.x < -THREE.Math.degToRad(45)) ? -THREE.Math.degToRad(90) : -THREE.Math.degToRad(0);
                        else
                            group.rotation.x = (group.rotation.x > THREE.Math.degToRad(45)) ? THREE.Math.degToRad(90) : THREE.Math.degToRad(0);
                    }

                    // cube.rotation.x = (axis.x <= 0) ? (cube.rotation.x + group.rotation.x) : (cube.rotation.x + group.rotation.x);
                    // cube.rotation.y = group.rotation.y;
                    // cube.rotation.z = group.rotation.z;
                    cube.rotation.x = (axis.x <= 0) ? (cube.myRotation.x + group.rotation.x) : (cube.myRotation.x + group.rotation.x);
                    cube.myRotation.x = cube.rotation.x;
                    cube.rotation.y = cube.myRotation.y;
                    cube.rotation.z = cube.myRotation.z;
                }
                if (isMovingHorizontally) {
                    if (Math.abs(group.rotation.y) !== THREE.Math.degToRad(0) && Math.abs(group.rotation.y) !== THREE.Math.degToRad(90)) {
                        if (group.rotation.y < 0)
                            group.rotation.y = (group.rotation.y < -THREE.Math.degToRad(45)) ? -THREE.Math.degToRad(90) : THREE.Math.degToRad(0);
                        else
                            group.rotation.y = (group.rotation.y > THREE.Math.degToRad(45)) ? THREE.Math.degToRad(90) : THREE.Math.degToRad(0);
                    }

                    // cube.rotation.x = group.rotation.x;
                    // cube.rotation.y = (axis.y <= 0) ? (cube.rotation.y - group.rotation.y) : (cube.rotation.y + group.rotation.y);
                    // cube.rotation.z = group.rotation.z;
                    cube.rotation.x = cube.myRotation.x;
                    cube.rotation.y = (axis.y <= 0) ? (cube.myRotation.y - group.rotation.y) : (cube.myRotation.y + group.rotation.y);
                    cube.myRotation.y = cube.rotation.y;
                    cube.rotation.z += THREE.Math.degToRad(90) //cube.myRotation.z;
                }

                // cube.rotation.x = (axis.x <= 0) ? (cube.rotation.x + group.rotation.x) : (cube.rotation.x + group.rotation.x);
                // cube.rotation.y = (axis.y <= 0) ? (cube.rotation.y - group.rotation.y) : (cube.rotation.y + group.rotation.y);
                // cube.rotation.z = group.rotation.z;

                rotatedCubes.push(cube);
            });

            RUBIK.scene.remove(group);
            rotatedCubes.forEach(function(cube) {
                RUBIK.scene.add(cube);
            });

            group = null;
            axis = null;
            isMovingHorizontally = false;
            isMovingVertically = false;
        }, 25);
    }

}
window.addEventListener('mouseup', onMouseUp, false);

function onMouseMove(event) {
    event.preventDefault();

    if (isMovingObj) {
        var x = (event.clientX / window.innerWidth) * 2 - 1;
        var y = -(event.clientY / window.innerHeight) * 2 + 1;

        var deltaX = Math.abs(initialX - x);
        var deltaY = Math.abs(initialY - y);

        if (deltaX >= deltaY && !isMovingVertically) {
            // we are moving horizontally
            isMovingHorizontally = true;
            // console.log("moving horizontally");

            // rotating horizontally means that we have to find all the cubes at the same Y and group it to rotate them.
            var cubeY = intersects[0].object.position.y;
            group = new THREE.Group();

            var cubesSameY = RUBIK.cubes.filter(cube => Math.trunc(cube.position.y) === Math.trunc(cubeY));
            cubesSameY.forEach(cube => {
                RUBIK.scene.remove(cube);
                group.add(cube);
            });

            RUBIK.scene.add(group);
            // console.log(initialX, x, deltaX);
            if (initialX > x) {
                // rotate towards right
                axis = new THREE.Vector3(0, -1, 0);
                var angle = Math.min(deltaX * 2, THREE.Math.degToRad(90)); // THREE.Math.degToRad(90);
                group.rotateOnAxis(axis, angle);
            } else {
                // rotate towards left
                axis = new THREE.Vector3(0, 1, 0);
                var angle = Math.min(deltaX * 2, THREE.Math.degToRad(90));
                group.rotateOnAxis(axis, angle);
            }

        } else if (deltaY > deltaX && !isMovingHorizontally) {
            // we are moving vertically
            // console.log("moving vertically");
            isMovingVertically = true;

            // rotating vertically means that we have to find all the cubes at the same X and group it to rotate them.
            var cubeX = intersects[0].object.position.x;
            group = new THREE.Group();

            var cubesSameX = RUBIK.cubes.filter(cube => Math.trunc(cube.position.x) === Math.trunc(cubeX));
            cubesSameX.forEach(cube => {
                RUBIK.scene.remove(cube);
                group.add(cube);
            });

            RUBIK.scene.add(group);
            if (initialY > y) {
                // rotate towards top
                axis = new THREE.Vector3(1, 0, 0);
                var angle = Math.min(deltaY * 2, THREE.Math.degToRad(90));
                group.rotateOnAxis(axis, angle);
            } else {
                // rotate towards bottom
                axis = new THREE.Vector3(-1, 0, 0);
                var angle = Math.min(deltaY * 2, THREE.Math.degToRad(90));
                group.rotateOnAxis(axis, angle);
            }
        }
    }
}
window.addEventListener('mousemove', onMouseMove, false);