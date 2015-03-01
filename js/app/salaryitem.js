/**
 * A module which defines the 'rows' which are placed in the SalaryWidget
 * @module app/salaryitem
 */
define(["jquery"], function(jquery){
    "use strict"

    /**
     * Type which defines a line in the salary widget
     * @alias module:app/salaryitem
     *
     * @param {SalaryWidget} widget - The widget owning this element
     * @param {DOM Element} elem - The element to fill with this item
     */
    var SalaryItem = function(elem, widget) {
        this.parentWidget = widget;
        this.body = $("<div>")
            .load("bodies/salaryitem.html",
                  null, this.init.bind(this));
        elem.append(this.body);
        return this;
    }

    /**
     * Initialize this salary item. This function will be invoked after the body
     * div has been populated but before it is inserted into the DOM.
     */
    SalaryItem.prototype.init = function() {
        this.body.find('.dropdown-menu a').click(function(e){
            $(this).parent().parent().siblings('button')
                .find(".salary-type").html($(this).attr("name"));
        });
        this.body.find('.item-remove').click(function(){
            this.body.remove();
            this.parentWidget.removeItem(this);
        }.bind(this));

        this.body.find('.salary-salary, .salary-effort')
            .keyup(this.update.bind(this));
    }

    SalaryItem.prototype.update = function() {
        var salary = this.body.find('.salary-salary').val();
        var effort = this.body.find('.salary-effort').val();
        if (salary != "" && effort != "") {

            //TODO account for each year
            this.body.find('.year').html(salary * effort * 0.01);

            var total = _.reduce(this.body.find('.year'),
                                 function(total, e){
                                     return total + parseFloat($(e).text());
                                 }, 0);
            this.body.find('.total').html(total);
        }
    }

    /**
     * Convert this SalaryItem to an array suitable for being passed to excel-builder
     */
    SalaryItem.prototype.serialize = function() {
        var name = this.body.find(".salary-name").val();
        var salary = this.body.find(".salary-salary").val();
        var duration = this.body.find(".salary-type").text();
        var effort = this.body.find(".salary-effort").val();
        return [
            name, salary, duration, effort,
            {value: 'INDIRECT("B" & ROW())*INDIRECT("D" & ROW())*0.01',
             metadata: {type: 'formula'}}
        ];
    }

    return SalaryItem;
});
