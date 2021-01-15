define([
    'base/js/namespace',
    'base/js/events'
], function(Jupyter, events){


floatbook = {};

floatbook.initialize = function() {
    for (let cell of Jupyter.notebook.get_cells()) {
        floatbook.addCell(cell);
    }
}

/**
 * 
 * @param {Object} cell 
 */
floatbook.addCell = function(cell) {
    Draggable.makeDraggable(cell);
    Resizable.makeResizable(cell);
}


// should be on a notebook loaded event, but that doesn't currently work
setTimeout(floatbook.initialize, 1000);


events.on('create.Cell', (e,data)=>{
    floatbook.addCell(data.cell);
})


return floatbook;


});