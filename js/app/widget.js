/**
 * A module which defines a generic widget
 * @module app/widget
 */
define(["jquery", "app/utils"], function(jquery, utils){
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

        var yearBase = this.body.find('.widget-year').map(function(){
            return 0;
        }).get();

        var years = _.reduce(values, function(t, vals){
            return t.map(function(val, i){
                return val + vals[i];
            });
        }, yearBase);

        var total = _.reduce(years, function(t, year){
            return t + year;
        });

        this.body.find(".widget-year").map(function(i){
            $(this).text(utils.asCurrency(years[i]));
        });
        this.body.find(".widget-total").text(utils.asCurrency(total));
    }

    /**
     * Create an object which may be passed to "restore" to restore this widget
     * to a prior state
     */
    Widget.prototype.save = function() {
        return {
            items: this.items.map(function(item){
                return item.save();
            }),
            start: this.start,
            end: this.end
        };
    }

    /**
     * Restore this widget to the state specified by "config"
     *
     * @param {object} config - The configuration object
     */
    Widget.prototype.restore = function(config) {
        this.start = config.start;
        this.end = config.end;

        // Restore from the config, adding items as needed
        config.items.map(function(itemConfig, i){
            if (i < this.items.length) {
                this.items[i].restore(itemConfig);
            } else {
                this.addItem(itemConfig);
            }
        }, this);

        // Remove excess items
        while (this.items.length > config.length) {
            this.removeItem(this.items[this.items.length]);
        }

        // Delay because adding items is async
        setTimeout(function(){
            this.updateDuration(this.start, this.end);
            this.update();
        }.bind(this), 100)
    }

    Widget.prototype.updateDuration = function(start, end) {
        this.start = start;
        this.end = end;

        var years = Math.ceil(end.diff(start, 'years', true));
        while(this.body.find(".widget-year").length != years) {
            if (this.body.find(".widget-year").length > years) {
                this.removeYear();
            } else {
                this.addYear();
            }
        }

        this.items.map(function(item){
            item.updateDuration(start, end);
        });
    }

    /**
     * Add another year to this widget's display
     */
    Widget.prototype.addYear = function() {
        var year = this.body.find('.widget-year').length;
        var newYear = $.parseHTML(
            '<td class="widget-year-cell"><i>Year ' + (year+1) + '</i>: $<span class="widget-year currency">0.00</span></td>'
        );
        $(newYear).insertBefore(this.body.find(".widget-total-cell"));
    }

    /**
     * Remove a year from the widget's display
     */
    Widget.prototype.removeYear = function() {
        this.body.find(".widget-year-cell:last").remove();
        this.update();
    }

    /**
     * Add a row to this widget
     *
     * @param {object} config - Optional configuration object
     */
    Widget.prototype.addItem = function(config) {
        this.items.push(
            new this.type(this.body.find(".panel-body"),
                          this,
                          this.start,
                          this.end,
                          config)
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
