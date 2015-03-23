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

    SalaryWidget.prototype = new Widget("Salary and Wages", [SalaryItem]);

    /**
     * Convert this SalaryWidget to an array suitable for being passed to excel-builder
     */
    SalaryWidget.prototype.serialize = function() {
        var serialization = [
            [""], [""],
            ["I", 'Salary And Wages'],
            ["", 'Name', '9/12-month', 'Salary', 'Percent Effort'],
        ];

        this.items.forEach(function(item){
            serialization.push(item.serialize());
        });

        return serialization;
    }

    return SalaryWidget;
});
