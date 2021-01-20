class Resizable {

    /**
     * 
     * @param {Object} cell 
     */
    constructor(cell, element) {
        this.cell = cell;
        if ( element == undefined ) {
            this.element = this.cell.element;
        } else {
            this.element = element;
        }

        this.element.addClass('floatbookresizable');

        this.setSize(this.loadSize());

        
        // using jquery ui
        this.element.resizable({
            handles: 'e, w'
        });

        let resizable = this;
        this.element.on('mousedown', function (...args) {
            resizable.beginResize(resizable, ...args)
        });
    }


    beginResize(resizable, event) {
            // stop when mouse is released
            document.addEventListener('mouseup',   function(...args){
                resizable.endResize(resizable, ...args);
            });
    }

    
    onResize(resizable, event) {

    }

    endResize(resizable, event) {
        // Resizable.saveWidth(cell);
        resizable.saveSize();
    }


    /**
     * 
     */
    saveSize() {
        this.cell.metadata.floatsize = this.getSize();
        
        Jupyter.notebook.set_dirty();
    //     if ( cell.metadata.floatbook == undefined ) cell.metadata.floatbook = {};

    //     cell.metadata.floatbook.floatwidth = cell.element.css('width');

    //     Jupyter.notebook.set_dirty();
    }


    /**
     * 
     */
    loadSize() {
        return this.cell.metadata.floatsize || this.getSize();
    }


    /**
     * 
     */
    getSize() {
        return {
            width: this.element.outerWidth(),
        };
    }

    /**
     *
     */
    setSize(size) {
        this.element.css({
            width: size.width
        });
    }

}