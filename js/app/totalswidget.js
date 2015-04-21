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
        if (!this.body.children(".row").is(":visible"))
            return;
        var sum = function(arr) {
            return _.reduce(arr, function(t, v) { return t + v;});
        }

        this.body.find(".total-direct-cost").each(function(i, elem){
            $(elem).text(this.getTotalDirectCost()[i].format());
        }.bind(this));
        this.body.find(".total-direct-cost-row td:last")
            .html('$' + sum(this.getTotalDirectCost()).format());

        this.body.find(".total-modified-direct-cost").each(function(i, elem){
            $(elem).text(this.getModifiedDirectCost()[i].format());
        }.bind(this));
        this.body.find(".total-modified-direct-cost-row td:last")
            .html('$' + sum(this.getModifiedDirectCost()).format());

        this.body.find(".total-indirect-cost").each(function(i, elem){
            $(elem).text(this.getIndirectCost()[i].format());
        }.bind(this));
        this.body.find(".total-indirect-cost-row td:last")
            .html('$' + sum(this.getIndirectCost()).format());

        this.body.find(".total-total-cost").each(function(i, elem){
            $(elem).text(this.getTotal()[i].format());
        }.bind(this));
        this.body.find(".total-total-cost-row td:last")
            .html('$' + sum(this.getTotal()).format());
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
            // Modified = total less equipment, less tuition, less > 25000 of each
            // sub contract
            var contractSurplus = 0;
            if (this.widgets["subcontract"].items.length) {
                contractSurplus = _.reduce(this.widgets["subcontract"].items,
                                           function(t, item) {
                                               if (item.val()[i] >= 25000)
                                                   t += item.val()[i] - 25000;
                                               return t;
                                           }, 0);
            }

            return yearTotal -
                this.widgets["equipment"].getPerYearTotal()[i] -
                this.widgets["fringebenefits"].items[0].val()[i] -
                contractSurplus;
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
        var year = $(".total-direct-cost").length;
        this.body.find(".total-headings").find("th:last")
            .before($("<th>").html("FY " + utils.fiscalYearName(this.start, year)));

        var totalDirect = $("<td>").html("$").append($("<span>").addClass("total-direct-cost").html("0.00"));
        $("#total-body").find(".total-direct-cost-row td:last").before(totalDirect);

        var totalModifiedDirect = $("<td>").html("$").append($("<span>").addClass("total-modified-direct-cost").html("0.00"));
        $("#total-body").find(".total-modified-direct-cost-row td:last").before(totalModifiedDirect);

        var totalIndirect = $("<td>").html("$").append($("<span>").addClass("total-indirect-cost").html("0.00"));
        $("#total-body").find(".total-indirect-cost-row td:last").before(totalIndirect);

        var totalTotal = $("<td>").html("$").append($("<span>").addClass("total-total-cost").html("0.00"));
        $("#total-body").find(".total-total-cost-row td:last").before(totalTotal);
    }

    TotalsWidget.prototype.removeYear = function() {
        this.body.find(".total-headings").find("th:last").remove();
        $("#total-body").find(".total-direct-cost-row td:last").remove();
        $("#total-body").find(".total-modified-direct-cost-row td:last").remove();
        $("#total-body").find(".total-indirect-cost-row td:last").remove();
        $("#total-body").find(".total-total-cost-row td:last").remove();
    }

    TotalsWidget.prototype.serialize = function(formatter) {
        var sum = function(arr) {
            return _.reduce(arr, function(t, v) { return t + v;});
        }

        var totalDirectLine = [
            "", {value: "Total Direct Cost", metadata: {style: formatter.id}}, "", ""
        ];
        this.getTotalDirectCost().forEach(function(year){
            totalDirectLine.push({value: year,
                                  metadata: {style: formatter.id}});
        });
        totalDirectLine.push({value: sum(this.getTotalDirectCost()),
                              metadata: {style: formatter.id}});

        var modifiedDirectCost = [
            "", {value:"Modified Total Direct Cost", metadata: {style: formatter.id}}, "", ""
        ];
        this.getModifiedDirectCost().forEach(function(year){
            modifiedDirectCost.push({value: year,
                                     metadata: {style: formatter.id}});
        });
        modifiedDirectCost.push({value: sum(this.getModifiedDirectCost()),
                                 metadata: {style: formatter.id}});

        var indirectCost = [
            "", {value:"Indirect Cost", metadata: {style: formatter.id}},
            "@", $("#settings-indirect-cost-rate").val() + '%'
        ];
        this.getIndirectCost().forEach(function(year){
            indirectCost.push({value: year,
                               metadata: {style: formatter.id}});
        });
        indirectCost.push({value: sum(this.getIndirectCost()),
                           metadata: {style: formatter.id}});

        var total = [
            "", {value:"Total", metadata: {style: formatter.id}}, "", ""
        ];
        this.getTotal().forEach(function(year){
            total.push({value: year,
                        metadata: {style: formatter.id}});
        });
        total.push({value: sum(this.getTotal()),
                    metadata: {style: formatter.id}});

        return [
            totalDirectLine,
            modifiedDirectCost,
            indirectCost,
            total
        ];
    }

    return TotalsWidget;
});
