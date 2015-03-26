/**
 * A module which caclulates total direct/indirect cost for the entire budget
 * @module app/totalswidget
 */
define(["jquery", "app/widget", "app/utils"],
function(jquery, Widget, utils){
    "use strict"

    /**
     * Type which defines the totals widget
     * @alias module:app/totalswidget
     *
     * @param {DOM Element} elem - The element to fill with this widget
     */
    var TotalsWidget = function(elem, widgets) {
        this.body = $("<div>");
        this.widgets = widgets;
        this.body.load("bodies/totals.html");
        elem.append(this.body);
    }

    TotalsWidget.prototype.update = function(){
        this.body.find(".total-direct-cost")
            .text(utils.asCurrency(this.getModifiedDirectCost()));
        this.body.find(".total-modified-direct-cost")
            .text(utils.asCurrency(this.getTotalDirectCost()));
        this.body.find(".total-indirect-cost")
            .text(utils.asCurrency(this.getIndirectCost()));
        this.body.find(".total-total-cost")
            .text(utils.asCurrency(this.getTotal()));
    }

    TotalsWidget.prototype.getTotalDirectCost = function() {
        var total = 0;
        for (var key in this.widgets) {
            if (this.widgets[key].getTotal)
                total += this.widgets[key].getTotal();
        }
        return total;
    }

    TotalsWidget.prototype.getModifiedDirectCost = function() {

        // Until we have contracts, just return total direct cost
        return this.getTotalDirectCost();
    }

    TotalsWidget.prototype.getIndirectCost = function() {
        var rate = $("#settings-indirect-cost-rate").val()*0.01;
        return this.getModifiedDirectCost()*rate;
    }

    TotalsWidget.prototype.getTotal = function() {
        return this.getTotalDirectCost() + this.getIndirectCost();
    }

    TotalsWidget.prototype.serialize = function() {
        return [
            ["", "TOTAL DIRECT COST", "", this.getTotalDirectCost()],
            ["", "MODIFIED TOTAL DIRECT COST", "", this.getModifiedDirectCost()],
            ["", "INDIRECT COST", $("#total-indirect-cost-rate").val() + "%", this.getIndirectCost()],
            ["", "TOTAL", "", this.getTotal()]
        ];
    }

    return TotalsWidget;
});
