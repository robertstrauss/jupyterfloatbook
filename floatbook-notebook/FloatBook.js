class FloatBook {
    static cellroot = $('#notebook-container');
    static view = $('#site');
    static notebookroot = $('#notebook');
    static wireplane = $('<svg id="floatbook-wireplane">');


    constructor(Jupyter, events) {
        // add metadata entries
        if ( Jupyter.notebook.metadata.floatbook == undefined ) {
            Jupyter.notebook.metadata.floatbook = {};
        }
        if ( Jupyter.notebook.metadata.floatbook.cellblocks == undefined ) {
            Jupyter.notebook.metadata.floatbook.cellblocks = {};
        }

        // bind event
        events.on('create.Cell', (e,data)=>{
            FloatBook.addCell(data.cell);
        });

        // load mosaic structure
        for ( let cell of Jupyter.notebook.get_cells().reverse() ) {
            FloatBook.addCell(cell);
        }
        
        
        FloatBook.notebookroot.append(FloatBook.wireplane);
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
            overflow: 'shown',
        });

        // add zoom listener
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
        
        // pan listener
        FloatBook.draggable = new Draggable(
            FloatBook.view,
            FloatBook.beginDrag,
            FloatBook.onDrag,
            FloatBook.endDrag,
            [0, 1] // left or middle button only
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
    }static zoomBy(scale) {
        FloatBook.zoomTo(FloatBook.getZoom()*scale);
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

        // pan and zoom wires
        const pan = FloatBook.getPan();
        FloatBook.wireplane.attr('viewBox', `
                    ${-pan.left/scale} ${-pan.top/scale} 
                    ${FloatBook.wireplane.outerWidth()/scale} 
                    ${FloatBook.wireplane.outerHeight()/scale}`);
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

        // pan and zoom wires
        const zoom = FloatBook.getZoom();
        FloatBook.wireplane.attr('viewBox', `
                    ${-left/zoom} ${-top/zoom} 
                    ${FloatBook.wireplane.outerWidth()/zoom} 
                    ${FloatBook.wireplane.outerHeight()/zoom}`);
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

        // make sure the metadata has a floatbook feild
        if ( cell.metadata.floatbook == undefined ) {
            cell.metadata.floatbook = {};
            Jupyter.notebook.set_dirty();
        }

        CellBlock.placeCell(cell);

        // new WireIO(cellblock);
        // new Resizable(cellblock);
        new CellDraggable(cell);
    }

}

