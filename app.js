// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        // All application files can be required with 'app/<name>'
        app: '../app'
    },
});

require(["excel-builder", "app/settingswidget", "app/totalswidget",
         "app/salarywidget", "app/equipmentwidget"],
function (EB, SettingsWidget, TotalsWidget, SalaryWidget, EquipmentWidget) {
    var widgets = [];
    var settings = null;
    var totals = null;

    var download = function() {
        var artistWorkbook = EB.createWorkbook();
        var albumList = artistWorkbook.createWorksheet();
        var stylesheet = artistWorkbook.getStyleSheet();

        var content = [settings.serialize(), [""]];
        for (var name in widgets) {
            var widget = widgets[name];
            content.push(widget.serialize());
            content.push([""]);
        }
        content.push(totals.serialize());

        var merged = [];
        merged = merged.concat.apply(merged, content);

        albumList.setData(merged);
        artistWorkbook.addWorksheet(albumList);

        albumList.setColumns([
            {width: 3},
            {width: 13},
            {width: 13}
        ]);

        $("<a>").attr({
            download: "file.xlsx",
            href: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
                EB.createFile(artistWorkbook)
        })[0].click();
    }

    $(document).ready(function() {
        widgets = {
            "salary" : new SalaryWidget($(".container")),
            "equipment" : new EquipmentWidget($(".container"))
        };
        settings = new SettingsWidget($(".container"), widgets);
        totals = new TotalsWidget($(".container"), widgets);

        $(document).on("change keyup click", function(){
            var start = $("#settings-start-date").val();
            var end = $("#settings-end-date").val()
            if (!start || !end) {
                return;
            }
            totals.update();
        })

        $("#download").click(download);
    });
});
