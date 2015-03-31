/**
 * A module which defines the 'rows' which are placed in the SalaryWidget
 * @module app/salaryitem
 */
define(["jquery", "jquery.autocomplete.min", "app/utils", "moment", "moment-range"],
function(jquery, autocomplete, utils, moment, momentRange){
    "use strict"

    /**
     * Type which defines a line in the salary widget
     * @alias module:app/salaryitem-employee
     *
     * @param {DOM Element} elem - The element to fill with this item
     * @param {SalaryWidget} widget - The widget owning this element
     * @param {Moment} start - Start time of this item
     * @param {Moment} end - End time of this item
     * @param {object} config - Restore this item from the given config
     */
    var SalaryItemEmployee = function(elem, widget, start, end, config) {
        // Allow other items to 'inherit' from this one
        if (!elem)
            return;

        this.parent = widget;
        this.start = start;
        this.end = end;
        this.body = $("<div>")
            .load("bodies/salaryitem-employee.html",
                  null,
                  function(){
                      this.init();
                      this.updateDuration(start, end);
                      if (config)
                          this.restore(config);

                      $(document.body).trigger("salary-added");
                      this.body.find('.item-remove').click(function(){
                          $(document.body).trigger("salary-removed");
                      });

                      // Setup autocomplete
                      this.body.find(".salary-name").autocomplete({
                          serviceUrl: "/lookup.php",
                          lookupLimit: 10,
                          onSelect : function(completion) {
                              this.body.find(".salary-salary").val(completion.data.salary);
                              if (completion.data.duration.trim() === "9-mth") {
                                  this.body.find(".salary-type").html("9-month ");
                              } else {
                                  this.body.find(".salary-type").html("12-month ");
                              }
                          }.bind(this)
                      });
                  }.bind(this)).data("item", this);
        elem.append(this.body);
        return this;
    }

    /**
     * Initialize this salary item. This function will be invoked after the body
     * div has been populated but before it is inserted into the DOM.
     */
    SalaryItemEmployee.prototype.init = function() {
        this.body.find('.dropdown-menu a').click(function(e){
            $(this).parent().parent().siblings('button')
                .find(".salary-type").html($(this).attr("name"));
        });
        this.body.find('.item-remove').click(function(){
            this.body.remove();
            this.parent.removeItem(this);
        }.bind(this));

        this.body.keyup(this.update.bind(this));

        // Set the initial start/end date to the budget dates
        this.body.find(".salary-start-date").val(
            $("#settings-start-date").val()
        );

        this.body.find(".salary-end-date").val(
            $("#settings-end-date").val()
        );

        this.body.find(".salary-start-date, .salary-end-date").change(function(){
            this.updateDuration(
                moment(this.body.find(".salary-start-date").val()),
                moment(this.body.find(".salary-end-date").val())
            );
        }.bind(this));
    }

    /**
     * Restore this item to the state specified by 'config'
     *
     * @param {object} config - The configuration object
     */
    SalaryItemEmployee.prototype.restore = function(config) {
        this.body.find(".salary-start-date").val(config.start);
        this.body.find(".salary-end-date").val(config.end);
        this.start = moment(config.start)
        this.end = moment(config.end);
        this.updateDuration(this.start, this.end);
        this.body.find(".salary-name").val(config.name);
        this.body.find(".salary-salary").val(config.salary);
        this.body.find(".salary-effort").map(function(i){
            $(this).val(config.efforts[i]);
        });
        this.update();
    }

    SalaryItemEmployee.prototype.itemName = "Employee";

    /**
     * Get an object which can be used to restore this item to a prior state
     */
    SalaryItemEmployee.prototype.save = function() {
        var config = {
            start : this.body.find(".salary-start-date").val(),
            end : this.body.find(".salary-end-date").val(),
            name : this.body.find(".salary-name").val(),
            salary : this.body.find(".salary-salary").val(),
            efforts: this.body.find(".salary-effort").map(function(){
                return $(this).val()
            }).get()
        };
        return config;
    }

    /**
     * Determine how many months of the given year were worked.
     *
     * @param i - The number of years offset from the starting year
     */
    SalaryItemEmployee.prototype.monthsOfYearWorked = function(i) {
        var totalRange = moment().range(this.start.clone(), this.end.clone());
        var yearStart = this.start.clone();
        yearStart.add(i, "year");
        yearStart.startOf('year');

        var yearEnd = this.start.clone();
        yearEnd.add(i, "year");
        yearEnd.endOf('year');

        var yearRange = moment().range(yearStart, yearEnd);
        var intersection = yearRange.intersect(totalRange);
        intersection.end.add(15, "days");
        return intersection.diff("months");
    }

    /**
     * Bring this item up-to-date.
     */
    SalaryItemEmployee.prototype.update = function() {
        var salary = this.body.find('.salary-salary').val();
        if(this.body.find(".salary-type").text().trim() == "12-month"){
            var monthlySalary = salary/12;
        } else {
            var monthlySalary = salary/9;
        }

        var efforts = this.body.find('.salary-effort');
        var years = this.body.find('.year');
        if (salary != "") {
            var self = this;
            efforts.map(function(i){
                var effort = $(this).val()*0.01;
                var raise = Math.pow(1+$("#settings-raise-percent").val()*0.01, i);

                var months = self.monthsOfYearWorked(i) || 12;
                var yearCost = monthlySalary*months*effort*raise
                $(years[i]).text(utils.asCurrency(yearCost));
            });
            var total = _.reduce(this.body.find('.year'),
                                 function(total, e){
                                     return total + parseFloat($(e).text());
                                 }, 0);
            this.body.find('.total').text(utils.asCurrency(total));
        }
    }

    /**
     * Make this item able to represent the duration start-end
     *
     * @param {Moment} start - New start time of the item
     * @param {Moment} end - New end time of the item
     */
    SalaryItemEmployee.prototype.updateDuration = function(start, end) {
        this.start = start;
        this.end = end;

        var years = Math.ceil(end.diff(start, 'years', true));
        while(this.body.find(".year").length != years) {
            if (this.body.find(".year").length > years) {
                this.removeYear();
            } else {
                this.addYear();
            }
        }
    }


    /**
     * Get the current costs for each year from this item.
     *
     * @returns {Number[]} - An array of numbers, one for each year
     */
    SalaryItemEmployee.prototype.val = function() {
        var out = [];
        this.body.find(".year").map(function(){
            out.push(parseFloat($(this).html()));
        });
        return out;
    }

    /**
     * Add a year to this item's display
     */
    SalaryItemEmployee.prototype.addYear = function() {
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
                '<td class="col-sm-4">$<span class="year currency">0.00</></td>' +
            '</tr>'
        );
        $(newYear).insertBefore(this.body.find(".salary-totals .row:last"));
    }

    /**
     * Remove a year from this item's display
     */
    SalaryItemEmployee.prototype.removeYear = function() {
        this.body.find(".salary-totals .row").eq(-2).remove();
    }

    /**
     * Convert this SalaryItemEmployee to an array suitable for being passed to excel-builder
     */
    SalaryItemEmployee.prototype.serialize = function() {
        var name = this.body.find(".salary-name").val();
        var salary = this.body.find(".salary-salary").val();
        var duration = this.body.find(".salary-type").text();
        var effort = this.body.find(".salary-effort").val();
        return [
            "", name, duration, salary, effort,
            {value: 'INDIRECT("D" & ROW())*INDIRECT("E" & ROW())*0.01',
             metadata: {type: 'formula'}}
        ];
    }

    return SalaryItemEmployee;
});
