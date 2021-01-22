class Draggable {
    static className = 'floatbookdraggable';

    /**
     * defines listeners for dragging on element by handle with buttons.
     * @param {Element} element 
     * @param {Function} beginDrag 
     * @param {Function} onDrag 
     * @param {Function} endDrag 
     * @param {Array<Integer>} buttons 
     */
    constructor(
        element,
        beginDrag=()=>{},
        onDrag=()=>{},
        endDrag=()=>{},
        buttons=undefined
    ) {
        this.element = $(element);

        // style draggable elements
        this.element.addClass(Draggable.className);

        this.clientBeginDrag = beginDrag;
        this.clientOnDrag = onDrag;
        this.clientEndDrag = endDrag;

        this.buttons = buttons;

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
     * @param {MouseEvent} event
     */
    beginDrag(draggable, event) {
        // left/middle/right button only
        if ( draggable.buttons !== undefined ) {
            if ( draggable.buttons.indexOf(event.button) < 0 ) {
                return;
            }
        }

        // run event
        let status = draggable.clientBeginDrag(event);
        if ( status == false || status > 0 ) {
            return status;
        }

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
        draggable.clientOnDrag(event);
    }


    /**
     * 
     * @param {Dragable} draggable
     * @param {MouseEvent} event 
     */
    endDrag(draggable, event) {
        // stop the dragging
        document.removeEventListener('mousemove', draggable.draglistener);

        draggable.clientEndDrag(event);
    }


}