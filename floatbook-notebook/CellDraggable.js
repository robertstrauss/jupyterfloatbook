class CellDraggable {
    static edgepushmargin = 50; // px
    static className = 'floatbookcelldraggable';
    static cellHandle = '.prompt_container, .input_prompt';

    constructor(cell, element) {
        this.cell = cell;
        if ( element == undefined ) {
            this.element = this.cell.element;
        } else {
            this.element = element;
        }
        
        // style draggable elements
        this.element.addClass(Draggable.className);

        this.element.css({
            background: 'white',
            // position: 'absolute', // so it can move around freely
        });

        this.moveTo(this.loadPosition().top, this.loadPosition().left);

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
        // save where it was clicked
        const coords = FloatBook.pageToCellRootCoords(event.pageY, event.pageX);
        draggable.dragoffsettop  = draggable.getPosition().top  - coords.top;
        draggable.dragoffsetleft = draggable.getPosition().left - coords.left;
    }


    /**
     * 
     * @param {CellDraggable} draggable
     * @param {MouseEvent} event 
     */
    onDrag(draggable, event) {
        event.preventDefault();

        // move element to mouse
        const coords = FloatBook.pageToCellRootCoords(event.pageY, event.pageX);
        draggable.moveTo(
            draggable.dragoffsettop  + coords.top,
            draggable.dragoffsetleft + coords.left
        );
        
        // pan towards mouse if its hovering on the edge
        for ( let x of [-1, 1] ) { // two for loops cycle over corners of box
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
        

        // // so we can get whats beneath it on the other mouse events
        // draggable.element.css('pointer-events', 'none');

        // draggable.previousDragOver = draggable.dragOver;
        // draggable.dragOver = document.elementFromPoint(event.pageX, event.pageY);
        // // interact the dragged and the hovered over element
        // draggable.onDragOver(draggable.element, draggable.dragOver);
        // if ( ! draggable.previousDragOver === draggable.dragOver ) {
        //     // if what was previously dragged over isn't anymore
        //     draggable.onDragOut(draggable.element, draggable.previousDragOver);
        // }

        // // interact the dragged and the dropped on element
        // draggable.onDrop(draggable.element, document.elementFromPoint(event.pageX, event.pageY));
        // draggable.element.css('pointer-events', 'all');
    }


    /**
     * 
     * @param {CellDraggable} draggable
     * @param {MouseEvent} event 
     */
    endDrag(draggable, event) {
        // save new position
        draggable.savePosition();
    }


    onDragOver(event, destinationElement) {
        // let cell = CellBlock.getParentCell(destinationElement);
        // if ( cell !== null ) { // if there is a parent cell
        //     if ( CellBlock.isInBlock(destinationElement) ) {
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
            top: parseInt(this.element.css('top')),
            left: parseInt(this.element.css('left'))
        };
    }

    /**
     * moves draggable element
     * @param {Number} top 
     * @param {Number} left 
     */
    moveTo(top, left) {
        this.element.css({
            top:  top,
            left: left
        });
    }

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