Resizable = {}

/**
 * 
 * @param {Object} cell 
 */
Resizable.makeResizable = function(cell) {
    element = $(cell.element);

    element.addClass('floatbookresizable');

    element.css({
        resize: 'horizontal',
        overflow: 'auto',
        minWidth: 300,
        width: Resizable.getWidth(cell)
    })

    // let resizecontainer = $('<div>');

    // resizecontainer.addClass('floatbookresizecontainer');
    // resizecontainer.css({
    //     // position: 'absolute',
    //     // top: element.css('top'),
    //     // left: element.css('left'),
    //     width: element.outerWidth(),
    //     height: element.outerHeight(),
    //     padding: '10px solid rgba(0,100,255,0.2)', // borders are what is grabbed to resize
    //     boxSizing: 'content-box', // borders extend outside element
    // });

    // element.wrap(resizecontainer);

    // // console.log('ow', element.outerWidth);

    // resizecontainer.resizable({ // resizable using jquery UI
    //     alsoresize: element, // actual element is resized with it
    //     handles: 'e, w', // can be resized horizontally only
    //     minWidth: 300, // px
    // });

    // element.wrap(resizecontainer);


    element.on('mousedown', beginResize);

    function beginResize(event) {

        // stop when mouse is released
        document.addEventListener('mouseup',   endResize);
    }

    function onResize(event) {

    }

    function endResize(event) {
        Resizable.saveWidth(cell);
    }


}

/**
 * 
 * @param {Object} cell 
 */
Resizable.saveWidth = function(cell) {
    if ( cell.metadata.floatbook == undefined ) cell.metadata.floatbook = {};

    cell.metadata.floatbook.floatwidth = cell.element.css('width');

    Jupyter.notebook.set_dirty();
}


/**
 * 
 * @param {Object} cell 
 */
Resizable.getWidth = function(cell) {
    // current position in DOM
    csswidth = cell.element.css('width');

    if ( cell.metadata.floatbook == undefined ) {
        return csswidth;
    }

    // position according to metadata
    width = cell.metadata.floatbook.floatwidth;

    if ( width == undefined ) {
        return csswidth;
    } else {
        return width
    }
}