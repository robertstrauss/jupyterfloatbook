class CellBlock {
    static className = 'floatbookcellblock';
    static UID = 0;

    static getNewUID() {
        // let uid = CellBlock.UID;
        // while ( $(`[data-cellblockuid=${uid}]`).length > 0 ) {
        //     uid++;
        //     CellBlock.UID++;
        // }
        // return uid;
        return Math.floor((Math.random() * 1e9));
    }

    static getCellBlock(uid) {
        let elem = $(`[${CellBlock.dataAttrTag}=${uid}]`);
        // if ( elem.length < 1 ) {
        //     elem = CellBlock.makeCellBlock(uid);
        // }
        return elem;
    }

    /**
     * collapseobserver detects when a cellblock is emptied and removes it
     */
    static collapseobserver = new MutationObserver(function(mutations, observer) {
        for ( let mutation of mutations ) {
            if ( mutation.removedNodes.length > 0 ) {
                if ( $(mutation.target).closest(CellBlock.className).children('.cell').length < 1 ) {
                    $(mutation.target).closest(CellBlock.className).remove();
                }
            }
        }
    });

    static makeCellBlock(uid=undefined) {
        const element = $('<div>');
        element.addClass(CellBlock.className);
        element.css({
            display: 'inline-block',
            position: 'absolute',
        });

        if ( uid == undefined ) {
            uid = CellBlock.getNewUID();
        }
        CellBlock.setUID(element, uid);

        CellBlock.collapseobserver.observe(element.get(0), {
            subtree: false,
            attributes: false,
            childList: true,
        });
        
        return element;
    }

    static dataAttrTag = 'data-floatbook-cb-uid';
    static setUID(element, uid) {
        element.attr(CellBlock.dataAttrTag, uid);
    }
    static getUID(element) {
        return element.attr(CellBlock.dataAttrTag);
    }
}