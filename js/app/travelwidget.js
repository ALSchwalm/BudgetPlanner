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
    TravelWidget.prototype.serialize = function(formatter) {
        var serialization = [];

        var yearTotals = this.getPerYearTotal();
        var titleLine = [{value: "III", metadata: {style: formatter.id}},
                         {value:'Travel', metadata: {style: formatter.id}},
                         "", ""];
        yearTotals.forEach(function(total){
            titleLine.push({value: total, metadata: {style: formatter.id}});
        });
        titleLine.push({value: this.getTotal(),
                        metadata: {style: formatter.id}});

        serialization.push(titleLine);
        serialization.push([""]);
        return serialization;
    }

    return TravelWidget;
});
