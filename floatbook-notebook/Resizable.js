Resizable = {}

/**
 * 
 * @param {Object} cell 
 */
Resizable.makeResizable = function(cell) {
    element = $(cell.element);

    element.addClass('floatbookresizable');

//     element.css({
//         resize: 'horizontal',
//         overflowX: 'auto',
//         overflowY: 'none',
//         minWidth: 300,
//         width: Resizable.getSize(cell).width
//     });
    Resizable.setSize(element, Resizable.loadSize(element));

    
    // using jquery ui
    element.resizable({
        handles: 'e, w'
    });

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