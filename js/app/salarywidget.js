/**
 * A module which defines the SalaryWidget
 * @module app/salarywidget
 */
define(["jquery", "app/widget", "app/salaryitem-employee",
        "app/salaryitem-graduate", "app/utils"],
function(jquery, Widget, SalaryItemEmployee, SalaryItemGraduate, utils){
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

    SalaryWidget.prototype = new Widget("Salary and Wages", [SalaryItemEmployee,
                                                             SalaryItemGraduate]);

    /**
     * Convert this SalaryWidget to an array suitable for being passed to excel-builder
     */
    SalaryWidget.prototype.serialize = function(formatter) {
        var serialization = [];

        var yearTotals = this.getPerYearTotal();
        var titleLine = [{value: "I", metadata: {style: formatter.id}},
                         {value:'Salary And Wages', metadata: {style: formatter.id}},
                         "", ""];
        yearTotals.forEach(function(total){
            titleLine.push({value: '$' + utils.asCurrency(total),
                            metadata: {style: formatter.id}});
        });
        titleLine.push({value:'$' + this.getTotal(),
                        metadata: {style: formatter.id}});

        serialization.push(titleLine);
        this.items.forEach(function(item){
            item.serialize().forEach(function(row){
                serialization.push(row);
            })
        });

        return serialization;
    }

    return SalaryWidget;
});
