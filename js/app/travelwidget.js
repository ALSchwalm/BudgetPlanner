/**
 * A module which defines the SalaryWidget
 * @module app/travelwidget
 */
define(["jquery", "app/widget", "app/travelitem-hotel",
    "app/travelitem-car", "app/travelitem-plane"],
function(jquery, Widget, TravelItemHotel, TravelItemCar, TravelItemPlane){
    "use strict"

    /**
     * Type which defines the salary widget
     * @alias module:app/travelwidget
     *
     * @param {DOM Element} elem - The element to fill with this widget
     */
    var TravelWidget = function(elem) {
        this.init(elem);
    }

    TravelWidget.prototype = new Widget("Travel", [TravelItemHotel,
                                TravelItemCar, TravelItemPlane]);

    /**
     * Convert this TravelWidget to an array suitable for being passed to excel-builder
     */
    TravelWidget.prototype.serialize = function() {
        var serialization = [
        ];

        this.items.forEach(function(item){
            serialization.push(item.serialize());
        });

        return serialization;
    }

    return TravelWidget;
});
