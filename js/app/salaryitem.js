/**
 * A module which defines the 'rows' which are placed in the SalaryWidget
 * @module app/salaryitem
 */
define(["jquery", "jquery.autocomplete.min", "app/utils"],
function(jquery, autocomplete, utils){
    "use strict"

    /**
     * Type which defines a line in the salary widget
     * @alias module:app/salaryitem
     *
     * @param {DOM Element} elem - The element to fill with this item
     * @param {SalaryWidget} widget - The widget owning this element
     * @param {Moment} start - Start time of this item
     * @param {Moment} end - End time of this item
     * @param {object} config - Restore this item from the given config
     */
    var SalaryItem = function(elem, widget, start, end, config) {
        this.parent = widget;
        this.start = start;
        this.end = end;
        this.body = $("<div>")
            .load("bodies/salaryitem.html",
                  null,
                  function(){
                      this.init();
                      this.updateDuration(start, end);
                      if (config)
                          this.restore(config);

                      // Setup autocomplete
                      this.body.find(".salary-name").autocomplete({
                          serviceUrl: "/lookup.php",
                          lookupLimit: 10,
                          onSelect : function(completion) {
                              this.body.find(".salary-salary").val(completion.data.salary);
                              if (completion.data.duration.trim() === "9-mth") {
                                  this.body.find(".salary-type").html("9-month ");
                              } else {
                                  this.body.find(".salary-type").html("Annual ");
                              }
                          }.bind(this)
                      });
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
     * Restore this item to the state specified by 'config'
     *
     * @param {object} config - The configuration object
     */
    SalaryItem.prototype.restore = function(config) {
        this.start = this.parent.start;
        this.end = this.parent.end;
        this.updateDuration(this.start, this.end);
        this.body.find(".salary-name").val(config.name);
        this.body.find(".salary-salary").val(config.salary);
        this.body.find(".salary-effort").map(function(i){
            $(this).val(config.efforts[i]);
        });
        this.update();
    }

    /**
     * Get an object which can be used to restore this item to a prior state
     */
    SalaryItem.prototype.save = function() {
        var config = {
            name : this.body.find(".salary-name").val(),
            salary : this.body.find(".salary-salary").val(),
            efforts: this.body.find(".salary-effort").map(function(){
                return $(this).val()
            }).get()
        };
        return config;
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
                var effort = $(this).val()*0.01;
                var raise = Math.pow(1+$("#settings-raise-percent").val()*0.01, i);
                $(years[i]).text(utils.asCurrency(salary*effort*raise));
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
    SalaryItem.prototype.updateDuration = function(start, end) {
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
                '<td class="col-sm-4">$<span class="year currency">0.00</></td>' +
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
            name, duration, salary, effort,
            {value: 'INDIRECT("C" & ROW())*INDIRECT("D" & ROW())*0.01',
             metadata: {type: 'formula'}}
        ];
    }

    return SalaryItem;
});
