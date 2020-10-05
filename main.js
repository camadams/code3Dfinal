/**
 * Front end program to create text editor, set up model viewer, and draw up correspondence between them
 * @author Maria Nanabhai
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

var ace = require('brace');
require('brace/mode/javascript');
require('brace/theme/monokai');
require('brace/keybinding/vim');
require('./src/csg');
require('./src/openjscad');
var editor;
var viewer;
var F;
module.exports.viewer = this.viewer;

window.addEventListener('load', function () {
    // create Ace editor on load
    editor = ace.edit('editor');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setTheme('ace/theme/monokai');

    // initial sample code in editor
    editor.setValue([
        '// Javascript'
        , 'function main() {'
        , ' var cube = CSG.cube();  '
        , ' return cube;'
        , '}'
        ].join('\n')
    );
    editor.clearSelection();

    onload();

    // set submit button to update viewer
    document.getElementById("submitCode").addEventListener("click", function (){
        updateSolid();
    })

})

var gProcessor=null;

OpenJsCad.AlertUserOfUncaughtExceptions();

function onload(){
    // set up viewer
    gProcessor = new OpenJsCad.Processor(document.getElementById("viewer"));
    viewer = gProcessor.viewer;
    updateSolid();
}

function updateSolid(code=""){
    // send code from text editor for processing when submitted
    if (code === ""){
        code = editor.getValue();
    }
    console.log("updating solid, code is: " + code)
    gProcessor.setJsCad(code);
}