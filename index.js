const express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false})
const efu = require('express-fileupload');
const {spawn} = require('child_process');
var fs = require('fs').promises;

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


function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

app.post('/api', urlencodedParser, async function (req, res) {


    var blob =req.files.stlBlob;
    var fileName = blob.name +'.stl';

    blob.mv('./stl/' + fileName, (err) => {
        if (err) {
            response.send(err);
        }
     });

   //  Writing a batch script to slice the stl file
            var cmd = `.\\slic3rFolder\\Slic3r-console.exe --output .\\gcodeOut\\${
                fileName.substring(0, fileName.length - 4)
            }.gcode .\\stl\\${fileName} --load .\\slic3rFolder\\config.ini`;

            await fs.writeFile('slicerScript.bat', cmd, (err) => {
                if (err) {
                    throw err;
                }
            });

            // Executing the batch script
            const child = spawn('slicerScript.bat');

            child.stdout.on('data', async function (data) {
                await console.log('stdout: ' + data);
            });

            child.stderr.on('data', async function (data) {
                await console.log('stderr: ' + data);
            });

            // Sending the gcode to the client
            child.on('exit', async function (code) {
                var gcodePath = 'gcodeOut/' + fileName.substring(0, fileName.length - 4) + '.gcode';

                // var tempG = "G1 X-11.237 Y-1.445 E2.25396\nG1 X-12.023 Y-3.600 E2.33543\nG1 X-12.027 Y-5.893 E2.41689\nG1 X-11.248 Y-8.051 E2.49835\nG1 X-9.781 Y-9.813 E2.57981\nG1 X-7.801 Y-10.970 E2.66127\nG1 X-5.500 Y-11.382 E2.74430"
                // res.send({msg:tempG})
                var fileContentsPromise = fs.readFile(gcodePath, 'utf-8').then(gcode => res.send({msg: gcode})).catch(e => res.send(e));
            });
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
//             var cmd = `.\\slic3rFolder\\Slic3r-console.exe --output .\\gcodeOut\\${
//                 fileName.substring(0, fileName.length - 4)
//             }.gcode .\\stl\\${fileName} --load .\\slic3rFolder\\config.ini`;

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
