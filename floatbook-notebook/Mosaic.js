Mosaic = {}

/**
 * from a mosaic data array, recurse down the tree creating
 * groups as necessary
 * @param {Object} cell
 * @param {Jquery element} parentgroup
 * @param {Integer} index
 */
Mosaic.recurseCreateMosaic = function(cell, parentgroup, index=0) {
    if ( cell.metadata.mosaic == undefined || cell.metadata.mosaic[index] == undefined ) {
        (parentgroup).append(cell.element);
        return parentgroup;
    }
    let newgroup = parentgroup.children(`.mosaicgroup[data-mosaicnumber=${cell.metadata.mosaic[index]}]`);
    if (newgroup.length < 1) { // create the group if it doesn't exist yet
        newgroup = groupUtils.createnewgroupin(group);
        newgroup.attr('data-mosaicnumber', cell.metadata.mosaic[index]);
        parentgroup.append(newgroup);
    }
    return recursecreatemosaic(cell, newgroup, index+1);
}

/**
 * mosaiccollapseobserver detects when a mosaicgroup is emptied and removes it ( collapses redundant groups )
 */
Mosaic.collapseObserver = function(mutations, observer) {
    for ( let mutation of mutations ) {
        if ( mutation.removedNodes.length > 0 ) {
            this.removeIfRedundant(mutation.target);
        }
    }
}
// observes when a group is emptied and deletes it
Mosaic.mosaiccollapseobserver = new MutationObserver(Mosaic.collapseObserver);


/** gets rid of wrapped/nested groups, or empty groups */
Mosaic.removeIfRedundant = function(group) {
    console.log(group, $(group).children('.cell, .mosaicgroup'))
    if ( $(group).children('.cell, .mosaicgroup').length <= 1) {
        console.log('removing', group);
        $(group).children('.mosaicgroup').children().unwrap();
        $(group).children().unwrap();
        // TODO: should call saveMosaicPosition to save the fixed redundancy
    }
}

Mosaic.createGroupIn = function(parentgroup) {
    let mosaicnumber = 0;
    // while there is already a mosaicgroup in group with mosaicnumber mosaicnumber
    while ( group.find(`.mosaicgroup[data-mosaicnumber=${mosaicnumber}]`).length > 0 ) {
        mosaicnumber++;
    }
    // // if group is empty use it instead (don't nest groups with nothing else)
    // if ( group.find('.cell, .mosaicgrid').length <= 0 ) return group;
    // create a new subgroup with the mosaicnumber
    const subgroup = $('<div>').addClass('mosaicgroup').attr('data-mosaicnumber', mosaicnumber);
    // subgroup has opposite direction of group
    if ( group.hasClass('mosaicrow') )      subgroup.addClass('mosaiccol');
    else if ( group.hasClass('mosaiccol') ) subgroup.addClass('mosaicrow');
    else subgroup.addClass('mosaicrow');

    // add mosaiccollapseobserver to remove the group when it is emptied
    Mosaic.mosaiccollapseobserver.observe(subgroup.get(0), {
        subtree: false,
        attributes: false,
        childList: true,
    });
    return subgroup;
}