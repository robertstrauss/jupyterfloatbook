define([
    'base/js/namespace',
    'base/js/events'
], function(Jupyter, events){


floatbook = {
    // cellList: [],

    initialize() {
        for (let cell of Jupyter.notebook.get_cells()) {
            floatbook.addCell(cell);
        }
    },

    /**
     * 
     * @param {Object} cell 
     */
    addCell(cell) {
        Draggable.makeDraggable(cell.element);
        Resizable.makeResizable(cell.element);
        // new Floatable(cell.element);
        // floatbook.cellList.push(
        //     {
        //         draggable: draggable,
        //         floatable: floatable,
        //         cell: cell
        //     }
        // );
    }
}


setTimeout(floatbook.initialize, 1000);

events.on('create.Cell', (e,data)=>{
    floatbook.addCell(data.cell);
})


return floatbook;


});