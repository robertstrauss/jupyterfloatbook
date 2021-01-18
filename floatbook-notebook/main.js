define([
    'base/js/namespace',
    'base/js/events',
    'require',

    './CellBlock',
    './Draggable',
    './Floatable',
    './FloatBook',
    './Mosaic',
    './Resizable',

    // './plain-draggable.min'
], function (Jupyter, events, requirejs, cb, d, f, fb) {

// add stylesheet
$('head').append($('<style>').attr('href', requirejs.toUrl('./style.css')));


// should be on a notebook loaded event, but that doesn't currently work
setTimeout(function main() {
    new FloatBook(Jupyter, events);
}, 500);


console.log('running!');



});