Resizable = {}


Resizable.makeResizable = function(element) {
    element = $(element);

    element.addClass('floatbookresizable');

    element.css({
        resize: 'horizontal',
        overflow: 'auto',
        minWidth: 300
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

    function beginResize(event) {

    }

    function onResize(event) {

    }

    function endResize(event) {

    }


}