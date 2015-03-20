/**
 * A module which exposes a way to update global settings
 * @module app/settingswidget
 */
define(["jquery", "app/widget", "moment"],
function(jquery, Widget, moment){
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
                widget.update();
            });
        }.bind(this));

        $("#settings-start-date, #settings-end-date").change(function(){
            _.map(this.widgets, function(widget){
                var start = $("#settings-start-date").val();
                var end = $("#settings-end-date").val()
                if (!start || !end) {
                    return;
                }
                widget.updateDuration(moment(start), moment(end));
            });
        }.bind(this));
    }

    SettingsWidget.prototype.serialize = function() {
        var start = $("#settings-start-date").val();
        var end = $("#settings-end-date").val()
        if (!start || !end) {
            return;
        }
        start = moment(start);
        end = moment(end);
        return [
            ["Title:" + $("#settings-title").val()],
            ["Author: " + $("#settings-author").val()],
            ["Budget for the period from " + start.format("do, MMMM Do YYYY")
             + " to " + end.format("do, MMMM Do YYYY")],
            [$("#settings-raise-percent").val() + "% raise factor in effect"]
        ];
    }

    return SettingsWidget;
});
