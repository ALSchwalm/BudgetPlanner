/**
 * A module which defines the EquipmentWidget
 * @module app/equipmentwidget
 */
define(["jquery", "app/widget", "app/equipmentitem"],
function(jquery, Widget, EquipmentItem){
    "use strict"

    /**
     * Type which defines the equipment widget
     * @alias module:app/equipmentwidget
     *
     * @param {DOM Element} elem - The element to fill with this widget
     */
    var EquipmentWidget = function(elem) {
        this.init(elem);
    }

    EquipmentWidget.prototype = new Widget("Equipment", [EquipmentItem]);

    /**
     * Convert this widget to an array suitable for being passed to excel-builder
     */
    EquipmentWidget.prototype.serialize = function(formatter) {
        var serialization = [];

        var yearTotals = this.getPerYearTotal();
        var titleLine = [{value: "V", metadata: {style: formatter.id}},
                         {value:'Equipment', metadata: {style: formatter.id}},
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

    return EquipmentWidget;
});
