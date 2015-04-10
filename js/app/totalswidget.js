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
        this.body.find(".total-direct-cost").each(function(i, elem){
            $(elem).text(utils.asCurrency(this.getTotalDirectCost()[i]));
        }.bind(this));

        this.body.find(".total-modified-direct-cost").each(function(i, elem){
            $(elem).text(utils.asCurrency(this.getModifiedDirectCost()[i]));
        }.bind(this));

        this.body.find(".total-indirect-cost").each(function(i, elem){
            $(elem).text(utils.asCurrency(this.getIndirectCost()[i]));
        }.bind(this));

        this.body.find(".total-total-cost").each(function(i, elem){
            $(elem).text(utils.asCurrency(this.getTotal()[i]));
        }.bind(this));
    }

    TotalsWidget.prototype.getTotalDirectCost = function() {
        var totals = this.body.find('.total-direct-cost').map(function(){
            return 0;
        }).get();

        for (var key in this.widgets) {
            if (this.widgets[key].getPerYearTotal) {
                this.widgets[key].getPerYearTotal().forEach(function(yearTotal, i){
                    totals[i] += yearTotal;
                });
            }
        }
        return totals;
    }

    /**
     * Modified direct cost = total cost - equipment - tuition - >2500 of each
     * sub contract
     */
    TotalsWidget.prototype.getModifiedDirectCost = function() {
        return this.getTotalDirectCost().map(function(yearTotal, i){
            return yearTotal - this.widgets["equipment"].getPerYearTotal()[i];
        }, this);
    }

    TotalsWidget.prototype.getIndirectCost = function() {
        var rate = $("#settings-indirect-cost-rate").val()*0.01;

        return this.getModifiedDirectCost().map(function(yearTotal){
            return yearTotal*rate;
        }, this);
    }

    TotalsWidget.prototype.getTotal = function() {
        return this.getTotalDirectCost().map(function(yearTotal, i){
            return yearTotal + this.getIndirectCost()[i];
        }, this);
    }

    /**
     * Make this item able to represent the duration start-end
     *
     * @param {Moment} start - New start time of the item
     * @param {Moment} end - New end time of the item
     */
    TotalsWidget.prototype.updateDuration = function(start, end) {
        this.start = start;
        this.end = end;

        var years = utils.yearsBetween(this.start, this.end);
        while($(".total-direct-cost").length != years) {
            if ($(".total-direct-cost").length > years) {
                this.removeYear();
            } else {
                this.addYear();
            }
        }
    }

    TotalsWidget.prototype.addYear = function() {
        this.body.find(".total-headings").find("th:last")
            .after($("<th>").html("Year " + ($(".total-direct-cost").length+this.start.year()) ));

        var totalDirect = $("<td>").html("$").append($("<span>").addClass("total-direct-cost").html("0.00"));
        $("#total-body").find(".total-direct-cost-row").append(totalDirect);

        var totalModifiedDirect = $("<td>").html("$").append($("<span>").addClass("total-modified-direct-cost").html("0.00"));
        $("#total-body").find(".total-modified-direct-cost-row").append(totalModifiedDirect);

        var totalIndirect = $("<td>").html("$").append($("<span>").addClass("total-indirect-cost").html("0.00"));
        $("#total-body").find(".total-indirect-cost-row").append(totalIndirect);

        var totalTotal = $("<td>").html("$").append($("<span>").addClass("total-total-cost").html("0.00"));
        $("#total-body").find(".total-total-cost-row").append(totalTotal);
    }

    TotalsWidget.prototype.removeYear = function() {
        this.body.find(".total-headings").find("th:last").remove();
        $("#total-body").find(".total-direct-cost-row td:last").remove();
        $("#total-body").find(".total-modified-direct-cost-row td:last").remove();
        $("#total-body").find(".total-indirect-cost-row td:last").remove();
        $("#total-body").find(".total-total-cost-row td:last").remove();
    }

    TotalsWidget.prototype.serialize = function(formatter) {
        var totalDirectLine = [
            "", {value: "Total Direct Cost", metadata: {style: formatter.id}}, "", ""
        ];

        this.getTotalDirectCost().forEach(function(year){
            totalDirectLine.push({value:'$'+utils.asCurrency(year),
                                  metadata: {style: formatter.id}});
        });

        var modifiedDirectCost = [
            "", {value:"Modified Total Direct Cost", metadata: {style: formatter.id}}, "", ""
        ];
        this.getModifiedDirectCost().forEach(function(year){
            modifiedDirectCost.push({value: '$' + utils.asCurrency(year),
                                     metadata: {style: formatter.id}});
        });

        var indirectCost = [
            "", {value:"Indirect Cost", metadata: {style: formatter.id}}, "", ""
        ];
        this.getIndirectCost().forEach(function(year){
            indirectCost.push({value: '$' + utils.asCurrency(year),
                               metadata: {style: formatter.id}});
        });

        var total = [
            "", {value:"Total", metadata: {style: formatter.id}}, "", ""
        ];
        this.getTotal().forEach(function(year){
            total.push({value:'$' + utils.asCurrency(year),
                        metadata: {style: formatter.id}});
        });

        return [
            totalDirectLine,
            modifiedDirectCost,
            indirectCost,
            total
        ];
    }

    return TotalsWidget;
});
