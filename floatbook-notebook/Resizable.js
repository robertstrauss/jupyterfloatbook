Resizable = {}

/**
 * 
 * @param {Object} cell 
 */
Resizable.makeResizable = function(cell) {
    element = $(cell.element);

    element.addClass('floatbookresizable');

    Resizable.setSize(element, Resizable.loadSize(element));

    
    // using jquery ui
    element.resizable({
        handles: 'e, w'
    });


    element.on('mousedown', function (event) {

        // stop when mouse is released
        document.addEventListener('mouseup',   endResize);
    });

    function onResize(event) {

    }

    function endResize(event) {
        // Resizable.saveWidth(cell);
        Resizable.saveSize(element);
    }


}

/**
 * 
 * @param {Jquery element} block
 */
Resizable.saveSize = function(block) {
    
    let index = $('.floatblock').index(block); // get the index of this block
    
    let metadata = FloatBook.getMetadata();
    if ( metadata.floatsizes == undefined ) {
        metadata.floatsizes = [];
    }
    metadata.floatsizes[index] = Resizable.getSize(block);
    
    FloatBook.setMetadata(metadata);
//     if ( cell.metadata.floatbook == undefined ) cell.metadata.floatbook = {};

//     cell.metadata.floatbook.floatwidth = cell.element.css('width');

//     Jupyter.notebook.set_dirty();
}


/**
 * 
 * @param {Jquery element} element
 */
Resizable.loadSize = function(element) {
    let index = $('.floatblock').index(element); // get the index of this block
    
    let metadata = FloatBook.getMetadata();
    if ( metadata.floatsizes == undefined ) {
        metadata.floatsizes = [];
        FloatBook.setMetadata(metadata);
        console.log('Size for block not found in metadata.');
    }
    return metadata.floatsizes[index] || Resizable.getSize(element);
    
}


/**
 * 
 * @param {Jquery element} element
 */
Resizable.getSize = function(element) {
    return {
        width: element.outerWidth(),
    };
}

/**
 *
 * @param {Jquery element} block
 */
Resizable.setSize = function(block, size) {
    block.css({
        width: size.width
    });
}