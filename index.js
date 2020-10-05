/**
 * The backend server
 * @author Cameron Adams and Maria Nanabhai
 *
 *
 * ## LICENSE
 * This file is part of Code3D.

 Code3D is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Code3D is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 */

const express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false})
const efu = require('express-fileupload');
const {spawn,exec} = require('child_process');
var fs = require('fs');
const util = require('util');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;
app.use(express.static('.'));
app.use(efu());
app.use(express.json());


// The server serving the front end where users can code 3d artefacts
app.get('/', function (req, res) {
    res.render(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// The server listening for STL files coming in a responsing with the Gcode
app.post('/api', urlencodedParser, async function (req, res) {
    //Getting the stl file on the server
    var blob =req.files.stlBlob;
    var fileName = blob.name +'.stl';

    blob.mv('./stl/' + fileName, (err) => {
        if (err) {
            response.send(err);
        }
     });
     // Slicing the Gcode with Slic3r
    if(process.platform == 'linux') {
        console.log("here")
        var cmd = "slic3r ./stl/blob.stl --output ./gcodeOut/blob.gcode --avoid_crossing_perimeters  0 --bed_temperature  110 --before_layer_gcode   --bottom_solid_layers  3 --bridge_acceleration  0 --bridge_fan_speed  100 --bridge_flow_ratio  1 --bridge_speed  60 --brim_width  0 --complete_objects  0 --cooling  1 --default_acceleration  0 --disable_fan_first_layers  3 --dont_support_bridges  1 --duplicate_distance  6 ";
        var child = exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
       });

       child.on('exit', function() {
            const readFile = util.promisify(fs.readFile);
            var gcodePath = 'gcodeOut/' + fileName.substring(0, fileName.length - 4) + '.gcode';

            readFile(gcodePath,'utf-8').then(gcode => res.send({msg: gcode})).catch(e => res.send(e));
        })

    } else { //not linux

        // Executing the batch script
        const child = spawn('slicerScript.bat');

        child.stdout.on('data', async function (data) {
            await console.log('stdout: ' + data);
        });

        child.stderr.on('data', async function (data) {
            await console.log('stderr: ' + data);
        });

        // Sending the gcode to the client
        child.on('exit', async function (code, signal) {
            console.log('child process exited with ' +  `code ${code} and signal ${signal}`);
            var gcodePath = 'gcodeOut/' + fileName.substring(0, fileName.length - 4) + '.gcode';
            var fileContentsPromise = fs.promises.readFile(gcodePath, 'utf-8').then(gcode => res.send({msg: gcode})).catch(e => res.send(e));
        });
    }

});