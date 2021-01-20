class WireIO {
    constructor(element) {
        this.element = element;

        this.wrapper = $('<div>');
        this.element.after(this.wrapper);
        this.element.appendTo(this.wrapper);

        this.wrapper.css({
            border: '10px solid red'
        });
    }

    getWrapper() {
        return this.wrapper;
    }
}