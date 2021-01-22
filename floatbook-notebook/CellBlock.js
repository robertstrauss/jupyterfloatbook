class CellBlock {
    static className = 'floatbookcellblock';
    static UID = 0;

    static getNewUID() {
        let uid = CellBlock.UID;
        while ( $(`[data-cellblockuid=${uid}]`).length > 0 ) {
            uid++;
            CellBlock.UID++;
        }
        return uid;
    }

    static getCellBlockElement(uid) {
        let elem = $(`[data-cellblockuid=${uid}]`);
        if ( elem.length < 1 ) {
            const cellblock = CellBlock.makeCellBlock(uid);
            elem = cellblock.getElement();
        }
        return elem;
    }

    /**
     * collapseobserver detects when a cellblock is emptied and removes it
     */
    static collapseobserver = new MutationObserver(function(mutations, observer) {
        for ( let mutation of mutations ) {
            if ( mutation.removedNodes.length > 0 ) {
                if ( mutation.target.closest(CellBlock.className).children('.cell').length < 1 ) {
                    mutation.target.closest(CellBlock.className).remove();
                }
            }
        }
    });

    static makeCellBlock(uid=undefined) {
        this.element = $('<div>');
        this.element.addClass(CellBlock.className);

        if ( uid == undefined ) {
            uid = CellBlock.getNewUID();
        }
        this.setUID(uid);
        this.element.attr('data-cellblockuid', uid);


        CellBlock.collapseobserver.observe(this.element.get(0), {
            subtree: false,
            attributes: false,
            childList: true,
        });
    }
}