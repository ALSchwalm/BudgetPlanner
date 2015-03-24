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

require(["excel-builder", "app/settingswidget",
         "app/salarywidget", "app/equipmentwidget", "app/contractwidget"],
function (EB, SettingsWidget, SalaryWidget, EquipmentWidget, ContractWidget) {
    var widgets = [];

    var download = function() {
        var artistWorkbook = EB.createWorkbook();
        var albumList = artistWorkbook.createWorksheet();
        var stylesheet = artistWorkbook.getStyleSheet();

        var content = [];
        for (var i=0; i < widgets.length; ++i){
            content.push(widgets[i].serialize());
            content.push([""]);
        }

        var merged = [];
        merged = merged.concat.apply(merged, content);

        albumList.setData(merged);
        artistWorkbook.addWorksheet(albumList);

        $("<a>").attr({
            download: "file.xlsx",
            href: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
                EB.createFile(artistWorkbook)
        })[0].click();
    }

    $(document).ready(function() {
        widgets = [
            new SalaryWidget($(".container")),
            new EquipmentWidget($(".container")),
            new ContractWidget($(".container"))
        ];
        var settings = new SettingsWidget($(".container"), widgets);
        $("#download").click(download);
    });
});
