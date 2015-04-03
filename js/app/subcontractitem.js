/**
 * A module which defines the 'rows' which are placed in the EquipmentWidget
 * @module app/equipmentitem
 */
define(["jquery", "app/basicitem"], function(jquery, BasicItem){
    "use strict"

    /**
     * Type which defines a line in the SubContract widget
     * @alias module:app/SubContractitem
     *
     * @param {DOM Element} elem - The element to fill with this item
     * @param {SubContractWidget} widget - The widget owning this element
     * @param {Moment} start - Start time of this item
     * @param {Moment} end - End time of this item
     * @param {object} config - Restore this item from the given config
     */
    var SubContractItem = function(elem, widget, start, end, config) {
        this.parent = widget;
        this.start = start;
        this.end = end;
        this.body = $("<div>")
            .load("bodies/basicitem.html",
                  null,
                  function(){
                      this.init();
                      this.updateDuration(start, end);
                      if (config)
                          this.restore(config);
                  }.bind(this));
        elem.append(this.body);
        return this;
    }

    SubContractItem.prototype = new BasicItem();
    SubContractItem.prototype.itemName = "Subcontract";

    return SubContractItem;
});
