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

        console.log('getpos', draggable.getPosition());
        // a private cell block for the element as it is dragged around
        draggable.dragcellblock = CellBlock.makeCellBlock();
        draggable.dragcellblock.appendTo(FloatBook.cellroot);
        draggable.element.appendTo(draggable.dragcellblock);
        // draggable.do = true;

        draggable.dragcellblock.css({
            top: draggable.dragcoords.top + draggable.dragoffsettop,
            left: draggable.dragcoords.left + draggable.dragoffsetleft
        })

        console.log('getpos', draggable.getPosition());
    }


    /**
     * 
     * @param {CellDraggable} draggable
     * @param {MouseEvent} event 
     */
    onDrag(draggable, event) {
        event.preventDefault();

        // so we can get whats beneath it on the other mouse events
        draggable.dragcellblock.css('pointer-events', 'none');
        draggable.element.css('pointer-events', 'none');
        // get what is below the element
        draggable.beneath = $(document.elementFromPoint(event.pageX, event.pageY)).closest('.cell');
        // turn events back on (otherwise we couldn't interact with it after this!)
        draggable.dragcellblock.css('pointer-events', 'all');
        draggable.element.css('pointer-events', 'all');


        if ( draggable.beneath.length > 0 && ! draggable.beneath.is(draggable.element) ) {
            // dragging over a cell
            draggable.dropgroup = draggable.beneath.closest(CellBlock.className);

            draggable.where = 'after';

            // check if its on top/bottom (if vertical) or left/right (if horizontal)
            if ( draggable.dropgroup.hasClass(CellBlock.horizontal) ) {
                draggable.where = event.pageX - draggable.beneath.offset().left < draggable.beneath.outerWidth()/2 ? 'before' : 'after';
            } else if ( draggable.dropgroup.hasClass(CellBlock.vertical) ) {
                draggable.where = event.pageY - draggable.beneath.offset().top < draggable.beneath.outerHeight()/2 ? 'before' : 'after';
            }
            // that will tell us wether it should be placed before (top/left) or after (bottom/right)

            // let testelem = $('<div>');
            // testelem.css({
            //     height: 30,
            //     border: '2px solid green',
            //     background: 'yellow'
            // });
            // if ( draggable.do ) {
                // this is a function call, it calls either jquery's before() or after()
                // draggable.element[draggable.where](draggable.beneath);
                draggable.beneath[draggable.where](draggable.element);
            // }
            // draggable.do = false;
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