class FloatBook {
    static cellroot = $('#notebook-container');
    static view = $('#site');


    constructor(Jupyter, events) {
        events.on('create.Cell', (e,data)=>{
            FloatBook.addCell(data.cell);
        });
        // load mosaic structure
        for ( let cell of Jupyter.notebook.get_cells().reverse() ) {
            new Resizable(cell);
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


        FloatBook.view.on('scroll', function () {

        });
        // view.on('mousedown')
    }




    static zoomBy(scale) {
        FloatBook.zoomTo(FloatBook.getZoom()*scale);
    };

    static panBy(dtop, dleft) {
        let pan = FloatBook.getPan();
        FloatBook.panTo(pan.top+dtop, pan.left+dleft);
    };

    static panTo(top, left) {
        FloatBook.cellroot.css('top',  top);
        FloatBook.cellroot.css('left', left);
    };

    static getPan() {
        return {
            top:  parseFloat(FloatBook.cellroot.css('top')),
            left: parseFloat(FloatBook.cellroot.css('left'))
        }
    };


    

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
    static changeMetadata = function(callback) {
        try {
            FloatBook.setMetadata(callback(FloatBook.getMetadata()));
            return 0;
        } catch (e) {
            console.warn('Failed to set FloatBook metadata due to an error:', e);
            return 1;
        }
    }

    static getMetadata = function() {
        return Jupyter.notebook.metadata.floatbook || {};
    }

    static setMetadata = function(metadata) {
        Jupyter.notebook.metadata.floatbook = metadata;
        Jupyter.notebook.set_dirty();
    }

    /**
     * 
     * @param {Object} cell 
     */
    static addCell = function(cell) {
        // Draggable.makeDraggable(cell);
        // Resizable.makeResizable(cell);
        Floatable.float(cell.element);
    }

}



