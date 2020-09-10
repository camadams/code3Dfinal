function startDrawing(gcode) { // Getting the movement lines from the Gcode
    
    consoleOutput.innerHTML = "Received Gcode and ready to simulate."
    var parts = "";
    var parts = gcode.split('\n');

    var movements = parts.filter((line) => isCommandMovement(line));

    // looping through gcode movements and creating array of Vector 3 points
    var points = [];

    var z = 0; // initial printing head height

    for (var i = 0; i < movements.length; i++) {

        var parts = movements[i].split(" ");

        if (parts[1].substring(0, 1) == 'Z') {
            z = parseFloat(parts[1].substring(1));

        } else {
            var point = new THREE.Vector3(parseFloat(parts[1].substring(1)) * 20, z * 20, parseFloat(parts[2].substring(1)) * 20);
            points.push(point);

        }
    }


    function isCommandMovement(line) {
        var result = true;
        var parts = line.split(" ");
        if (parts[0] != "G1") {
            result = false;

        } else if (parts.length < 3 || (parts.length == 3 && parts[1].substring(0, 1) != 'Z')) {
            result = false;
        }
        return result;
    }

    //Scene
    var scene = new THREE.Scene();
    scene.add(new THREE.GridHelper(5000, 10));

    //Camera
    // var wid = window.innerWidth;
    // var hei = window.innerHeight;
    var wid = 800;
    var hei = 600;
    var camera = new THREE.PerspectiveCamera(75, wid/hei, 0.1, 10000);

    //Renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(wid, hei);
    document.body.appendChild(renderer.domElement);

    //Controls
    var myControls = new THREE.OrbitControls(camera, renderer.domElement);


    // Cube for printer tip
    var tipGeo = new THREE.BoxGeometry(5, 30, 5);
    var tipMat = new THREE.MeshBasicMaterial({color: 0xFF69B4});
    var tip = new THREE.Mesh(tipGeo, tipMat);
    scene.add(tip);
    tip.position.set(points[drawRange - 1].x, points[drawRange - 1].y + 15, points[drawRange - 1].z);

    // Lines
    var lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    var lineMat = new THREE.LineBasicMaterial({color: 0xffff00});
    var line = new THREE.Line(lineGeo, lineMat);

    scene.add(line);

    camera.position.set(0, 500, 1000);

    // Setting sliders max value to the number of points of the 3d print
    slider.max = points.length;

    // animation function
    var animate = function () {
        requestAnimationFrame(animate);
        // Play button
        if (play) {
            if (drawRange != points.length) {
                drawRange++;
                slider.value = drawRange - 1;
            }
        }

        // move printer tip
        tip.position.set(points[drawRange - 1].x, points[drawRange - 1].y + 15, points[drawRange - 1].z);

        //Setting drawing range of the print
        line.geometry.setDrawRange(0, drawRange);

        renderer.render(scene, camera);
    };

    animate();
}
