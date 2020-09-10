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
    editor = ace.edit('editor');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setTheme('ace/theme/monokai');
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

    document.getElementById("submitCode").addEventListener("click", function (){
        console.log("button clicked")
        updateSolid();
        /*F=function(){

            eval(editor.getValue());
        };
        F();
         */
    })

})

var gProcessor=null;

OpenJsCad.AlertUserOfUncaughtExceptions();

function onload(){
    gProcessor = new OpenJsCad.Processor(document.getElementById("viewer"));
    viewer = gProcessor.viewer;
    console.log("loaded");
    updateSolid();
}

function updateSolid(code=""){
    if (code === ""){
        code = editor.getValue();
    }
    console.log("updating solid, code is: " + code)
    gProcessor.setJsCad(code);
}
function test(){
    const m3d = new Code3d();
    console.log("fuckery code is: " + m3d.code);
    m3d.createObject('obj','title');
}
class Code3d {
    constructor() {
        this.objects = [];
        this.code = "function main(){";
        this.scene = "var scene;";
    }

    sphere(){
        this.code += "scene = CSG.sphere(); \n";
        console.log("sphere called, code is: " + this.code);
        var temp = this.code + "return scene;}"
        setTimeout(() => {
            console.log("after timeout, code is: " + temp);
            updateSolid(temp);
        },3000)
    }

    cube(){
        this.code += "scene = scene.union(CSG.cube()); \n";
        console.log("cube called, code is: " + this.code);
        var temp = this.code + "return scene;}"

        setTimeout(() => {
            console.log("after timeout, code is: " + temp);
            updateSolid(temp);
        },5000)
    }

    obj(){
        return "scene = CSG.sphere();"
    }

    createObject(type, name){
        eval('this.objects[\'' + name + '\'] = ' + 'this.' + type + '();');
        this.code += this.objects[name];
        this.complete();
    }

    complete(){
        var temp = this.code + "return scene;}"

        setTimeout(() => {
            console.log("after timeout, code is: " + temp);
            updateSolid(temp);
        },5000)
    }
}