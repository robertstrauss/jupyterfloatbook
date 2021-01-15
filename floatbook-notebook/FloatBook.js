FloatBook = {};

FloatBook.cellroot = $('#notebook-container');
FloatBook.view = $('#site');


FloatBook.cellroot.scroll( function (event) {
    
});


FloatBook.zoomBy = function(scale) {
    FloatBook.zoomTo(FloatBook.getZoom()*scale);
};

FloatBook.panBy = function(x, y) {
  pan = FloatBook.getPan();
  FloatBook.panTo(pan.x+x, pan.y+y);
};

FloatBook.panTo = function(x, y) {
    FloatBook.cellroot.css('top',  y);
    FloatBook.cellroot.css('left', x);
};

FloatBook.getPan = function() {
    return {
        x: parseFloat(FloatBook.cellroot.css('left')),
        y: parseFloat(FloatBook.cellroot.css('top'))
    }
};


FloatBook.load = function() {
    // load mosaic structure
    for ( let cell of Jupyter.notebook.get_cells() ) {
        Resizable.makeResizable(cell);
        new Draggable(cell);
        // Mosaic.recurseCreateMosaic(cell, FloatBook.root);
    }

    FloatBook.view.css({
        position: 'relative', 
        overflow: 'hidden'
    });
    FloatBook.cellroot.css({
        width:  0,
        height: 0,
        padding: 0,
        margin: 0,
        background: 'none',
        boxShadow: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'shown'
    });
}

/**
 * Each argument passed will be interpreted as a key
 * the last argument will be interpreted as a value
 * 
 */
// FloatBook.setMetadataEntry = function() {
//     try {
//         // recursively create and index into objects.
//         obj = Jupyter.notebook.metadata.FloatBook;
//         // note: length-1 is intented to go 1 short of the total length. 
//         for ( let i = 0; i < arguments.length-1; i++ ) {
//             if ( obj[arguments[i]] == undefined ) {
//                 obj[arguments[i]] = {}
//             }
//         }
//         // the final argument is the value at the end of the rabit hole
//         obj[arguments[i]] = arguments[i+1];
//         Jupyter.notebook.set_dirty();
//     } catch (e) {
//         console.warn('Failed to set metadata due to error:', e);
//     }
// }



/**
 * call 'callback' on the metadata object and set the metadata to what it returns.
 * @param {function} callback 
 */
FloatBook.changeMetadata = function(callback) {
    try {
        FloatBook.setMetadata(callback(FloatBook.getMetadata()));
        return 0;
    } catch (e) {
        console.warn('Failed to set FloatBook metadata due to an error:', e);
        return 1;
    }
}

FloatBook.getMetadata = function() {
    return Jupyter.notebook.metadata.floatbook || {};
}

FloatBook.setMetadata = function(metadata) {
    Jupyter.notebook.metadata.floatbook = metadata;
    Jupyter.notebook.set_dirty();
}

/**
 * 
 * @param {Object} cell 
 */
FloatBook.addCell = function(cell) {
    // Draggable.makeDraggable(cell);
    // Resizable.makeResizable(cell);
    Floatable.float(cell.element);
}


// should be on a notebook loaded event, but that doesn't currently work
setTimeout(FloatBook.load, 1000);


// events.on('create.Cell', (e,data)=>{
//     FloatBook.addCell(data.cell);
// });
