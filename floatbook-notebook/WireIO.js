class WireIO {

    static pinClass = 'floatbook-wirepin';
    static inputPinClass = 'floatbook-inputpin';
    static outputPinClass = 'floatbook-outputpin';
    static wireClass = 'floatbook-wire';

    constructor(cellblock) {
        this.cellblock = cellblock;
    
        // input pin
        this.inpin = $('<div>');
        this.inpin.addClass(WireIO.pinClass);
        this.inpin.addClass(WireIO.inputPinClass);
        this.cellblock.append(this.inpin);
        const that = this;
        this.inpin.on('mousedown', function(e) {
            return that.beginWireDrag(that.inpin, e);
        });
        
        
        // output pin
        this.outpin = $('<div>');
        this.outpin.addClass(WireIO.pinClass);
        this.outpin.addClass(WireIO.outputPinClass);
        this.cellblock.append(this.outpin);
        this.outpin.on('mousedown', function(e) {
            return that.beginWireDrag(that.outpin, e);
        });
        
        this.dragListener = function(e) {
            that.onDrag(e);
        }
    }

    beginWireDrag(pin, event) {
        this.startPin = pin;
                
        this.wire = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
        this.wire.attr({
            stroke: 'black',
            strokeWidth: 3,
            fill: 'transparent',
        });
        this.wire.addClass(WireIO.wireClass);
        this.wire.appendTo(FloatBook.wireplane);
        
        
        this.startx = parseFloat(this.startPin.css('left'))
                        + parseFloat(this.startPin.parent(`.${CellBlock.className}`).css('left'))
                        + this.startPin.outerWidth()/2;
        this.starty = parseFloat(this.startPin.css('top')) 
                        + parseFloat(this.startPin.parent(`.${CellBlock.className}`).css('top'))
                        + this.startPin.outerHeight()/2;
        
        this.wire.attr('d', `M ${this.startx} ${this.starty} C ${0} ${1}, ${2} ${3}, ${4} ${5}`);
        
        document.addEventListener('mousemove', this.dragListener);
        const that = this;
        document.addEventListener('mouseup', function(e){
            that.endDrag(e);
        });
        
        this.wire.html('nothing');
    }

    onDrag(event) {
        this.wire.attr('d', `M ${this.startx} ${this.starty} C ${this.startx+10} ${this.starty+10}, ${2} ${3}, ${event.pageX} ${event.pageY}`);
        
    }

    endDrag(event) {
        document.removeEventListener('mousemove', this.dragListener);
    }
    
}