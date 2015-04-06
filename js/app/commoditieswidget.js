/**
 * A module which defines the CommoditiesWidget
 * @module app/commoditieswidget
 */
define(["jquery", "app/widget", "app/commoditiesitem"],
function(jquery, Widget, CommoditiesItem){
    "use strict"

    /**
     * Type which defines the equipment widget
     * @alias module:app/equipmentwidget
     *
     * @param {DOM Element} elem - The element to fill with this widget
     */
    var CommoditiesWidget = function(elem) {
        this.init(elem);
    }

    CommoditiesWidget.prototype = new Widget("Commodities and Supplies",
                                             [CommoditiesItem]);

    /**
     * Convert this widget to an array suitable for being passed to excel-builder
     */
    CommoditiesWidget.prototype.serialize = function(formatter) {
        var serialization = [];

        var yearTotals = this.getPerYearTotal();
        var titleLine = [{value: "VI", metadata: {style: formatter.id}},
                         {value:'Commodities', metadata: {style: formatter.id}},
                         "", ""];
        yearTotals.forEach(function(total){
            titleLine.push({value:'$' + total, metadata: {style: formatter.id}});
        });
        titleLine.push({value:'$' + this.getTotal(),
                        metadata: {style: formatter.id}});

        serialization.push(titleLine);
        this.items.forEach(function(item){
            serialization.push(item.serialize());
        });
        serialization.push([""]);
        return serialization;
    }

    return CommoditiesWidget;
});
