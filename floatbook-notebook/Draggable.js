class Draggable {
    static edgepushmargin = 50; // px
    static className = 'floatbookdraggable';

    constructor(cell) {
        this.cell = cell;
        this.element = this.cell.element;

    
        // style draggable elements
        this.element.addClass(Draggable.className);

        this.element.css({
            background: 'white',
            position: 'absolute', // so it can move around freely
        });

        this.moveTo(this.loadPosition().x, this.loadPosition().y);

        this.handle = '.prompt_container';

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
        console.log('draggable', draggable.element);
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
        draggable.dragoffsetx = draggable.getPosition().x - event.pageX + FloatBook.getPan().x;
        draggable.dragoffsety = draggable.getPosition().y - event.pageY + FloatBook.getPan().y;

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
            draggable.dragoffsetx + event.pageX - FloatBook.getPan().x,
            draggable.dragoffsety + event.pageY - FloatBook.getPan().y
        );        
        

        // pan towards mouse if its hovering on the edge
        if ( event.pageY - Draggable.edgepushmargin < FloatBook.view.offset().top ) {
            // dragging near the top edge
            FloatBook.panBy(
                0,
                FloatBook.view.offset().top - event.pageY + Draggable.edgepushmargin
            );
        }
        else if ( event.pageY + Draggable.edgepushmargin
            > FloatBook.view.offset().top + FloatBook.view.innerHeight() ) {
            // dragging near the bottom edge
            FloatBook.panBy(
                0,
                FloatBook.view.offset().top + FloatBook.view.innerHeight() - event.pageY - Draggable.edgepushmargin
            );
        }
        if ( event.pageX - Draggable.edgepushmargin < FloatBook.view.offset().left ) {
            // dragging near the left edge
            FloatBook.panBy(
                FloatBook.view.offset().left - event.pageX + Draggable.edgepushmargin,
                0
            );
        }
        else if ( event.pageX + Draggable.edgepushmargin
            > FloatBook.view.offset().left + FloatBook.view.innerWidth() ) {
            // dragging near the right edge
            FloatBook.panBy(
                FloatBook.view.offset().left + FloatBook.view.innerWidth() - event.pageX - Draggable.edgepushmargin,
                0
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


    getMetadataIndex() {
        return $(`.${Draggable.className}`).index(this.element);
    }

    /**
     * 
     */
    savePosition() {;
        
        let metadata = FloatBook.getMetadata();
        if ( metadata.floatpositions == undefined ) {
            metadata.floatpositions = [];
        }
        console.log('saving', this.getMetadataIndex(), this.getPosition());
        metadata.floatpositions[this.getMetadataIndex()] = this.getPosition();
        
        FloatBook.setMetadata(metadata);
    }


    loadPosition() {
        let metadata = FloatBook.getMetadata();
        if ( metadata.floatpositions == undefined ) {
            metadata.floatpositions = [];
        }
        return metadata.floatpositions[this.getMetadataIndex()] || this.getPosition();
    }

    /**
     * 
     */
    getPosition() {
        // current position in DOM
        return {
            y: parseInt(this.element.css('top')),
            x: parseInt(this.element.css('left'))
        };
    }


    moveTo(x, y) {
        this.element.css({
            top:  y,
            left: x
        });
    }

    moveBy(dx, dy) {
        let pos = Draggable.getPosition(this.element);
        this.moveTo(pos.x+dx, pos.y+dy);
    }


}