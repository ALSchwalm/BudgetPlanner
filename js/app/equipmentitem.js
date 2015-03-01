/**
 * A module which defines the 'rows' which are placed in the EquipmentWidget
 * @module app/equipmentitem
 */
define(["jquery"], function(jquery){
    "use strict"

    /**
     * Type which defines a line in the equipment widget
     * @alias module:app/equipmentitem
     *
     * @param {EquipmentWidget} widget - The widget owning this element
     * @param {DOM Element} elem - The element to fill with this item
     */
    var EquipmentItem = function(elem, widget) {
        this.parentWidget = widget;
        this.body = $("<div>")
            .load("bodies/equipmentitem.html",
                  null, this.init.bind(this));
        elem.append(this.body);
        return this;
    }

    /**
     * Initialize this item. This function will be invoked after the body
     * div has been populated but before it is inserted into the DOM.
     */
    EquipmentItem.prototype.init = function() {
        this.body.find('.item-remove').click(function(){
            this.body.remove();
            this.parentWidget.removeItem(this);
        }.bind(this));

        this.body.find('.equipment-cost')
            .keyup(this.update.bind(this));
    }

    EquipmentItem.prototype.update = function() {
        var price = parseFloat(this.body.find('.equipment-cost').val()) || 0;
        this.body.find('.total').html(price);
    }

    /**
     * Convert this item to an array suitable for being passed to excel-builder
     */
    EquipmentItem.prototype.serialize = function() {
        return [];
    }

    return EquipmentItem;
});
