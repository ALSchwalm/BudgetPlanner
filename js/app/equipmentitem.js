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
     * @param {Number} year - The number of years to account for
     */
    var EquipmentItem = function(elem, widget, year) {
        this.parentWidget = widget;
        this.body = $("<div>")
            .load("bodies/equipmentitem.html",
                  null,
                  function(){
                      this.init();
                      for (var i=0; i < year; ++i)
                          this.addYear();
                  }.bind(this));
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
    }

    /**
     * Add a year to this item's display
     */
    EquipmentItem.prototype.addYear = function() {
        var year = this.body.find(".equipment-year option").length;
        this.body.find(".equipment-year").append(
            $("<option>").attr("value", year).text("Year " + (year+1))
        );
    }

    /**
     * Remove a year from this item's display
     */
    EquipmentItem.prototype.removeYear = function() {
        this.body.find(".equipment-year option:last").remove();
    }

    /**
     * Get the current costs for each year from this item.
     *
     * @returns {Number[]} - An array of numbers, one for each year
     */
    EquipmentItem.prototype.val = function() {
        var arr = [];
        for (var i=0; i < this.body.find("option").length; ++i) {
            arr.push(0);
        }
        var purchaseYear = parseInt(this.body.find(".equipment-year").val());
        arr[purchaseYear] = parseFloat(this.body.find('.equipment-cost').val()) || 0;
        return arr;
    }

    /**
     * Convert this item to an array suitable for being passed to excel-builder
     */
    EquipmentItem.prototype.serialize = function() {
        return [];
    }

    return EquipmentItem;
});
