/**
 * A module which defines the SubContractWidget
 * @module app/SubContractwidget
 */
define(["jquery", "app/widget", "app/subcontractitem"],
function(jquery, Widget, SubContractItem){
    "use strict"

    /**
     * Type which defines the SubContract widget
     * @alias module:app/SubContractwidget
     *
     * @param {DOM Element} elem - The element to fill with this widget
     */
    var SubContractWidget = function(elem) {
        this.init(elem);
    }

    SubContractWidget.prototype = new Widget("Subcontracts", [SubContractItem]);

    /**
     * Convert this widget to an array suitable for being passed to excel-builder
     */
    SubContractWidget.prototype.serialize = function(formatter) {
        var serialization = [];

        var yearTotals = this.getPerYearTotal();
        var titleLine = [{value: "IV", metadata: {style: formatter.id}},
                         {value:'Subcontracts', metadata: {style: formatter.id}},
                         "", ""];

        yearTotals.forEach(function(total){
            titleLine.push({value: '$' + total,
                            metadata: {style: formatter.id}});
        });

        titleLine.push({value:'$' + this.getTotal(),
                        metadata: {style: formatter.id}});

        serialization.push(titleLine);
        this.items.forEach(function(item){
            serialization.push(item.serialize(formatter));
        });
        serialization.push([""]);
        return serialization;
    }

    return SubContractWidget;
});
