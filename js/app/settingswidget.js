/**
 * A module which exposes a way to update global settings
 * @module app/settingswidget
 */
define(["jquery", "app/widget", "moment", "jquery-ui"],
function(jquery, Widget, moment, jqueryui){
    "use strict"

    /**
     * Type which defines the settings widget
     * @alias module:app/settingswidget
     *
     * @param {DOM Element} elem - The element to fill with this widget
     */
    var SettingsWidget = function(elem, widgets) {
        this.body = $("<div>");
        this.widgets = widgets;
        this.body.load("bodies/settings.html",
                       null,
                       this.onAdded.bind(this));
        elem.prepend(this.body);
    }

    SettingsWidget.prototype.onAdded = function() {
        $("#settings-raise-percent").change(function(){
            _.map(this.widgets, function(widget){
                if (widget.update)
                    widget.update();
            });
        }.bind(this));

        $("#settings-project-type").change(function(){
            $("#settings-indirect-cost-rate").val($(this).val());
        });

        $("#settings-start-date, #settings-end-date").change(function(){
            this.update();
        }.bind(this));

        $("#settings-start-date, #settings-end-date").datepicker({
            changeMonth: true,
            changeYear: true,
        });
    }

    SettingsWidget.prototype.update = function() {
        _.map(this.widgets, function(widget, name){
            var start = $("#settings-start-date").val();
            var end = $("#settings-end-date").val()
            if (!start || !end) {
                return;
            }
            if (widget.updateDuration) {
                widget.updateDuration(moment(start), moment(end));
            }
        });
    }

    SettingsWidget.prototype.save = function() {
        return {
            "title" : $("#settings-title").val(),
            "author" : $("#settings-author").val(),
            "start-date" : $("#settings-start-date").val(),
            "end-date" : $("#settings-end-date").val(),
            "raise-percent" : $("#settings-raise-percent").val(),
            "indirect-cost-rate" : $("#settings-indirect-cost-rate").val(),
            "project-type" : $("#settings-project-type").val()
        };
    }

    SettingsWidget.prototype.restore = function(config) {
        $("#settings-title").val(config["title"]);
        $("#settings-author").val(config["author"]);
        $("#settings-start-date").val(config["start-date"]);
        $("#settings-end-date").val(config["end-date"]);
        $("#settings-raise-percent").val(config["raise-percent"]);
        $("#settings-indirect-cost-rate").val(config["indirect-cost-rate"]);
        $("#settings-project-type").val(config["project-type"]);
        this.update();
    }

    SettingsWidget.prototype.serialize = function(formatter) {
        var start = $("#settings-start-date").val();
        var end = $("#settings-end-date").val()
        if (!start || !end) {
            return;
        }
        start = moment(start);
        end = moment(end);
        return [
            [{value: "Title:" + $("#settings-title").val(), metadata: {style: formatter.id}}],
            [{value: "Budget for the period from " + start.format("MMMM Do YYYY")
              + " to " + end.format("MMMM Do YYYY"), metadata: {style: formatter.id}}],
            [{value: $("#settings-raise-percent").val() + "% raise factor in effect",
              metadata: {style: formatter.id}}]
        ];
    }

    return SettingsWidget;
});
