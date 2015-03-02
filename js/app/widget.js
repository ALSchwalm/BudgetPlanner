/**
 * A module which defines a generic widget
 * @module app/widget
 */
define(["jquery"], function(jquery){
    "use strict"

    /**
     * Type which defines a generic widget
     * @alias module:app/widget
     *
     * @param {DOM Element} elem - The element to fill with this widget
     */
    var Widget = function(name, type) {
        this.type = type;
        this.name = name;
        this.items = [];
    }

    /**
     * Initialize this widget.
     *
     * @param {string} name - The name of this widget
     * @param {DOM} elem - The element to be filled with this widget
     */
    Widget.prototype.init = function(elem) {
        var self = this;
        this.body = $("<div>")
            .load("bodies/widget.html",
                  null, function(){
                      self.body.find(".widget-add").click(function(){
                          self.addItem();
                      });
                      self.body.find(".widget-name").text(self.name);
                  });
        elem.append(this.body);

        this.body.keyup(this.update.bind(this));
        this.body.change(this.update.bind(this));
    }

    /**
     * Bring the values displayed by this widget up-to-date. This
     * method will be invoked whenever the underlying items change.
     */
    Widget.prototype.update = function() {
        this.items.map(function(item){
            item.update();
        });

        var values = this.items.map(function(item){
            return item.val();
        });

        var years = _.reduce(values, function(t, vals){
            return t.map(function(val, i){
                return val + vals[i];
            });
        });

        var total = _.reduce(years, function(t, year){
            return t + year;
        });

        this.body.find(".widget-year").map(function(i){
            $(this).text(years[i]);
        });
        this.body.find(".widget-total").text(total);
    }

    /**
     * Add another year to this widget's display
     */
    Widget.prototype.addYear = function() {
        this.items.map(function(item){
            item.addYear();
            item.update();
        })

        var year = this.body.find('.widget-year').length;
        var newYear = $.parseHTML(
            '<td class="widget-year-cell">Year ' + (year+1) + ': <span class="widget-year">0.00</span></td>'
        );
        $(newYear).insertBefore(this.body.find(".widget-total-cell"));
    }

    /**
     * Remove a year from the widget's display
     */
    Widget.prototype.removeYear = function() {
        this.items.map(function(item){
            item.removeYear();
            item.update();
        })

        this.body.find(".widget-year-cell:last").remove();
        this.update();
    }

    /**
     * Add a row to this widget
     */
    Widget.prototype.addItem = function() {
        var year = this.body.find('.widget-year').length;
        this.items.push(
            new this.type(this.body.find(".panel-body"), this, year)
        );
        return this;
    }

    /**
     * Remove the given item from this widget
     *
     * @param {Item} item - The item to remove
     */
    Widget.prototype.removeItem = function(item) {
        var index = this.items.indexOf(item);
        if (index != -1) {
            this.items.splice(index, 1);
        }
        this.update();
        return this;
    }

    return Widget;
});
