Floatable = {}

/**
 * 
 * @param {Jquery Element} element 
 */
Floatable.float = function(element) {
    Draggable.makeDraggable(element);
    // draggable = new PlainDraggable(element.get(0), {
    //     autoScroll: $('#site').get(0),
    //     containment: $('#site').get(0)
    // })
    // draggable.autoScroll = $('#site').get(0);
    // draggable.containment = $('#site').get(0);
    // draggable.handle =
    Resizable.makeResizable(element);

    // using jquery ui
//     element = $(element); // make sure element is jquery
    
    
}