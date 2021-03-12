class CellDraggable {
    static edgepushmargin = 50; // px
    static className = 'floatbookcelldraggable';
    static cellHandle = '.prompt_container, .input_prompt';

    constructor(cell, element) {
        this.cell = cell;
        this.element = cell.element;
        
        // style draggable elements
        this.element.addClass(CellDraggable.className);

        this.element.addClass('floatbook-floatcell');

        // this.moveTo(this.loadPosition().top, this.loadPosition().left);

        const draggable = this;
        // this.draggable = new Draggable(
        //         this.element.find(CellDraggable.cellHandle),
        //         (e)=>{draggable.beginDrag(draggable, e)},
        //         (e)=>{draggable.onDrag(draggable, e)},
        //         (e)=>{draggable.endDrag(draggable, e)},
        //         [0] // only allow left mouse button to drag
        // );
        draggable.element.on('mousedown', function(e){
            return draggable.beginDrag(draggable, e);
        });
        // select wntire block of a cell when its double clicked
        draggable.element.on('dblclick', function(event) {
            const selectblock = draggable.element.closest(`.${CellBlock.className}`);
            
            // select (and set anchor to) first cell in block of cell being double clicked
            selectblock.children('.cell').first().trigger('click');
            
            // select whole block by shift-clicking final cell
            const shiftClick = jQuery.Event('click');
            shiftClick.shiftKey = true;
            selectblock.children('.cell').last().trigger(shiftClick);
        })
        // drag listener
        draggable.draglistener = function(e) {
            return draggable.onDrag(draggable, e);
        }
    }

    /**
     * 
     * @param {CellDraggable} draggable
     * @param {MouseEvent} event
     */
    beginDrag(draggable, event) {
        // draggable.dragblock = draggable.element.closest(CellBlock.className);

        // save where it was clicked
        draggable.dragcoords = FloatBook.pageToCellRootCoords(event.pageY, event.pageX);
        draggable.dragoffsettop  = draggable.getPosition().top  - draggable.dragcoords.top;
        draggable.dragoffsetleft = draggable.getPosition().left - draggable.dragcoords.left;

        // wait till first mouse movement, then start dragging
        // draggable.element.one('mousemove', function(e) {
            // create a new cell block for the element as it is dragged around
            draggable.dragblock = CellBlock.makeCellBlock();
            // CellBlock.placeIn(draggable.cell, draggable.dragblock);

            // move it to where it was before wrapping it
            // draggable.dragblock.css({
            //     top: draggable.dragcoords.top + draggable.dragoffsettop,
            //     left: draggable.dragcoords.left + draggable.dragoffsetleft
            // });
            
            // drag the whole selection if dragging on a selected cell
            if ( Jupyter.notebook.get_selected_cells().indexOf(draggable.cell) !== -1 ) {
                for ( let selectcell of Jupyter.notebook.get_selected_cells() ) {
                    draggable.element = draggable.element.add(selectcell.element); // group selected cells into jquery object
                }
            } else {
                // only drag the one cell
                draggable.element = draggable.cell.element;
            }

            
            document.addEventListener('mousemove', draggable.draglistener);
            document.addEventListener('mouseup', function (ee) {
                return draggable.endDrag(draggable, ee);
            });
            // execute action from this movement
            // return draggable.draglistener(e);
        // });
    }


    /**
     * 
     * @param {CellDraggable} draggable
     * @param {MouseEvent} event 
     */
    onDrag(draggable, event) {
        /**
         * get what element is below the mouse and below the dragging element,
         * if its a cell, combine the dragging element and that in a block
         * otherwise, just follow the mouse
         */
        // allows document.elementFromPoint to get whats beneath the cellblock
        draggable.dragblock.css('pointer-events', 'none');
        // get what is below the mouse (ignoring the cellblock)
        draggable.beneath = $(document.elementFromPoint(event.pageX, event.pageY)).closest('.cell');
        // turn events back on
        draggable.dragblock.css('pointer-events', 'all');


        if ( draggable.beneath.length > 0 ) { // dragging over a cell
            // get block that is being dragged over
            draggable.dropblock = draggable.beneath.closest(`.${CellBlock.className}`);

            // drop the cell before or after the cell its hovering over
            if ( draggable.dropblock.hasClass(CellBlock.colClass) ) {
                if ( event.pageY - draggable.beneath.offset().top < draggable.beneath.outerHeight()/2 ) {
                    draggable.beneath.before(draggable.element);
                } else {
                    draggable.beneath.after(draggable.element);
                }
            }
            // check if its on top/bottom (if vertical) or left/right (if horizontal)
            // else if ( draggable.dropblock.hasClass(CellBlock.rowClass) ) {
            //     draggable.where = event.pageX - draggable.beneath.offset().left < draggable.beneath.outerWidth()/2 ? 'before' : 'after';
            // } else {
            //     console.warn('classless cellblock', draggable.dropblock);
            //     draggable.where = 'after';
            // }
            // that will tell us wether it should be placed before (top/left) or after (bottom/right)
        }
        else { // dragging over the notebook
            // move cell to drag block if it was put in somewhere else
            if ( ! draggable.element.parent().is(draggable.dragblock) ) {
                draggable.dragblock.append(draggable.element);
            }
            // get pointer location
            draggable.dragcoords = FloatBook.pageToCellRootCoords(event.pageY, event.pageX);
            // move private block there
            draggable.dragblock.css({
                top: draggable.dragoffsettop + draggable.dragcoords.top,
                left: draggable.dragoffsetleft + draggable.dragcoords.left
            });
            // CellBlock.placeIn(draggable.cell, draggable.dragblock);
        }
        



        /** 
         * pan view if mouse is near an edge
         */
        for ( let x of [-1, 1] ) { // two for loops cycle over corners of box surrounding mouse
            for ( let y of [-1, 1] ) {
                // check if this corner (x,y) is outside of FloatBook.view
                if ( $(document.elementFromPoint(
                            x*CellDraggable.edgepushmargin + event.pageX,
                            y*CellDraggable.edgepushmargin + event.pageY
                        )).closest(FloatBook.view).length < 1 ) {
                    // if so, pan towards that corner
                    FloatBook.panBy(
                        -5*y,
                        -5*x
                    );
                }
            }
        }

    }


    /**
     * 
     * @param {CellDraggable} draggable
     * @param {MouseEvent} event 
     */
    endDrag(draggable, event) {
        // remove drag listener
        document.removeEventListener('mousemove', draggable.draglistener);

        // save metadata
        CellBlock.saveCellData(draggable.cell);
        CellBlock.saveBlockData(draggable.dragblock);
    }


    /**
     * @returns object with 'top' and 'left' properties
     */
    getPosition() {
        // current position in DOM
        return {
            top:  parseInt(this.element.css('top')) + parseInt(this.element.closest(`.${CellBlock.className}`).css('top')),
            left: parseInt(this.element.css('left')) + parseInt(this.element.closest(`.${CellBlock.className}`).css('left'))
        };
    }


}