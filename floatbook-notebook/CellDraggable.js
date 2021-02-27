class CellDraggable {
    static edgepushmargin = 50; // px
    static className = 'floatbookcelldraggable';
    static cellHandle = '.prompt_container, .input_prompt';

    constructor(cell, element) {
        this.cell = cell;
        this.element = cell.element;
        
        // style draggable elements
        this.element.addClass(CellDraggable.className);

        this.element.css({
            background: 'white',
            // position: 'absolute', // so it can move around freely
        });

        // this.moveTo(this.loadPosition().top, this.loadPosition().left);

        const draggable = this;
        this.draggable = new Draggable(
                this.element.find(CellDraggable.cellHandle),
                (e)=>{draggable.beginDrag(draggable, e)},
                (e)=>{draggable.onDrag(draggable, e)},
                (e)=>{draggable.endDrag(draggable, e)},
                [0] // only allow left mouse button to drag
        );
    }

    /**
     * 
     * @param {CellDraggable} draggable
     * @param {MouseEvent} event
     */
    beginDrag(draggable, event) {
        // draggable.dragcellblock = draggable.element.closest(CellBlock.className);

        // save where it was clicked
        draggable.dragcoords = FloatBook.pageToCellRootCoords(event.pageY, event.pageX);
        draggable.dragoffsettop  = draggable.getPosition().top  - draggable.dragcoords.top;
        draggable.dragoffsetleft = draggable.getPosition().left - draggable.dragcoords.left;

        // a private cell block for the element as it is dragged around
        draggable.dragcellblock = CellBlock.makeCellBlock();
        draggable.dragcellblock.appendTo(FloatBook.cellroot);
        draggable.element.appendTo(draggable.dragcellblock);

        // move it to where it was before wrapping it
        draggable.dragcellblock.css({
            top: draggable.dragcoords.top + draggable.dragoffsettop,
            left: draggable.dragcoords.left + draggable.dragoffsetleft
        })

    }


    /**
     * 
     * @param {CellDraggable} draggable
     * @param {MouseEvent} event 
     */
    onDrag(draggable, event) {
        event.preventDefault();

        // allows document.elementFromPoint to get whats beneath the cellblock
        draggable.dragcellblock.css('pointer-events', 'none');
        // get what is below the mouse (ignoring the cellblock)
        draggable.beneath = $(document.elementFromPoint(event.pageX, event.pageY)).closest('.cell');
        // turn events back on
        draggable.dragcellblock.css('pointer-events', 'all');


        if ( draggable.beneath.length > 0 ) {
            // dragging over a cell
            draggable.dropgroup = draggable.beneath.closest(`.${CellBlock.className}`);

            // check if its on top/bottom (if vertical) or left/right (if horizontal)
            if ( draggable.dropgroup.hasClass(CellBlock.rowClass) ) {
                draggable.where = event.pageX - draggable.beneath.offset().left < draggable.beneath.outerWidth()/2 ? 'before' : 'after';
            } else if ( draggable.dropgroup.hasClass(CellBlock.colClass) ) {
                draggable.where = event.pageY - draggable.beneath.offset().top < draggable.beneath.outerHeight()/2 ? 'before' : 'after';
            } else {
                console.warn('classless cellblock', draggable.dropgroup);
                draggable.where = 'after';
            }
            // that will tell us wether it should be placed before (top/left) or after (bottom/right)

            // this is a function call, it calls either jquery's before() or after()
            draggable.beneath[draggable.where](draggable.element);
        }
        else {
            // dragging over the notebook

            // get pointer location
            draggable.dragcoords = FloatBook.pageToCellRootCoords(event.pageY, event.pageX);
            // move private block there
            draggable.dragcellblock.css({
                top: draggable.dragoffsettop + draggable.dragcoords.top,
                left: draggable.dragoffsetleft + draggable.dragcoords.left
            });
            // put it back in the private block (in case it got moved out)
            draggable.element.appendTo(draggable.dragcellblock);
        }
        
        // pan view if mouse is near an edge
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
        // metadata for the new position needs to be saved
        Jupyter.notebook.dirty = true;


        

        // save new position
        draggable.savePosition();
    }


    onDragOver(event, destinationElement) {
        // let cell = CellBlock.getParentCell(destinationElement);
        // if ( cell !== null ) { // if there is a parent cell
        //     if ( CellBlock.isInBlock(dtopestinationElement) ) {
        //         let direction = CellBlock.getOrientation(CellBlock.getParentBlock(destinationElement));
        //         if ( direction == 'row' ) {
        //             if ( event.pageX - cell.offset().left > 0.5*cell.outerWidth() )
        //         }
        //     }
        // } else if ( destinationElement.is(FloatBook.notebookroot) ) {
        //     FloatBook.cellroot.append(sourceCell);
        // } else {
        //     // didn't drop on a logical thing
        // }
    }
    onDragOut(destinationElement) {

    }
    onDrop() {

    }




    /**
     * 
     */
    savePosition() {
        this.cell.metadata.floatposition = this.getPosition();
        
        Jupyter.notebook.set_dirty();
    }


    loadPosition() {
        return this.cell.metadata.floatposition || this.element.offset();
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

    /**
     * moves draggable element
     * @param {Number} top 
     * @param {Number} left 
     */
    // moveTo(top, left) {
    //     this.element.css({
    //         top:  top,
    //         left: left
    //     });
    // }

    /**
     * changes draggable element position
     * @param {Number} dtop 
     * @param {Number} dleft 
     */
    moveBy(dtop, dleft) {
        let pos = Draggable.getPosition(this.element);
        this.moveTo(pos.top+dtop, pos.left+dleft);
    }


}