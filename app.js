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

require(["excel-builder", "moment", "app/salarywidget", "app/equipmentwidget"],
function (EB, moment, SalaryWidget, EquipmentWidget) {
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

    widgets = [];
    $(document).ready(function() {
        widgets = [
            new SalaryWidget($(".container")),
            new EquipmentWidget($(".container"))
        ]
        $("#download").click(download);
        $("#start-date, #end-date").change(function(){
            widgets.map(function(widget){
                var start = $("#start-date").val();
                var end = $("#end-date").val()
                if (!start || !end) {
                    return;
                }
                widget.updateDuration(moment(start), moment(end));
            })
        });
    });
});
