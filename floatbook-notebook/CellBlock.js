class CellBlock {
    constructor () {

    }

    /**
     * manages when sourceElement is dropped on destinationElement
     * @param {Jquery element} sourceElement 
     * @param {Jquery element} destinationElement 
     */
    static onDrop(event, sourceElement, destinationElement) {

    }

    /**
     * manages when sourceElement is dragged over destinationElement
     * @param {Jquery element} sourceElement 
     * @param {Jquery element} destinationElement 
     */
    static onDragOver(event, sourceElement, destinationElement) {
        destinationElement = $(destinationElement);

        let desinationCell = destinationElement.closest('.cell');
        // dropping on another cell (= definition in if statement intentional)
        if ( destinationCell.length > 0 ) {
            
            let destinationBlock = destinationCell.closest('.cellblock');
            if ( destinationBlock.length > 0 ) {
                let dropPos, dropWin;
                
                if ( destinationBlock.hasClass('cellblockrow') ) {
                    dropPos = event.pageX - destinationCell.offset().left;
                    dropWin = destinationCell.outerWidth();
                } else {
                    dropPos = event.pageY - destinationCell.offset().top;
                    dropWin = destinationCell.outerHeight();
                }

                if ( dropPos > 0.5*dropWin ) {
                    insert = 'after'
                } else {
                    insert = 'before'
                }
            }

        }
        // dropping on empty space
        else if ( destinationElement.is(FloatBook.notebookroot) ) {
            sourceElement.appendTo(FloatBook.cellroot);
        }
        else {
            // who knows what they're dragging over??
        }
    }
}

// return CellBlock;