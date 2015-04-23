/**
 * A module which defines the 'rows' which are placed in the EquipmentWidget
 * @module app/basicitem
 */
define(["jquery", "app/utils"], function(jquery, utils){
    "use strict"

    /**
     * Type which defines a simple line item for a widget
     * @alias module:app/basicitem
     *
     * @param {DOM Element} elem - The element to fill with this item
     * @param {EquipmentWidget} widget - The widget owning this element
     * @param {Moment} start - Start time of this item
     * @param {Moment} end - End time of this item
     * @param {object} config - Restore this item from the given config
     */
    var BasicItem = function() {}

    /**
     * Initialize this item. This function will be invoked after the body
     * div has been populated but before it is inserted into the DOM.
     */
    BasicItem.prototype.init = function() {
        this.body.find('.item-remove').click(function(){
            this.body.remove();
            this.parent.removeItem(this);
        }.bind(this));
    }

    /**
     * Get an object which can be used to restore this item to a prior state
     */
    BasicItem.prototype.save = function() {
        return {
            name : this.body.find(".item-name").val(),
            costs: this.body.find(".item-cost").map(function(){
                return $(this).val()
            }).get(),
            checked: this.body.find(".item-check").map(function(){
                return this.checked;
            }).get()
        };
    }

    /**
     * Restore this item to the state specified by 'config'
     *
     * @param {object} config - The configuration object
     */
    BasicItem.prototype.restore = function(config) {
        this.start = this.parent.start;
        this.end = this.parent.end;
        this.updateDuration(this.start, this.end);
        this.body.find(".item-name").val(config.name);
        this.body.find(".item-cost").map(function(i){
            $(this).val(config.costs[i]);
        });
        this.body.find(".item-check").map(function(i){
            this.checked = config.checked[i];
            $(this).parents(".item-row").find(".item-cost")
                .prop("disabled", !this.checked);
        });
        this.update();
        this.parent.update();
    }

    BasicItem.prototype.update = function() {
        var values = this.val();
        var total = _.reduce(values, function(total, v){
            return total + (v || 0);
        }, 0);
        this.body.find(".total").text(total.format());
    }

    /**
     * Make this item able to represent the duration start-end
     *
     * @param {Moment} start - New start time of the item
     * @param {Moment} end - New end time of the item
     */
    BasicItem.prototype.updateDuration = function(start, end) {
        this.start = start;
        this.end = end;

        var yearsBetween = utils.yearsBetween(this.start, this.end);
        var years = this.body.find(".year").length;
        if (years < yearsBetween) {
            for (var i=0; i < yearsBetween - years; ++i) {
                this.addYear();
            }
        } else {
            for (var i=0; i < years - yearsBetween; ++i) {
                this.removeYear();
            }
        }
    }


    /**
     * Add a year to this item's display
     */
    BasicItem.prototype.addYear = function() {
        var self = this;
        var year = this.body.find(".year").length;
        var newYear = $.parseHTML(
            '<tr class="row item-row">' +
                '<td class="col-sm-4 small-font">Fiscal Year ' + utils.fiscalYearName(this.start, year) + '</td>' +
                '<td class="col-sm-3"><input type="checkbox" checked="checked" class="item-check"></td>' +
                '<td class="col-sm-5">' +
                    '<div class="input-group">' +
                        '<span class="input-group-addon hidden-sm hidden-xs">$</span>' +
                        '<input type="text" class="form-control year item-cost" placeholder="Cost">' +
                    '</div>' +
                '</td>' +
            '</tr>'
        );
        $(newYear).insertBefore(this.body.find(".item-costs .row:last"));
        $(newYear).find(".item-check").change(function(e){
            $(newYear).find(".item-cost").prop("disabled", !this.checked);
            self.update();
        });
        $(newYear).find('.item-cost').keyup(this.update.bind(this));
    }

    /**
     * Remove a year from this item's display
     */
    BasicItem.prototype.removeYear = function() {
        this.body.find(".item-costs .row").eq(-2).remove();
    }

    /**
     * Get the current costs for each year from this item.
     *
     * @returns {Number[]} - An array of numbers, one for each year
     */
    BasicItem.prototype.val = function() {
        var out = [];
        this.body.find(".item-cost").map(function(){
            if (!$(this).prop("disabled")) {
                out.push(utils.fromCurrency($(this).val()));
            } else {
                out.push(0);
            }
        });
        return out;
    }

    /**
     * Convert this item to an array suitable for being passed to excel-builder
     */
    BasicItem.prototype.serialize = function(header, money) {
        var name = this.body.find(".item-name").val();
        var yearCost = this.val();

        var serialized = [
            "", name, "", ""
        ];

        yearCost.forEach(function(year){
            serialized.push({value: utils.fromCurrency(year),
                             metadata : {style: money.id}});
        });

        serialized.push({value: _.reduce(this.val(), function(t, value){
            return t + value;
        }), metadata : {style: money.id}});

        return serialized;
    }

    return BasicItem;
});
