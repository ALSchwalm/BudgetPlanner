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
     * @param {Number} year - The number of years to account for
     */
    var SalaryItem = function(elem, widget, year) {
        this.parentWidget = widget;
        this.body = $("<div>")
            .load("bodies/salaryitem.html",
                  null,
                  function(){
                      this.init();
                      for (var i=0; i < year; ++i)
                          this.addYear();
                  }.bind(this));
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

        this.body.keyup(this.update.bind(this));
    }

    /**
     * Bring this item up-to-date.
     */
    SalaryItem.prototype.update = function() {
        var salary = this.body.find('.salary-salary').val();
        var efforts = this.body.find('.salary-effort');
        var years = this.body.find('.year');
        if (salary != "") {
            efforts.map(function(i){
                //TODO annual salary increase
                $(years[i]).html(salary*$(this).val()*0.01);
            });
            var total = _.reduce(this.body.find('.year'),
                                 function(total, e){
                                     return total + parseFloat($(e).text());
                                 }, 0);
            this.body.find('.total').html(total);
        }
    }

    /**
     * Get the current costs for each year from this item.
     *
     * @returns {Number[]} - An array of numbers, one for each year
     */
    SalaryItem.prototype.val = function() {
        var out = [];
        this.body.find(".year").map(function(){
            out.push(parseFloat($(this).html()));
        });
        return out;
    }

    /**
     * Add a year to this item's display
     */
    SalaryItem.prototype.addYear = function() {
        var year = this.body.find(".year").length;
        var newYear = $.parseHTML(
            '<tr class="row">' +
                '<td class="col-sm-4">Year ' + (year+1) + '</td>' +
                '<td class="col-sm-4">' +
                    '<div class="input-group">' +
                        '<input type="text" class="form-control salary-effort" placeholder="Effort">' +
                        '<span class="input-group-addon hidden-sm hidden-xs">%</span>' +
                    '</div>' +
                '</td>' +
                '<td class="col-sm-4 year">0.00</td>' +
            '</tr>'
        );
        $(newYear).insertBefore(this.body.find(".salary-totals .row:last"));
    }

    /**
     * Remove a year from this item's display
     */
    SalaryItem.prototype.removeYear = function() {
        this.body.find(".salary-totals .row").eq(-2).remove();
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
