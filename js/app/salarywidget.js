/**
 * A module which defines the SalaryWidget
 * @module app/salarywidget
 */
define(["jquery", "app/widget", "app/salaryitem"],
function(jquery, Widget, SalaryItem){
    "use strict"

    /**
     * Type which defines the salary widget
     * @alias module:app/salarywidget
     *
     * @param {DOM Element} elem - The element to fill with this widget
     */
    var SalaryWidget = function(elem) {
        this.init(elem);
    }

    SalaryWidget.prototype = new Widget("Salary and Wages", SalaryItem);

    /**
     * Convert this SalaryWidget to an array suitable for being passed to excel-builder
     */
    SalaryWidget.prototype.serialize = function() {
        var out = [['Name', 'Anual Salary', 'Duration', 'Percent Effort', 'Total']];
        return out.concat(this.items.map(function(item){
            return item.serialize();
        }));
    }

    return SalaryWidget;
});
