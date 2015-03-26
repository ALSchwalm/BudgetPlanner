/**
 * A module which defines the ContractWidget
 * @module app/contractwidget
 */
define(["jquery", "app/widget", "app/contractitem", "app/graduateinsuranceitem"],
function(jquery, Widget, ContractItem, GraduateInsuranceItem){
    "use strict"

    /**
     * Type which defines the contract widget
     * @alias module:app/contractwidget
     *
     * @param {DOM Element} elem - The element to fill with this widget
     */
    var ContractWidget = function(elem) {
        this.init(elem);

        setTimeout(function(){
            this.items.push(
                new GraduateInsuranceItem(this.body.find(".panel-body"), this,
                                          this.start, this.end)
            );
        }.bind(this), 400)
    }

    ContractWidget.prototype = new Widget("Contractual", [ContractItem]);

    /**
     * Convert this widget to an array suitable for being passed to excel-builder
     */
    ContractWidget.prototype.serialize = function() {
        var serialization = [
            ['Contracts'],
            ['Item Name', 'Cost', 'Purchase Year']
        ];

        this.items.forEach(function(item){
            serialization.push(item.serialize());
        });

        return serialization;
    }

    return ContractWidget;
});
