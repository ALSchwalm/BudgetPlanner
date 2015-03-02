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

require(['excel-builder', "app/salarywidget", "app/equipmentwidget"],
function (EB, SalaryWidget, EquipmentWidget) {
    var download = function() {
        var artistWorkbook = EB.createWorkbook();
        var albumList = artistWorkbook.createWorksheet();
        var stylesheet = artistWorkbook.getStyleSheet();

        albumList.setData(widget.serialize());
        artistWorkbook.addWorksheet(albumList);

        $("<a>").attr({
            download: "file.xlsx",
            href: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
                EB.createFile(artistWorkbook)
        })[0].click();
    }

    var widgets = [];
    $(document).ready(function() {
        widgets = [
            new SalaryWidget($(".container")),
            new EquipmentWidget($(".container"))
        ]
        $("#download").click(download);
        $("#add-year").click(function(){
            widgets.map(function(w){
                w.addYear();
            });
        });
        $("#remove-year").click(function(){
            widgets.map(function(w){
                w.removeYear();
            });
        });
    });
});
