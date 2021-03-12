class WireIO {

    static pinClass = 'floatbook-wirepin';
    static inputPinClass = 'floatbook-inputpin';
    static outputPinClass = 'floatbook-outputpin';
    static wireClass = 'floatbook-wire';
    
    static pinsFromWire = {};

    

    constructor(cellblock) {
        this.cellblock = cellblock;
    
        // input pin
        this.inpin = this.makePin();
        this.inpin.addClass(WireIO.inputPinClass);
        this.cellblock.append(this.inpin);
        
        this.inwire = WireIO.makeWire();

        
        
        // output pin
        const outpin = this.makePin();
        outpin.addClass(WireIO.outputPinClass);
        this.cellblock.append(outpin);
        
        this.outwire = WireIO.makeWire();
        
    }

    makePin(){
        const pin = $('<div>');
        pin.addClass(WireIO.pinClass);
        pin.on('mousedown', e => WireIO.beginDragWire(this, e));
        return pin;
    }

    static beginDragWire(wireio, event) {
        // create wire
//         const wire = WireIO.makeWire();
//         WireIO.pinsFromWire[wire] = [pin];
        // run the drag once with the click coordinates
//         wireio.dragWire(wireio, event);
        
        wireio.wire = wireio.outwire;
        
        wireio.pin = $(event.target).closest(`.${WireIO.pinClass}`);
        wireio.pincoords = FloatBook.pageToCellRootCoords(wireio.pin.offset().top,
                                                          wireio.pin.offset().left);
        wireio.pincoords.top += wireio.pin.outerHeight()/2;
        wireio.pincoords.left += wireio.pin.outerWidth()/2;
        // add drag listeners
        document.onmousemove = e => WireIO.dragWire(wireio, e);
        document.onmouseup = e => WireIO.endDragWire(wireio, e);
    }

    static dragWire(wireio, event) {
        // get the pin wire is dragging from
//         const pin = WireIO.pinsFromWire[wire][0];
        // get pin and mouse coordinates
        
        
        // either attach wire end to mouse or pin that mouse is over
        wireio.dropPin = $(document.elementFromPoint(event.pageX, event.pageY)).closest(`.${WireIO.pinClass}`);
        if ( wireio.dropPin.length > 0 ) {
            wireio.endcoords = FloatBook.pageToCellRootCoords(wireio.dropPin.offset().top,
                                                              wireio.dropPin.offset().left);
            wireio.endcoords.top  += wireio.dropPin.outerHeight()/2;
            wireio.endcoords.left += wireio.dropPin.outerWidth()/2;
        } else {
            wireio.endcoords = FloatBook.pageToCellRootCoords(event.pageY, event.pageX);
        }
                
        // move the wire
        WireIO.drawWire(wireio.pincoords.left, wireio.pincoords.top, wireio.endcoords.left, wireio.endcoords.top, false, wireio.wire);
    }

    static endDragWire(wireio, event) {
        // remove listeners for dragging
        document.onmousemove = null;
        document.onmouseup = null;
    }
        
    static beginWireDrag(pin, event) {
        this.startPin = pin;
                
        this.wire = WireIO.makeWire();
        
        
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
    }
    
    updateWires() {
        let pins, pos1, pos2;
        for ( let wire of this.attachedWires ) {
            pins = WireIO.pinFromWire[wire];
            pos1 = FloatBook.pageToCellRootChords(pins[0].offset());
            pos2 = FloatBook.pageToCellRootChords(pins[1].offset());
            WireIO.drawWire(pos1.left, pos1.top, pos2.left, pos2.top, false, wire);
        }
    }

    onDrag(event) {
        const dragcoords = FloatBook.pageToCellRootCoords(event.pageY, event.pageX);
        this.setWirePos(dragcoords.left, dragcoords.top);
        
    }

    endDrag(event) {
        document.removeEventListener('mousemove', this.dragListener);
    }
    
    static makeWire() {
        const wire = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
        wire.attr({
            stroke: 'black',
            strokeWidth: 3,
            fill: 'transparent',
        });
        wire.addClass(WireIO.wireClass);
        wire.appendTo(FloatBook.wireplane);
        return wire;
    }

    static drawWire(startx, starty, endx, endy, horizontal, wire=undefined) {
        if ( wire == undefined ) {
            wire = WireIO.makeWire();
        }
        // TODO add horizontal functionality
        wire.attr('d', `M ${startx} ${starty}
                     C 
                        ${startx} ${(endy+starty)/2}, 
                        ${startx} ${(endy+starty)/2},
                        ${(endx+startx)/2} ${(endy+starty)/2}
                      S
                         ${endx} ${(endy+starty)/2}
                         ${endx} ${endy}
                    `);
        return wire;
    }
    
}