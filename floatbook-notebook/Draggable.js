class Draggable {
    static className = 'floatbookdraggable';

    /**
     * defines listeners for dragging on element by handle with buttons.
     * @param {Element} element 
     * @param {Function} beginDrag 
     * @param {Function} onDrag 
     * @param {Function} endDrag 
     * @param {Selector or Element} handle 
     * @param {Array<Integer>} buttons 
     */
    constructor(
        element,
        beginDrag=()=>{},
        onDrag=()=>{},
        endDrag=()=>{},
        handle=undefined,
        buttons=undefined
    ) {
        this.element = $(element);

        // style draggable elements
        this.element.addClass(Draggable.className);

        this.clientBeginDrag = beginDrag;
        this.clientOnDrag = onDrag;
        this.clientEndDrag = endDrag;

        this.handle = handle;

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
        // left button only
        if ( draggable.buttons !== undefined ) {
            console.log(draggable.buttons, event.button);
            if ( draggable.buttons.indexOf(event.button) < 0 ) {
                return;
            }
        }

        if ( draggable.handle !== undefined ) {
            console.log(draggable.handle);
            // only activate if clicking on the correct element
            if ( $(event.target).closest($(draggable.handle)).length < 1 ) {
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