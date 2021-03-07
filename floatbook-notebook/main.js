define([
    'base/js/namespace',
    'base/js/events',
    'require',

    './CellBlock',
    './CellDraggable',
    './Draggable',
    './Floatable',
    './FloatBook',
    './Mosaic',
    './Resizable',
    './WireIO'

    // './plain-draggable.min'
], function (Jupyter, events, requirejs) {

// add stylesheet
$('head').append($('<link>').
    attr('href', requirejs.toUrl('./style.css')).
    attr('rel', 'stylesheet').
    attr('type', 'text/css')    
);


// should be on a notebook loaded event, but that doesn't currently work
setTimeout(function main() {
    new FloatBook(Jupyter, events);
}, 500);


console.log('running!');



});