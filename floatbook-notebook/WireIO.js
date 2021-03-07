class WireIO {

    static pinClass = 'floatbookPin';
    static inputPinClass = 'floatbookInputPin';
    static outputPinClass = 'floatbookOutputPin';

    constructor(cellblock) {
        this.cellblock = cellblock;

        this.inpin = $('<div>');
        this.inpin.addClass(WireIO.pinClass);
        this.inpin.addClass(WireIO.inputPinClass);
        this.cellblock.before(this.inpin);

        this.outpin = $('<div>');
        this.outpin.addClass(WireIO.pinClass);
        this.outpin.addClass(WireIO.outputPinClass);
        this.cellblock.after(this.outpin);


    }

    getWrapper() {
        return this.wrapper;
    }
}