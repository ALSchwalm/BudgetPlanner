/**
 * A module which defines the 'rows' which are placed in the TravelWidget
 * @module app/TravelItemPlane
 */
define(["jquery"], function(jquery){
    "use strict"

    /**
     * Type which defines a line in the equipment widget
     * @alias module:app/TravelItemPlane
     *
     * @param {DOM Element} elem - The element to fill with this item
     * @param {EquipmentWidget} widget - The widget owning this element
     * @param {Moment} start - Start time of this item
     * @param {Moment} end - End time of this item
     * @param {object} config - Restore this item from the given config
     */
    var TravelItemPlane = function(elem, widget, start, end, config) {
        this.parent = widget;
        this.start = start;
        this.end = end;
        this.body = $("<div>")
            .load("bodies/travelitem-plane.html",
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
    TravelItemPlane.prototype.init = function() {
        
    }

    /**
     * Get an object which can be used to restore this item to a prior state
     */
    TravelItemPlane.prototype.save = function() {
        return {
            destination : this.body.find(".travel-destination").val(),
            departure : this.body.find(".travel-departure").val(),
            arrival : this.body.find(".travel-arrival").val(),
			method : this.body.find(".travel-method").val(),
			price : this.body.find(".travel-year").val()
        };
    }

    /**
     * Restore this item to the state specified by 'config'
     *
     * @param {object} config - The configuration object
     */
    TravelItemPlane.prototype.restore = function(config) {
        this.start = this.parent.start;
        this.end = this.parent.end;
        this.updateDuration(this.start, this.end);
		this.body.find(".travel-destination").val(config.destination),
		this.body.find(".travel-departure").val(config.departure),
		this.body.find(".travel-arrival").val(config.arrival),
		this.body.find(".travel-method").val(config.method),
		this.body.find(".travel-year").val(config.year)
		
        this.update();
    }

    TravelItemPlane.prototype.update = function() {
    }

    /**
     * Make this item able to represent the duration start-end
     *
     * @param {Moment} start - New start time of the item
     * @param {Moment} end - New end time of the item
     */
    TravelItemPlane.prototype.updateDuration = function(start, end) {
        this.start = start;
        this.end = end;

        var years = Math.ceil(end.diff(start, 'years', true));
        while(this.body.find(".travel-year option").length != years) {
            if (this.body.find(".travel-year option").length > years) {
                this.removeYear();
            } else {
                this.addYear();
            }
        }
    }


    /**
     * Add a year to this item's display
     */
    TravelItemPlane.prototype.addYear = function() {
        var year = this.body.find(".travel-year option").length;
        this.body.find(".travel-year").append(
            $("<option>").attr("value", year).text("Year " + (year+1))
        );
    }

    /**
     * Remove a year from this item's display
     */
    TravelItemPlane.prototype.removeYear = function() {
        this.body.find(".travel-year option:last").remove();
    }

    /**
     * Get the current costs for each year from this item.
     *
     * @returns {Number[]} - An array of numbers, one for each year
     */
    TravelItemPlane.prototype.val = function() {
        var arr = [];
        for (var i=0; i < this.body.find("option").length; ++i) {
            arr.push(0);
        }
        var purchaseYear = parseInt(this.body.find(".travel-year").val());
        arr[purchaseYear] = parseFloat(this.body.find('.travel-cost').val()) || 0;
        return arr;
    }

    /**
     * Convert this item to an array suitable for being passed to excel-builder
     */
    TravelItemPlane.prototype.serialize = function() {
        var name = this.body.find(".travel-name").val();
        var cost = this.body.find(".travel-cost").val();
        var year = this.body.find(".travel-year").text();
        return [
            name, cost, year,
            {value: 'INDIRECT("B" & ROW())',
             metadata: {type: 'formula'}}
        ];
    }

    TravelItemPlane.prototype.itemName = "Plane";
    return TravelItemPlane;
});
