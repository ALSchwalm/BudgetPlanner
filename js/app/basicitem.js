/**
 * A module which defines the 'rows' which are placed in the EquipmentWidget
 * @module app/basicitem
 */
define(["jquery"], function(jquery){
    "use strict"

    /**
     * Type which defines a simple line item for a widget
     * @alias module:app/basicitem
     *
     * @param {DOM Element} elem - The element to fill with this item
     * @param {EquipmentWidget} widget - The widget owning this element
     * @param {Moment} start - Start time of this item
     * @param {Moment} end - End time of this item
     * @param {object} config - Restore this item from the given config
     */
    var BasicItem = function() {}

    /**
     * Initialize this item. This function will be invoked after the body
     * div has been populated but before it is inserted into the DOM.
     */
    BasicItem.prototype.init = function() {
        this.body.find('.item-remove').click(function(){
            this.body.remove();
            this.parent.removeItem(this);
        }.bind(this));

        this.body.find('.item-cost')
            .keyup(this.update.bind(this));
    }

    /**
     * Get an object which can be used to restore this item to a prior state
     */
    BasicItem.prototype.save = function() {
        return {
            name : this.body.find(".item-name").val(),
            cost : this.body.find(".item-cost").val(),
            year : this.body.find(".item-year").val()
        };
    }

    /**
     * Restore this item to the state specified by 'config'
     *
     * @param {object} config - The configuration object
     */
    BasicItem.prototype.restore = function(config) {
        this.start = this.parent.start;
        this.end = this.parent.end;
        this.updateDuration(this.start, this.end);
        this.body.find(".item-name").val(config.name);
        this.body.find(".item-cost").val(config.cost);
        this.body.find(".item-year").val(config.year);
        this.update();
    }

    BasicItem.prototype.update = function() {
    }

    /**
     * Make this item able to represent the duration start-end
     *
     * @param {Moment} start - New start time of the item
     * @param {Moment} end - New end time of the item
     */
    BasicItem.prototype.updateDuration = function(start, end) {
        this.start = start;
        this.end = end;

        var years = 1 + (end.year() - start.year());
        while(this.body.find(".item-year option").length != years) {
            if (this.body.find(".item-year option").length > years) {
                this.removeYear();
            } else {
                this.addYear();
            }
        }
    }


    /**
     * Add a year to this item's display
     */
    BasicItem.prototype.addYear = function() {
        var year = this.body.find(".item-year option").length;
        this.body.find(".item-year").append(
            $("<option>").attr("value", year).text("Year " + (year+this.start.year()))
        );
    }

    /**
     * Remove a year from this item's display
     */
    BasicItem.prototype.removeYear = function() {
        this.body.find(".item-year option:last").remove();
    }

    /**
     * Get the current costs for each year from this item.
     *
     * @returns {Number[]} - An array of numbers, one for each year
     */
    BasicItem.prototype.val = function() {
        var arr = [];
        for (var i=0; i < this.body.find("option").length; ++i) {
            arr.push(0);
        }
        var purchaseYear = parseInt(this.body.find(".item-year").val());
        arr[purchaseYear] = parseFloat(this.body.find('.item-cost').val()) || 0;
        return arr;
    }

    /**
     * Convert this item to an array suitable for being passed to excel-builder
     */
    BasicItem.prototype.serialize = function() {
        var name = this.body.find(".item-name").val();
        var yearCost = this.val();

        var serialized = [
            "", name, "", ""
        ];

        yearCost.forEach(function(year){
            serialized.push('$' + year);
        });

        return serialized;
    }

    return BasicItem;
});
