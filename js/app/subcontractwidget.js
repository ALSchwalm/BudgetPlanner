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
    SubContractWidget.prototype.serialize = function() {
        var serialization = [
            ["II", "SubContract"],
            ["", 'Item Name', 'Cost', 'Purchase Year']
        ];

        this.items.forEach(function(item){
            serialization.push(item.serialize());
        });

        return serialization;
    }

    return SubContractWidget;
});
