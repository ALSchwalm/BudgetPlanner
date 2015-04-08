/**
 * A module which defines the 'rows' which are placed in the TravelWidget
 * @module app/TravelItemCar
 */
define(["jquery"], function(jquery){
    "use strict"

    /**
     * Type which defines a line in the equipment widget
     * @alias module:app/TravelItemCar
     *
     * @param {DOM Element} elem - The element to fill with this item
     * @param {EquipmentWidget} widget - The widget owning this element
     * @param {Moment} start - Start time of this item
     * @param {Moment} end - End time of this item
     * @param {object} config - Restore this item from the given config
     */
    var TravelItemCar = function(elem, widget, start, end, config) {
        this.parent = widget;
        this.start = start;
        this.end = end;
        this.body = $("<div>")
            .load("bodies/travelitem-car.html",
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
    TravelItemCar.prototype.init = function() {
        this.body.find('.item-remove').click(function(){
            this.body.remove();
            this.parent.removeItem(this);
        }.bind(this));

        this.body.find('.travel-car-cost').change(this.update.bind(this));

        this.body.find('.travel-car-pickupdate, .travel-car-dropoffdate').datepicker({
            changeMonth: true,
            changeYear: true,
        })

        // Get car price via API
        this.body.find('.travel-car-dropoffdate').on('blur', function() {
            this.body.find('.travel-car-cost').attr('placeholder', 'Calculating...');
            $.ajax({
                url: 'ajaxServer.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    command: 'getCarPrice',
                    location: this.body.find('.travel-car-destination').val(),
                    pickup: this.body.find('.travel-car-pickupdate').val(),
                    dropoff: this.body.find('.travel-car-dropoffdate').val()
                }
            }).done(function(rtn) {
                if(rtn.error || (typeof rtn.error == 'undefined') ) {
                    this.body.find('.travel-car-cost').val(0);
                } else {
                    this.body.find('.travel-car-cost').val(rtn.avg);
                }
                this.body.find('.travel-car-cost').attr('placeholder', 'Cost');
                this.update();
            }.bind(this));
        }.bind(this));
    }

    /**
     * Get an object which can be used to restore this item to a prior state
     */
    TravelItemCar.prototype.save = function() {
        return {
            destination : this.body.find(".travel-car-destination").val(),
            pickupdate : this.body.find(".travel-car-pickupdate").val(),
            dropoffdate : this.body.find(".travel-car-dropoffdate").val(),
            cost : this.body.find(".travel-car-cost").val(),
            year : this.body.find(".travel-car-year").val(),
        };
    }

    /**
     * Restore this item to the state specified by 'config'
     *
     * @param {object} config - The configuration object
     */
    TravelItemCar.prototype.restore = function(config) {
        this.start = this.parent.start;
        this.end = this.parent.end;
        this.updateDuration(this.start, this.end);
        this.body.find(".travel-car-destination").val(config.destination);
        this.body.find(".travel-car-pickupdate").val(config.pickupdate);
        this.body.find(".travel-car-dropoffdate").val(config.dropoffdate);
        this.body.find(".travel-car-cost").val(config.cost);
        this.body.find(".travel-car-year").val(config.year);

        this.update();
    }

    TravelItemCar.prototype.update = function() {
    }

    /**
     * Make this item able to represent the duration start-end
     *
     * @param {Moment} start - New start time of the item
     * @param {Moment} end - New end time of the item
     */
    TravelItemCar.prototype.updateDuration = function(start, end) {
        this.start = start;
        this.end = end;

        var years = Math.ceil(end.diff(start, 'years', true));
        while(this.body.find(".travel-car-year option").length != years) {
            if (this.body.find(".travel-car-year option").length > years) {
                this.removeYear();
            } else {
                this.addYear();
            }
        }
    }


    /**
     * Add a year to this item's display
     */
    TravelItemCar.prototype.addYear = function() {
        var year = this.body.find(".travel-car-year option").length;
        this.body.find(".travel-car-year").append(
            $("<option>").attr("value", year).text("Year " + (year+1))
        );
    }

    /**
     * Remove a year from this item's display
     */
    TravelItemCar.prototype.removeYear = function() {
        this.body.find(".travel-car-year option:last").remove();
    }

    /**
     * Get the current costs for each year from this item.
     *
     * @returns {Number[]} - An array of numbers, one for each year
     */
    TravelItemCar.prototype.val = function() {
        var arr = [];
        for (var i=0; i < this.body.find("option").length; ++i) {
            arr.push(0);
        }
        var purchaseYear = parseInt(this.body.find(".travel-car-year").val());
        arr[purchaseYear] = parseFloat(this.body.find('.travel-car-cost').val()) || 0;
        return arr;
    }

    TravelItemCar.prototype.itemName = "Car";
    return TravelItemCar;
});
