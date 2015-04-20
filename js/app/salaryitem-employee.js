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
                  }.bind(this)).data("item", this);
        elem.append(this.body);
        return this;
    }

    /**
     * Initialize this salary item. This function will be invoked after the body
     * div has been populated but before it is inserted into the DOM.
     */
    SalaryItemEmployee.prototype.init = function() {
        this.body.find('.item-remove').click(function(){
            $(document.body).trigger("salary-removed");
        });

        // Setup autocomplete
        this.body.find(".salary-name").autocomplete({
            serviceUrl: "lookup.php",
            lookupLimit: 10,
            autoSelectFirst : true,
            onSelect : function(completion) {
                this.body.find(".salary-salary").val(completion.data.salary);
                if (completion.data.duration.trim() === "9-mth") {
                    this.body.find(".salary-type").html("9-month ");
                } else {
                    this.body.find(".salary-type").html("12-month ");
                }
            }.bind(this)
        });

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
            this.updateEmployeeDuration(
                moment(this.body.find(".salary-start-date").val()),
                moment(this.body.find(".salary-end-date").val())
            );
        }.bind(this));

        this.body.find(".salary-start-date, .salary-end-date").datepicker({
            changeMonth: true,
            changeYear: true,
        });
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
        this.updateEmployeeDuration(this.start, this.end);
        this.body.find(".salary-name").val(config.name);
        this.body.find(".salary-salary").val(config.salary);
        setTimeout(function(){
            this.body.find(".salary-effort").map(function(i){
                $(this).val(config.efforts[i]);
            });
            this.update();
            this.parent.update();
        }.bind(this), 300);
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
        var budgetStart = moment($("#settings-start-date").val());
        var budgetEnd = moment($("#settings-end-date").val());

        var yearStart = budgetStart.clone();
        yearStart.add(i, "year");
        yearStart.startOf('year');

        var yearEnd = budgetStart.clone();
        yearEnd.add(i, "year");
        yearEnd.endOf('year');

        var intersection = null;

        // The employee worked less than a year, during this year
        if (this.start >= yearStart && this.end <= yearEnd) {
            var workedRange = moment().range(this.start.clone(), this.end.clone());
            var yearRange = moment().range(yearStart, yearEnd);
            var intersection = workedRange.intersect(yearRange);
        }

        // The employee started working this year, and continues
        else if (this.start >= yearStart && this.start < yearEnd && this.end >= yearEnd) {
            var workedRange = moment().range(this.start.clone(), yearEnd);
            var yearRange = moment().range(yearStart, yearEnd);
            var intersection = workedRange.intersect(yearRange);
        }

        // The employee was working previously, but stopped this year
        else if (this.start <= yearStart && this.end <= yearEnd && this.end > yearStart) {
            var workedRange = moment().range(yearStart, this.end.clone());
            var yearRange = moment().range(yearStart, yearEnd);
            var intersection = workedRange.intersect(yearRange);
        }

        else if (this.start <= yearStart && this.end >= yearEnd) {
            return 12;
        }

        if (!intersection)
            return 0;
        return Math.round((intersection.diff("days")/30)*2)/2;
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

                var months = self.monthsOfYearWorked(i);
                var yearCost = monthlySalary*months*effort*raise
                $(years[i]).text(yearCost.format());
            });
            var total = _.reduce(this.body.find('.year'),
                                 function(total, e){
                                     return total + utils.fromCurrency($(e).text());
                                 }, 0);
            this.body.find('.total').text(total.format());
        }
    }

    /**
     * Make this item able to represent the duration start-end
     *
     * @param {Moment} start - New start time of the item
     * @param {Moment} end - New end time of the item
     */
    SalaryItemEmployee.prototype.updateDuration = function(start, end) {
        this.totalBudgetStart = start;
        this.totalBudgetEnd = end;

        var yearsBetween = utils.yearsBetween(start, end);
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

    SalaryItemEmployee.prototype.updateEmployeeDuration = function(start, end)  {
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
                self.update();
                self.parent.update();
            } else {
                $(this).parents(".row:first").show();
            }
        });
    }


    /**
     * Get the current costs for each year from this item.
     *
     * @returns {Number[]} - An array of numbers, one for each year
     */
    SalaryItemEmployee.prototype.val = function() {
        var out = [];
        this.body.find(".year").map(function(){
            if ($(this).is(":visible")) {
                out.push(utils.fromCurrency($(this).html()));
            } else {
                out.push(0);
            }
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
                '<td class="col-sm-4 small-font">Fiscal Year ' + (this.start.year()+year) + '</td>' +
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
    SalaryItemEmployee.prototype.serialize = function(heading, money, percent) {
        var name = this.body.find(".salary-name").val();
        var salary = this.body.find(".salary-salary").val();
        var duration = this.body.find(".salary-type").text();
        var efforts = this.body.find(".salary-effort");

        var nameLine = ["", name || "Graduate Student", "", ""];

        efforts.each(function(){
            nameLine.push({value: parseFloat($(this).val())*0.01,
                           metadata : {style : percent.id}});
        });

        var totalsLine = ["", {value: utils.fromCurrency(salary),
                               metadata : {style: money.id}},
                          duration, ""];
        this.val().forEach(function(total){
            totalsLine.push({value: total, metadata : {style: money.id}});
        });

        totalsLine.push({value: _.reduce(this.val(), function(t, value){
            return t + value;
        }), metadata : {style: money.id}});

        return [
            nameLine, totalsLine
        ];
    }

    return SalaryItemEmployee;
});
