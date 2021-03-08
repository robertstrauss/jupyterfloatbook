class CellBlock {
    static className = 'floatbook-cellblock';
    static colClass = 'cellblockcolumn';
    static rowClass = 'cellblockrow';
    static UID = 0;

    static dataAttrTag = 'data-floatbook-cb-uid';
    static setUID(element, uid) {
        element.attr(CellBlock.dataAttrTag, uid);
    }
    static getUID(element) {
        return element.attr(CellBlock.dataAttrTag);
    }

    static getNewUID() {
        return Math.floor((Math.random() * 1e9));
    }

    static getCellBlock(uid) {
        return $(`.${CellBlock.className}[${CellBlock.dataAttrTag}=${uid}]`);
    }

    /**
     * collapseobserver detects when a cellblock is emptied and removes it
     */
    // static collapseobserver = new MutationObserver(function(mutations, observer) {
    //     for ( let mutation of mutations ) {
    //         if ( mutation.removedNodes.length > 0 ) {
    //             if ( $(mutation.target).closest(CellBlock.className).children('.cell').length < 1 ) {
    //                 $(mutation.target).closest(CellBlock.className).remove();
    //             }
    //         }
    //     }
    // });

    static makeCellBlock() {
        const element = $('<div>');
        element.addClass(CellBlock.className);
        element.addClass(CellBlock.colClass);
        element.css({
            display: 'inline-block',
            position: 'absolute',
            flexFlow: 'column'
        });

        const uid = CellBlock.getNewUID();
        CellBlock.setUID(element, uid);

        // CellBlock.collapseobserver.observe(element.get(0), {
        //     subtree: false,
        //     attributes: false,
        //     childList: true,
        // });

        element.appendTo(FloatBook.cellroot);
        
        return element;
    }

    static loadCellBlock(id) {
        const element = CellBlock.makeCellBlock();
        CellBlock.setUID(element, id);

        const metadata = Jupyter.notebook.metadata.floatbook.cellblocks[id];
        
        if ( metadata == undefined ) {
            return element;
        }
        
        if ( metadata.position !== undefined ) {
            element.css({
                top: metadata.position.top,
                left: metadata.position.left
            });
        }

        return element;
    }




    static saveBlockData(element) {
        // get block id
        const id = CellBlock.getUID(element);

        // create entry if metadata is undefined
        if ( Jupyter.notebook.metadata.floatbook.cellblocks[id] == undefined ) {
            Jupyter.notebook.metadata.floatbook.cellblocks[id] = {}
        }

        // set position in metadata
        Jupyter.notebook.metadata.floatbook.cellblocks[id].position = {
            top: element.css('top'),
            left: element.css('left')
        };

        // delete it if empty
        if ( element.children('.cell').length < 1 ) {
            element.remove();
            delete Jupyter.notebook.metadata.floatbook.cellblocks[id];
        }

        // mark notebook as needing to be saved to file
        Jupyter.notebook.set_dirty();
    }

    static saveCellData(cell) {
        // get the block the cell is in
        const block = cell.element.closest(`.${CellBlock.className}`);

        // create floatbook entry in metadata if needed
        if ( cell.metadata.floatbook == undefined ) {
            cell.metadata.floatbook = {};
        }

        // write block id to cell's metadata
        cell.metadata.floatbook.cellblockid = CellBlock.getUID(block);
    }





    // static placeIn(cell, block) {
    //     cell.element.appendTo(block);
    //     cell.metadata.floatbook.cellblockid = CellBlock.getUID(block);
    // }

    static placeCell(cell) {
        let cellblock;
        
        // retrieve cellblock from DOM if it is already part of one
        if ( cell.metadata.floatbook.cellblockid !== undefined ) {
            cellblock = CellBlock.getCellBlock(cell.metadata.floatbook.cellblockid);
            // if its not in the document yet, we load it in
            if ( cellblock.length < 1 ) {
                cellblock = CellBlock.loadCellBlock(cell.metadata.floatbook.cellblockid);
            }
        }
        // if it isn't reserved to a cellblock in the file
        else {
            console.log('no cbid!', cell.element, cell.metadata.floatbook.cellblockid)
            cellblock = CellBlock.makeCellBlock();
            // move cell block to where cell was
            // console.log(cell, cell.element.offset());
            cellblock.css({
                top: cell.element.offset().top,
                left: cell.element.offset().left
            });

            cell.metadata.floatbook.cellblockid = CellBlock.getUID(cellblock);
            Jupyter.notebook.set_dirty();
        }

        // add the cell to the block
        cellblock.prepend(cell.element);

    }
}