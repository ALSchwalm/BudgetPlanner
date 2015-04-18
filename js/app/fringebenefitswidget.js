/**
 * A module which defines the FringeBenefitsWidget
 * @module app/fringebenefitswidget
 */
define(["jquery", "app/utils", "app/widget", "app/fringebenefitsitem", "app/tuitionbenefititem"],
function(jquery, utils, Widget, FringeBenefitsItem, TuititionBenefitItem){
    "use strict"

    /**
     * Type which defines the fringe benefits widget
     * @alias module:app/fringebenefitswidget
     *
     * @param {DOM Element} elem - The element to fill with this widget
     */
    var FringeBenefitsWidget = function(elem) {
        this.init(elem);
        setTimeout(function(){
            this.items.push(
                new TuititionBenefitItem(this.body.find(".panel-body"), this,
                                         this.start, this.end)
            );
        }.bind(this), 300);

        $(document.body).on("salary-added", function(){
            var salaryItems = this.salaryWidget.items.filter(function(item){
                // Graduate student items have no name, do not count them
                return item.body.find(".salary-name").length == 1;
            }).length;
            if (salaryItems > this.items.length-1)
                this.addItem();
        }.bind(this));

        $(document.body).on("salary-removed", function(){
            this.removeItem();
        }.bind(this));

        $(document.body).on("keyup", function(){
            this.items.forEach(function(item){
                item.update();
            });
        }.bind(this));
    }

    FringeBenefitsWidget.prototype = new Widget("Fringe Benefits", []);

    FringeBenefitsWidget.prototype.addItem = function(config){
        this.items.push(
            new FringeBenefitsItem(this.body.find(".panel-body"),
                                   this,
                                   this.start,
                                   this.end,
                                   config));
    }

    FringeBenefitsWidget.prototype.removeItem = function(){
        var item = this.items.pop();
        item.body.remove();
        this.items.forEach(function(item){
            item.update();
        });
    }

    /**
     * Convert this SalaryWidget to an array suitable for being passed to excel-builder
     */
    FringeBenefitsWidget.prototype.serialize = function(formatter, money) {
        var serialization = [
            [""],
        ];

        var yearTotals = this.getPerYearTotal();
        var titleLine = [{value: "II", metadata: {style: formatter.id}},
                         {value:'Fringe Benefits', metadata: {style: formatter.id}},
                         "", ""];
        yearTotals.forEach(function(total){
            titleLine.push({value: total,
                            metadata: {style: formatter.id}});
        });
        titleLine.push({value: this.getTotal(),
                        metadata: {style: formatter.id}});

        serialization.push(titleLine);
        this.items.forEach(function(item){
            serialization.push(item.serialize(formatter, money));
        });
        serialization.push([""]);
        return serialization;
    }

    return FringeBenefitsWidget;
});
