/**
 * A module which defines the 'rows' which are placed in the TravelWidget
 * @module app/TravelItemHotel
 */
define(["jquery"], function(jquery){
    "use strict"

    /**
     * Type which defines a line in the equipment widget
     * @alias module:app/TravelItemHotel
     *
     * @param {DOM Element} elem - The element to fill with this item
     * @param {EquipmentWidget} widget - The widget owning this element
     * @param {Moment} start - Start time of this item
     * @param {Moment} end - End time of this item
     * @param {object} config - Restore this item from the given config
     */
    var TravelItemHotel = function(elem, widget, start, end, config) {
        this.parent = widget;
        this.start = start;
        this.end = end;
        this.body = $("<div>")
            .load("bodies/travelitem-hotel.html",
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
    TravelItemHotel.prototype.init = function() {
        this.body.find('.item-remove').click(function(){
            this.body.remove();
            this.parentWidget.removeItem(this);
        }.bind(this));

        this.body.find('.travel-hotel-cost')
            .keyup(this.update.bind(this));
    }

    /**
     * Get an object which can be used to restore this item to a prior state
     */
    TravelItemHotel.prototype.save = function() {
        return {
            location : this.body.find(".travel-hotel-location").val(),
            checkin : this.body.find(".travel-hotel-checkin").val(),
            checkout : this.body.find(".travel-hotel-checkout").val(),
			rooms : this.body.find(".travel-hotel-rooms").val(),
			people : this.body.find(".travel-hotel-people").val(),
            cost : this.body.find(".travel-hotel-cost").val()
        };
    }

    /**
     * Restore this item to the state specified by 'config'
     *
     * @param {object} config - The configuration object
     */
    TravelItemHotel.prototype.restore = function(config) {
        this.start = this.parent.start;
        this.end = this.parent.end;
        this.updateDuration(this.start, this.end);
        this.body.find(".travel-hotel-location").val(config.location);
        this.body.find(".travel-hotel-checkin").val(config.checkin);
        this.body.find(".travel-hotel-checkout").val(config.checkout);
        this.body.find(".travel-hotel-rooms").val(config.rooms);
        this.body.find(".travel-hotel-people").val(config.people);
        this.body.find(".travel-hotel-cost").val(config.cost);

		
        this.update();
    }

    TravelItemHotel.prototype.update = function() {
    }

    /**
     * Make this item able to represent the duration start-end
     *
     * @param {Moment} start - New start time of the item
     * @param {Moment} end - New end time of the item
     */
    TravelItemHotel.prototype.updateDuration = function(start, end) {
        this.start = start;
        this.end = end;

        var years = Math.ceil(end.diff(start, 'years', true));
        while(this.body.find(".travel-hotel-year option").length != years) {
            if (this.body.find(".travel-hotel-year option").length > years) {
                this.removeYear();
            } else {
                this.addYear();
            }
        }
    }


    /**
     * Add a year to this item's display
     */
    TravelItemHotel.prototype.addYear = function() {
        var year = this.body.find(".travel-hotel-year option").length;
        this.body.find(".travel-hotel-year").append(
            $("<option>").attr("value", year).text("Year " + (year+1))
        );
    }

    /**
     * Remove a year from this item's display
     */
    TravelItemHotel.prototype.removeYear = function() {
        this.body.find(".travel-hotel-year option:last").remove();
    }

    /**
     * Get the current costs for each year from this item.
     *
     * @returns {Number[]} - An array of numbers, one for each year
     */
    TravelItemHotel.prototype.val = function() {
        var arr = [];
        for (var i=0; i < this.body.find("option").length; ++i) {
            arr.push(0);
        }
        var purchaseYear = parseInt(this.body.find(".travel-hotel-year").val());
        arr[purchaseYear] = parseFloat(this.body.find('.travel-hotel-cost').val()) || 0;
        return arr;
    }

    /**
     * Convert this item to an array suitable for being passed to excel-builder
     */
    TravelItemHotel.prototype.serialize = function() {
        /*
        var name = this.body.find(".travel-name").val();
        var cost = this.body.find(".travel-cost").val();
        var year = this.body.find(".travel-year").text();
        return [
            name, cost, year,
            {value: 'INDIRECT("B" & ROW())',
             metadata: {type: 'formula'}}
        ];*/
        return [];
    }

    TravelItemHotel.prototype.itemName = "Hotel";
    return TravelItemHotel;
});
