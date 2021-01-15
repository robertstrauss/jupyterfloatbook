Draggable = {}


/**
 * 
 * @param {Object} cell 
 */
Draggable.makeDraggable = function(cell){
    let element = $(cell.element); // using jquery
    console.log('elem', element);
    
    // style draggable elements
    element.addClass('floatbookdraggable');

    element.css({
        background: 'white',
        // width: element.outerWidth(), // same width as original element
        position: 'absolute', // so it can move around freely
        // get pre existing position from metadata
        top: Draggable.getPosition(cell).top,
        left: Draggable.getPosition(cell).left
    })

    element.on('mousedown', beginDrag);

    whitelist = '.prompt_container';

    let initialx, initialy, initialtop, initialleft;
    function beginDrag(event) {
        console.log(event.target);
        console.log('dragelem', element);
        // only activate if clicking on the correct element
        if ( $(event.target).closest(whitelist).length < 1 ) {
            return;
        }
        event.preventDefault();

        // save event position
        initialx = event.clientX;
        initialy = event.clientY;

        // save cell position
        initialtop  = parseFloat(element.css('top'));
        initialleft = parseFloat(element.css('left'));

        // add drag listener
        document.addEventListener('mousemove', onDrag);
        // stop when mouse is released
        document.addEventListener('mouseup',   endDrag);

    }



    function onDrag(event) {
        event.preventDefault();
        
        // move element to mouse
        element.css('top',  initialtop  - initialy + event.clientY);
        element.css('left', initialleft - initialx + event.clientX);

    }



    function endDrag(event) {
        // stop the dragging
        document.removeEventListener('mousemove', onDrag);

        Draggable.savePosition(cell);
    }
}



/**
 * 
 * @param {Object} cell 
 */
Draggable.savePosition = function(cell) {
    // if ( cell.element.hasClass('cell') ) {
        if ( cell.metadata.floatbook == undefined ) cell.metadata.floatbook = {};

        cell.metadata.floatbook.floatposition = [
            cell.element.css('top'),
            cell.element.css('left')
        ];

        Jupyter.notebook.set_dirty();
    // } else if ( cell.element.hasClass('block') ) {

    // }
}

/**
 * 
 * @param {Object} cell 
 */
Draggable.getPosition = function(cell) {
    // current position in DOM
    csspos = {
        top:  cell.element.css('top'),
        left: cell.element.css('left')
    }

    if ( cell.metadata.floatbook == undefined ) {
        return csspos;
    }

    // position according to metadata
    pos = cell.metadata.floatbook.floatposition;

    if ( pos == undefined ) {
        return csspos;
    } else {
        return {
            top:  pos[0],
            left: pos[1]
        }
    }
}