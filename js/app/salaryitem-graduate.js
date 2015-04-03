/**
 * A module which defines the 'rows' which are placed in the SalaryWidget
 * @module app/salaryitem-graduate
 */
define(["jquery", "app/utils", "app/salaryitem-employee"],
function(jquery, utils, SalaryItemEmployee){
    "use strict"

    /**
     * Type which defines a line in the salary widget
     * @alias module:app/salaryitem-graduate
     *
     * @param {DOM Element} elem - The element to fill with this item
     * @param {SalaryWidget} widget - The widget owning this element
     * @param {Moment} start - Start time of this item
     * @param {Moment} end - End time of this item
     * @param {object} config - Restore this item from the given config
     */
    var SalaryItemGraduate = function(elem, widget, start, end, config) {
        this.parent = widget;
        this.start = start;
        this.end = end;
        this.body = $("<div>")
            .load("bodies/salaryitem-graduate.html",
                  null,
                  function(){
                      this.init();
                      this.updateDuration(start, end);

                      // Trigger event so contractual will update
                      $(document.body).trigger("graduate-added");
                      this.body.find('.item-remove').click(function(){
                          $(document.body).trigger("graduate-added");
                      });

                      if (config)
                          this.restore(config)
                  }.bind(this)).data("item", this);
        elem.append(this.body);
        return this;
    }

    SalaryItemGraduate.prototype = new SalaryItemEmployee();
    SalaryItemGraduate.prototype.itemName = "Graduate Student";
    return SalaryItemGraduate;
});
