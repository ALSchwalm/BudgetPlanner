/**
 * A module which defines the TravelWidget
 * @module app/travelwidget
 */
define(["jquery", "app/widget", "app/travelitem"],
function(jquery, Widget, TravelItem){
    "use strict"

    /**
     * Type which defines the travel widget
     * @alias module:app/travelwidget
     *
     * @param {DOM Element} elem - The element to fill with this widget
     */
    var TravelWidget = function(elem) {
        this.init(elem);
    }

    TravelWidget.prototype = new Widget("Travel Expenses", TravelItem);

    /**
     * Convert this TravelWidget to an array suitable for being passed to excel-builder
     */
    TravelWidget.prototype.serialize = function() {
        var serialization = [
            ['Salary And Wages'],
            ['Name', '9/12-month', 'Salary', 'Percent Effort'],
        ];

        this.items.forEach(function(item){
            serialization.push(item.serialize());
        });

        return serialization;
    }

    return TravelWidget;
});
