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
    }

    Widget.prototype.update = function() {
        var elems = this.body.find(".total");
        var total = _.reduce(elems, function(total, e){
            return total + parseFloat($(e).text());
        }, 0);
        this.body.find(".widget-total").text(total);
    }

    /**
     * Add a row to this widget
     */
    Widget.prototype.addItem = function() {
        this.items.push(
            new this.type(this.body.find(".panel-body"), this)
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
