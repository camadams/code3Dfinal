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

app.get('/', function (req, res) {
    res.render(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


app.post('/api', urlencodedParser, async function (req, res) {
    var blob =req.files.stlBlob;
    var fileName = blob.name +'.stl';

    blob.mv('./stl/' + fileName, (err) => {
        if (err) {
            response.send(err);
        }
     });

    // // Writing a batch script to slice the stl file
    // var cmd = `./slic3rFolder/Slic3r-console.exe --output ./gcodeOut/${
    //     fileName.substring(0, fileName.length - 4)
    // }.gcode ./stl/${fileName} --load ./slic3rFolder/config.ini`;

    // await fs.writeFile('slicerScript.bat', cmd, (err) => {
    //     if (err) {
    //         throw err;
    //     }
    // });

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

            // var tempG = "G1 X-11.237 Y-1.445 E2.25396\nG1 X-12.023 Y-3.600 E2.33543\nG1 X-12.027 Y-5.893 E2.41689\nG1 X-11.248 Y-8.051 E2.49835\nG1 X-9.781 Y-9.813 E2.57981\nG1 X-7.801 Y-10.970 E2.66127\nG1 X-5.500 Y-11.382 E2.74430"
            // res.send({msg:tempG})
            var fileContentsPromise = fs.promises.readFile(gcodePath, 'utf-8').then(gcode => res.send({msg: gcode})).catch(e => res.send(e));
        });
    }

});

// app.post('/api', urlencodedParser, async function (req, res) {
//     try {
//         if (!req.files) {
//             res.send({status: false, message: 'No file uploaded'});
//         } else { // Getting the STL file and moving it to stl folder
//             // var tempG = "G1 X-11.237 Y-1.445 E2.25396\nG1 X-12.023 Y-3.600 E2.33543\nG1 X-12.027 Y-5.893 E2.41689\nG1 X-11.248 Y-8.051 E2.49835\nG1 X-9.781 Y-9.813 E2.57981\nG1 X-7.801 Y-10.970 E2.66127\nG1 X-5.500 Y-11.382 E2.74430"
//             // res.send({msg:tempG})
//             var file = req.files.stlFile;
//             var fileName = file.name;

//             file.mv('./stl/' + fileName, (err) => {
//                 if (err) {
//                     response.send(err);
//                 }
//             });

//             // Writing a batch script to slice the stl file
//             var cmd = `./slic3rFolder/Slic3r-console.exe --output ./gcodeOut/${
//                 fileName.substring(0, fileName.length - 4)
//             }.gcode ./stl/${fileName} --load ./slic3rFolder/config.ini`;

//             await fs.writeFile('slicerScript.bat', cmd, (err) => {
//                 if (err) {
//                     throw err;
//                 }
//             });

//             // Executing the batch script
//             const child = spawn('slicerScript.bat');

//             child.stdout.on('data', async function (data) {
//                 await console.log('stdout: ' + data);
//             });

//             child.stderr.on('data', async function (data) {
//                 await console.log('stderr: ' + data);
//             });

//             // Sending the gcode to the client
//             child.on('exit', async function (code) {
//                 var gcodePath = 'gcodeOut/' + fileName.substring(0, fileName.length - 4) + '.gcode';

//                 // var tempG = "G1 X-11.237 Y-1.445 E2.25396\nG1 X-12.023 Y-3.600 E2.33543\nG1 X-12.027 Y-5.893 E2.41689\nG1 X-11.248 Y-8.051 E2.49835\nG1 X-9.781 Y-9.813 E2.57981\nG1 X-7.801 Y-10.970 E2.66127\nG1 X-5.500 Y-11.382 E2.74430"
//                 // res.send({msg:tempG})
//                 var fileContentsPromise = fs.readFile(gcodePath, 'utf-8').then(gcode => res.send({msg: gcode})).catch(e => res.send(e));
//             });
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });
