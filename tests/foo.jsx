#target illustrator
#targetengine main

/*
(function() {
    
    function buildMsg (selection) {
        layerList = [];
        for (k=0; k<selection.length; k++)
            layerList.push (selection[k].index);

        var bt = new BridgeTalk;
        bt.target = "illustrator";		
        var params = {layerList:layerList};
        var msg = selectLayers + '\rselectLayers(' + params.toSource() + ');';

        bt.body = msg;
        bt.send();	
    }

    function selectLayers (params) {
        var obj = eval(params);
        var layerList = obj.layerList;
        var idoc = app.activeDocument;
        for (j=0; j<layerList.length; j++) {
            idoc.layers[layerList[j]].hasSelectedArtwork = true;
        }
    }
    
    var doc = app.activeDocument;
    var layers = doc.layers;
    var count = layers.length;
    var names = function() {
        var i;
        for (i = 0; i < count; i++) {
            names[i] = layers[i].name;
        }    
    };
    
    var win = (function() {
        
        var w = new Window(
            'palette',
            'Select Layers',
            undefined,
            {
                resizeable: true
            }
        );
        var ddL = w.add('listbox',undefined,layers, {multiselect: true});
        var btnSelect = w.add('button', undefined, 'Select');
        
        ddL.onDoubleClick = function () {
            buildMsg (ddL.selection);
        }
        
        btnSelect.onClick = function(){
            buildMsg (ddL.selection);	  
        }
    
        return w;

    })();
    
    win.onResizing = function () {this.layout.resize();}
    win.onShow = function () {this.layout.resize();}

    win.center();
    win.show();
    
}());
*/


// script.name = selectLayers.jsx; 
// script.description = selects layers;
// script.requirements = an opened document;
// script.parent = CarlosCanto // 10/29/2012;
// script.elegant = false;


// Usage: select single layers by selecting them then clicking on the "select" button or by double clicking on them
//               select multiple contiguos layers by clicking on the first layer, then holding Shift, clicking on the last one 
// 		  select multiple non-contiguos layers by clicking on them while holding Ctrl


#target Illustrator
#targetengine main

var idoc = app.activeDocument;
var layers = idoc.layers;
var layerCount = layers.length;
var layerNames = [];    
for (i=0; i<layerCount; i++) {
	layerNames[i] = layers[i].name;
}

var win = new Window('palette', 'Select Layers', undefined, {resizeable:true});
var ddL = win.add('listbox',undefined,layerNames, {multiselect: true});
var btnSelect = win.add('button', undefined, 'Select');

ddL.alignment = ["fill","fill"];
win.preferredSize = [100,-1];
win.alignChildren = ["fill", "bottom"];
win.helpTip = "\u00A9 2012 Carlos Canto";
btnSelect.helpTip = "Press Esc to Close";

ddL.onDoubleClick = function () {
    buildMsg (ddL.selection);
}
btnSelect.onClick = function(){
    buildMsg (ddL.selection);	  
}

win.onResizing = function () {this.layout.resize();}
win.onShow = function () {win.layout.resize();}

win.center();
win.show();

function buildMsg (selection) {
    layerList = [];
    for (k=0; k<selection.length; k++)
        layerList.push (selection[k].index);

    var bt = new BridgeTalk;
    bt.target = "illustrator";		
    var params = {layerList:layerList};
    var msg = selectLayers + '\rselectLayers(' + params.toSource() + ');';

    bt.body = msg;
    bt.send();	
}

function selectLayers (params) {
    var obj = eval(params);
    var layerList = obj.layerList;
    var idoc = app.activeDocument;
    for (j=0; j<layerList.length; j++) {
        idoc.layers[layerList[j]].hasSelectedArtwork = true;
    }
}
