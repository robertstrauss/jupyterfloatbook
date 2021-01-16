class Draggable {
    static edgepushmargin = 50; // px
    static className = 'floatbookdraggable';
    static cellHandle = '.prompt_container, .input_prompt';

    constructor(cell) {
        this.cell = cell;
        this.element = this.cell.element;

    
        // style draggable elements
        this.element.addClass(Draggable.className);

        this.element.css({
            background: 'white',
            position: 'absolute', // so it can move around freely
        });

        this.moveTo(this.loadPosition().top, this.loadPosition().left);

        this.handle = Draggable.cellHandle;

        let draggable = this;
        this.element.on('mousedown', function (...args) {
            draggable.beginDrag(draggable, ...args);
        });


        draggable.draglistener = function(...args){
            draggable.onDrag(draggable, ...args);
        };
    }

    /**
     * 
     * @param {Draggable} draggable
     * @param {Object} cell 
     */
    beginDrag(draggable, event) {
        // left button only
        if ( event.button != 0 ) {
            return;
        }

        // only activate if clicking on the correct element
        if ( $(event.target).closest(draggable.handle).length < 1 ) {
            return;
        }
        event.preventDefault();

        // save where it was clicked
        draggable.dragoffsettop  = draggable.getPosition().top  - event.pageY + FloatBook.getPan().top;
        draggable.dragoffsetleft = draggable.getPosition().left - event.pageX + FloatBook.getPan().left;

        // add drag listener
        document.addEventListener('mousemove', draggable.draglistener);
        // stop when mouse is released
        document.addEventListener('mouseup',   function(...args){
            draggable.endDrag(draggable, ...args);
        });
    }


    /**
     * 
     * @param {Draggable} draggable
     * @param {MouseEvent} event 
     */
    onDrag(draggable, event) {
        event.preventDefault();

        // move element to mouse
        draggable.moveTo(
            draggable.dragoffsettop  + event.pageY - FloatBook.getPan().top,
            draggable.dragoffsetleft + event.pageX - FloatBook.getPan().left
        );

        // pan towards mouse if its hovering on the edge
        if ( event.pageY - Draggable.edgepushmargin < FloatBook.view.offset().top ) {
            // dragging near the top edge
            FloatBook.panBy(
                FloatBook.view.offset().top - event.pageY + Draggable.edgepushmargin,
                0
            );
        }
        else if ( event.pageY + Draggable.edgepushmargin
            > FloatBook.view.offset().top + FloatBook.view.innerHeight() ) {
            // dragging near the bottom edge
            FloatBook.panBy(
                FloatBook.view.offset().top + FloatBook.view.innerHeight() - event.pageY - Draggable.edgepushmargin,
                0
            );
        }
        if ( event.pageX - Draggable.edgepushmargin < FloatBook.view.offset().left ) {
            // dragging near the left edge
            FloatBook.panBy(
                0,
                FloatBook.view.offset().left - event.pageX + Draggable.edgepushmargin
            );
        }
        else if ( event.pageX + Draggable.edgepushmargin
            > FloatBook.view.offset().left + FloatBook.view.innerWidth() ) {
            // dragging near the right edge
            FloatBook.panBy(
                0,
                FloatBook.view.offset().left + FloatBook.view.innerWidth() - event.pageX - Draggable.edgepushmargin
            );
        }
        
    }


    /**
     * 
     * @param {Dragable} draggable
     * @param {MouseEvent} event 
     */
    endDrag(draggable, event) {
        // stop the dragging
        document.removeEventListener('mousemove', draggable.draglistener);


        // save new position
        draggable.savePosition();
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
     * 
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