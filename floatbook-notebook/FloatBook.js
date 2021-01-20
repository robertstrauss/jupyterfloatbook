class FloatBook {
    static cellroot = $('#notebook-container');
    static view = $('#site');
    static notebookroot = $('#notebook');


    constructor(Jupyter, events) {
        // bind event
        events.on('create.Cell', (e,data)=>{
            FloatBook.addCell(data.cell);
        });

        // load mosaic structure
        for ( let cell of Jupyter.notebook.get_cells().reverse() ) {
            FloatBook.addCell(cell);
        }

        // CSS
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

        // add zoom and pan listeners
        FloatBook.notebookroot.on('wheel', function (event) {
            // get initial coordinates of mouse
            const coords = FloatBook.pageToCellRootCoords(event.pageY, event.pageX);
            
            // do the zoom
            FloatBook.zoomBy(Math.exp(-event.originalEvent.deltaY/500));
            
            // get new coordinates of mouse (changed by zoom)
            const newcoords = FloatBook.pageToCellRootCoords(event.pageY, event.pageX);
            
            // pan back so mouse location is origin of zoom
            FloatBook.panBy(
                (newcoords.top-coords.top)*FloatBook.getZoom(),
                (newcoords.left-coords.left)*FloatBook.getZoom()
            );
        });
        
        FloatBook.draggable = new Draggable(
            FloatBook.view,
            FloatBook.beginDrag,
            FloatBook.onDrag,
            FloatBook.endDrag,
            undefined,
            [0, 1]
        );
    }

    /**
     * converts page coordinates (coordinates relative to viewport)
     * into coordinates relative to cellroot element
     * @param {Number} top 
     * @param {Number} left 
     */
    static pageToCellRootCoords(top, left) {
        return {
            top:  (top -FloatBook.view.offset().top  - FloatBook.getPan().top)/FloatBook.getZoom(),
            left: (left-FloatBook.view.offset().left - FloatBook.getPan().left)/FloatBook.getZoom()
        };
    }


    static beginDrag(event) {
        if ( ! FloatBook.notebookroot.is(event.target) ) {
            return false; // stop drag
        }
        FloatBook.dragoffsettop  = FloatBook.getPan().top  - event.pageY;
        FloatBook.dragoffsetleft = FloatBook.getPan().left - event.pageX;
    }
    static onDrag(event) {
        FloatBook.panTo(
            FloatBook.dragoffsettop  + event.pageY,
            FloatBook.dragoffsetleft + event.pageX
        );
    }
    static endDrag(event) {
    }



    static zoomBy(scale) {
        FloatBook.zoomTo(FloatBook.getZoom()*scale);
    }
    static zoomTo(scale) {
        FloatBook.cellroot.css({
            transform: `scale(${scale})`,
            // zoom: scale
        });

        // fix codemirror scaling issues
        $('.CodeMirror-cursors').css({
            transform: `scale(${1/scale})`,
            transformOrigin: '0 0'
        });
    }
    static getZoom() {
        const transform = FloatBook.getTransform();
        return (parseFloat(transform[0])+parseFloat(transform[3]))/2;
        // return FloatBook.cellroot.css('zoom');
    }


    static panBy(dtop, dleft) {
        const pan = FloatBook.getPan();
        FloatBook.panTo(pan.top+dtop, pan.left+dleft);
    }
    static panTo(top, left) {
        FloatBook.cellroot.css('top',  top);
        FloatBook.cellroot.css('left', left);
    }
    static getPan() {
        return {
            top:  parseFloat(FloatBook.cellroot.css('top')),
            left: parseFloat(FloatBook.cellroot.css('left'))
        }
    }


    static getTransform() {
        const tmatrix = FloatBook.cellroot.css('transform').match(/matrix.*\((.+)\)/)
        if ( tmatrix == null ) {
            return [1, 0, 0, 1, 0, 0];
        }
        return tmatrix[1].split(', ');
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
        // Floatable.float(cell.element);
        const wireio = new WireIO(cell.element);
        const wrapper = wireio.getWrapper();
        new Resizable(cell, wrapper);
        new CellDraggable(cell, wrapper);
    }

}



