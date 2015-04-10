define(["jquery", "app/utils"], function(jquery, utils){
    "use strict"

    var TravelItemNational = function(elem, widget, start, end, config) {
        this.parent = widget;
        this.start = start;
        this.end = end;
        this.body = $("<div>")
            .load("bodies/travelnational.html",
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

    TravelItemNational.prototype.itemName = "National";

    TravelItemNational.prototype.init = function() {
        var self = this;
        this.body.find('.item-remove').click(function(){
            this.body.remove();
            this.parent.removeItem(this);
        }.bind(this));

        this.body.find('.travel-state').change(function(){
            $.get("travel.php", {state : $(this).val()}, function(data){
                var elem = $($.parseHTML(data));
                var cities = self.body.find(".travel-city");
                cities.empty().append(elem.find("#city option"));
            })
        });

        this.body.find('.travel-city').change(function(){
            $.get("travel.php", {stat : self.body.find(".travel-state").val(),
                                 city : $(this).val()},
                  function(data){
                      var elem = $($.parseHTML(data));
                      var cost = elem.find("#data_div_summary dd").html();
                      cost = cost.replace(/\$/g, '');
                      var perDiem = self.body.find(".travel-per-diem")
                          .val(cost);
                      self.update();
                  });
        });
    }

    TravelItemNational.prototype.save = function() {
        return {
            core : parseInt(this.body.find(".travel-core-affiliate").val()),
            people : parseInt(this.body.find(".travel-people-number").val()),
            nights : parseInt(this.body.find(".travel-nights").val()),
            days : parseInt(this.body.find(".travel-days").val()),
            perDiem : parseFloat(this.body.find(".travel-per-diem").val()),
            lodging : parseFloat(this.body.find(".travel-lodging").val()),
            airfare : parseFloat(this.body.find(".travel-airfare").val()),
            trips : parseInt(this.body.find(".travel-trips").val()),
            misc : parseFloat(this.body.find(".travel-misc").val())
        };
    }

    TravelItemNational.prototype.restore = function(config) {
        this.body.find(".travel-core-affiliate").val(config.core);
        this.body.find(".travel-people-number").val(config.people);
        this.body.find(".travel-nights").val(config.nights);
        this.body.find(".travel-days").val(config.days);
        this.body.find(".travel-per-diem").val(config.perDiem);
        this.body.find(".travel-lodging").val(config.lodging);
        this.body.find(".travel-airfare").val(config.airfare);
        this.body.find(".travel-trips").val(config.trips);
        this.body.find(".travel-misc").val(config.misc);
        this.update();
    }

    TravelItemNational.prototype.update = function() {
        var total = _.reduce(this.val(), function(t, v) {return t + v;});

        var display = "-.--";
        if (total) {
            display = utils.asCurrency(total);
        }
        this.body.find(".travel-cost").html(display);
    }

    TravelItemNational.prototype.updateDuration = function(start, end) {
        this.start = start;
        this.end = end;

        if (!this.start || !this.end || !this.end.diff) {
            return;
        }

        var years = utils.yearsBetween(this.start, this.end);
        while(this.body.find(".item-year option").length != years) {
            if (this.body.find(".item-year option").length > years) {
                this.removeYear();
            } else {
                this.addYear();
            }
        }
        this.update();
        this.parent.update();
    }

    TravelItemNational.prototype.addYear = function() {
        var year = this.body.find(".item-year option").length;
        this.body.find(".item-year").append(
            $("<option>").attr("value", year).text(year+this.start.year())
        );
    }

    TravelItemNational.prototype.removeYear = function() {
        this.body.find(".item-year option:last").remove();
    }

    TravelItemNational.prototype.val = function() {
        var arr = [];
        for (var i=0; i < this.body.find(".item-year option").length; ++i) {
            arr.push(0);
        }
        var purchaseYear = parseInt(this.body.find(".item-year").val());

        var config = this.save();
        arr[purchaseYear] = (config.airfare + (config.lodging * config.people * config.nights) +
                             (config.perDiem * config.days*  config.people)) * config.core + config.misc;
        arr[purchaseYear] = arr[purchaseYear] || 0;
        return arr;
    }

    return TravelItemNational;
});
