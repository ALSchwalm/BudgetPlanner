/**
 * A module which defines the FringeBenefitsWidget
 * @module app/fringebenefitswidget
 */
define(["jquery", "app/widget", "app/fringebenefitsitem"],
function(jquery, Widget, FringeBenefitsItem){
    "use strict"

    /**
     * Type which defines the fringe benefits widget
     * @alias module:app/fringebenefitswidget
     *
     * @param {DOM Element} elem - The element to fill with this widget
     */
    var FringeBenefitsWidget = function(elem) {
        this.init(elem);
        $(document.body).on("salary-added", function(){
            if (this.salaryWidget.items.length > this.items.length)
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
        var item = this.items.shift(1);
        item.body.remove();
        this.items.forEach(function(item){
            item.update();
        });
    }

    return FringeBenefitsWidget;
});
