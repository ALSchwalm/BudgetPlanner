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
     * @param {DOM Element} elem - The element to fill with this item
     * @param {EquipmentWidget} widget - The widget owning this element
     * @param {Moment} start - Start time of this item
     * @param {Moment} end - End time of this item
     * @param {object} config - Restore this item from the given config
     */
    var EquipmentItem = function(elem, widget, start, end, config) {
        this.parent = widget;
        this.start = start;
        this.end = end;
        this.body = $("<div>")
            .load("bodies/equipmentitem.html",
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

    /**
     * Initialize this item. This function will be invoked after the body
     * div has been populated but before it is inserted into the DOM.
     */
    EquipmentItem.prototype.init = function() {
        this.body.find('.item-remove').click(function(){
            this.body.remove();
            this.parent.removeItem(this);
        }.bind(this));

        this.body.find('.equipment-cost')
            .keyup(this.update.bind(this));
    }

    /**
     * Get an object which can be used to restore this item to a prior state
     */
    EquipmentItem.prototype.save = function() {
        return {
            name : this.body.find(".equipment-name").val(),
            cost : this.body.find(".equipment-cost").val(),
            year : this.body.find(".equipment-year").val()
        };
    }

    /**
     * Restore this item to the state specified by 'config'
     *
     * @param {object} config - The configuration object
     */
    EquipmentItem.prototype.restore = function(config) {
        this.start = this.parent.start;
        this.end = this.parent.end;
        this.updateDuration(this.start, this.end);
        this.body.find(".equipment-name").val(config.name);
        this.body.find(".equipment-cost").val(config.cost);
        this.body.find(".equipment-year").val(config.year);
        this.update();
    }

    EquipmentItem.prototype.update = function() {
    }

    /**
     * Make this item able to represent the duration start-end
     *
     * @param {Moment} start - New start time of the item
     * @param {Moment} end - New end time of the item
     */
    EquipmentItem.prototype.updateDuration = function(start, end) {
        this.start = start;
        this.end = end;

        var years = Math.ceil(end.diff(start, 'years', true));
        while(this.body.find(".equipment-year option").length != years) {
            if (this.body.find(".equipment-year option").length > years) {
                this.removeYear();
            } else {
                this.addYear();
            }
        }
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
        var name = this.body.find(".equipment-name").val();
        var cost = this.body.find(".equipment-cost").val();
        var year = this.body.find(".equipment-year").text();
        return [
            name, cost, year,
            {value: 'INDIRECT("B" & ROW())',
             metadata: {type: 'formula'}}
        ];
    }

    return EquipmentItem;
});
