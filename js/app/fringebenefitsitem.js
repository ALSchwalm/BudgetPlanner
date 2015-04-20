/**
 * A module which defines the 'rows' which are placed in the FringeBenefitsWidget
 * @module app/fringebenefitsitem
 */
define(["jquery", "app/utils"], function(jquery, utils){
    "use strict"

    /**
     * Type which defines a line in the fringe benefits widget
     * @alias module:app/fringebenefitsitem
     *
     * @param {DOM Element} elem - The element to fill with this item
     * @param {EquipmentWidget} widget - The widget owning this element
     * @param {Moment} start - Start time of this item
     * @param {Moment} end - End time of this item
     * @param {object} config - Restore this item from the given config
     */
    var FringeBenefitsItem = function(elem, widget, start, end, config) {
        this.parent = widget;
        this.start = start;
        this.end = end;
        this.body = $("<div>")
            .load("bodies/fringebenefitsitem.html",
                  null,
                  function(){
                      this.init();
                      this.updateDuration(start, end);
                      if (config)
                          this.restore(config);
                  }.bind(this));
        elem.append(this.body);
        return this;
    }

    FringeBenefitsItem.prototype.itemName = "Fringe Benefit";

    /**
     * Initialize this item. This function will be invoked after the body
     * div has been populated but before it is inserted into the DOM.
     */
    FringeBenefitsItem.prototype.init = function() {
        var self = this;
        this.body.find(".benefits-type").change(function(){
            self.body.find(".benefits-percent").val($(this).val());
        });
    }

    /**
     * Get an object which can be used to restore this item to a prior state
     */
    FringeBenefitsItem.prototype.save = function() {
        return {
            name : this.body.find(".benefits-name").val(),
            percent : this.body.find(".benefits-percent").val(),
            category : this.body.find(".benefits-type").val()
        };
    }

    /**
     * Restore this item to the state specified by 'config'
     *
     * @param {object} config - The configuration object
     */
    FringeBenefitsItem.prototype.restore = function(config) {
        this.body.find(".benefits-name").val(config.name);
        this.body.find(".benefits-type").val(config.category);
        this.body.find(".benefits-percent").val(config.percent);

        setTimeout(function(){
            this.update();
            this.parent.update();
        }.bind(this), 500);
    }

    FringeBenefitsItem.prototype.update = function() {
        var index = this.parent.items.indexOf(this);
        var salaryItem = this.parent.salaryWidget.items[index-1];
        var salaryBody = salaryItem.body;

        this.updateEmployeeDuration(salaryItem.start, salaryItem.end, true);

        this.body.find(".benefits-name").val(salaryBody.find(".salary-name, .graduate-name").val());
        var percent = parseFloat(this.body.find(".benefits-percent").val()) || 0;
        percent *= 0.01;

        var years = this.body.find('.year');
        var self = this;
        years.map(function(i){
            $(this).text((percent*salaryItem.val()[i]).format());
        });
        var total = _.reduce(years,
                             function(total, e){
                                 return total + utils.fromCurrency($(e).text());
                             }, 0);
        this.body.find('.total').text(total.format());
        this.parent.update(true);
    }

    /**
     * Make this item able to represent the duration start-end
     *
     * @param {Moment} start - New start time of the item
     * @param {Moment} end - New end time of the item
     */
    FringeBenefitsItem.prototype.updateDuration = function(start, end, noUpdate) {
        var noUpdate = noUpdate || false;
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

        if (!noUpdate) {
            this.update();
            this.parent.update();
        }
    }

    FringeBenefitsItem.prototype.updateEmployeeDuration = function(start, end)  {
        var self = this;
        this.start = start;
        this.end = end;
        var budgetStart = moment($("#settings-start-date").val());
        var budgetEnd = moment($("#settings-end-date").val());

        var years = this.body.find(".year");

        years.map(function(i){
            i += budgetStart.year();
            if (i < start.year() || i > end.year()) {
                $(this).parents(".row:first").hide();
            } else {
                $(this).parents(".row:first").show();
            }
        });
    }


    /**
     * Add a year to this item's display
     */
    FringeBenefitsItem.prototype.addYear = function() {
        var year = this.body.find(".year").length;
        var newYear = $.parseHTML(
            '<tr class="row">' +
                '<td class="col-sm-4 small-font">Fiscal Year ' + (year+this.start.year()) + '</td>' +
                '<td class="col-sm-4">$<span class="year currency">0.00</></td>' +
            '</tr>'
        );
        $(newYear).insertBefore(this.body.find(".benefits-totals .row:last"));
    }

    /**
     * Remove a year from this item's display
     */
    FringeBenefitsItem.prototype.removeYear = function() {
        this.body.find(".benefits-totals .row").eq(-2).remove();
    }

    /**
     * Get the current costs for each year from this item.
     *
     * @returns {Number[]} - An array of numbers, one for each year
     */
    FringeBenefitsItem.prototype.val = function() {
        var index = this.parent.items.indexOf(this);
        var salaryItem = this.parent.salaryWidget.items[index-1];
        var percent = parseFloat(this.body.find(".benefits-percent").val()) * 0.01;

        var yearlyPay = salaryItem.val();
        return yearlyPay.map(function(value){
            return value*percent;
        });
    }

    /**
     * Convert this item to an array suitable for being passed to excel-builder
     */
    FringeBenefitsItem.prototype.serialize = function(header, money) {
        var name = this.body.find(".benefits-name").val();
        var percent = this.body.find(".benefits-percent").val()
        var serialized = ["", name, "@", percent + '%'];

        this.val().forEach(function(year){
            serialized.push({value: utils.fromCurrency(year),
                             metadata : {style : money.id}});
        });

        serialized.push({value: _.reduce(this.val(), function(t, value){
            return t + value;
        }), metadata : {style: money.id}});

        return serialized;
    }

    return FringeBenefitsItem;
});
