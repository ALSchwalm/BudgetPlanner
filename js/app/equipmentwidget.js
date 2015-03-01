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

    EquipmentWidget.prototype = new Widget("Equipment", EquipmentItem);

    /**
     * Convert this widget to an array suitable for being passed to excel-builder
     */
    EquipmentWidget.prototype.serialize = function() {
        var out = [['Name', 'Anual Salary', 'Duration', 'Percent Effort', 'Total']];
        return out.concat(this.items.map(function(item){
            return item.serialize();
        }));
    }

    return EquipmentWidget;
});
