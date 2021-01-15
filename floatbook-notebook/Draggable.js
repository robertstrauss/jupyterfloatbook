Draggable = {}



Draggable.makeDraggable = function(element){
    element = $(element); // using jquery
    
    // style draggable elements
    element.addClass('floatbookdraggable');

    element.css({
        background: 'white',
        width: element.outerWidth()
    })

    element.on('mousedown', beginDrag);

    whitelist = '.prompt_container';

    let initialx, initialy, initialtop, initialleft;
    function beginDrag(event) {
        console.log(event.target);
        // only activate if clicking on the correct element
        if ( $(event.target).closest(whitelist).length < 1 ) {
            return;
        }
        event.preventDefault();

        // save event position
        initialx = event.clientX;
        initialy = event.clientY;

        // absolute position so it can move around anywhere
        element.css('position', 'absolute');

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

    }
}