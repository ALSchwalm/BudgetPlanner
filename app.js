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

require(["excel-builder", "moment", "app/settingswidget", "app/totalswidget",
         "app/salarywidget", "app/equipmentwidget", "app/contractwidget",
         "app/subcontractwidget", "app/travelwidget", "app/fringebenefitswidget",
         "app/commoditieswidget"],
function (EB, moment, SettingsWidget, TotalsWidget, SalaryWidget, EquipmentWidget,
          ContractWidget, SubContractWidget, TravelWidget, FringeBenefitsWidget,
          CommoditiesWidget) {
    var widgets = {};
    var settings = null;
    var totals = null;

    var download = function() {
        var artistWorkbook = EB.createWorkbook();
        var albumList = artistWorkbook.createWorksheet();
        var stylesheet = artistWorkbook.getStyleSheet();

        var headingFormatter = stylesheet.createFormat({
            font: {
                bold: true,
            },
            format: '$#,##0.00'
        });

        var moneyFormatter = stylesheet.createFormat({
            format: '$#,##0.00'
        });

        var percentFormatter = stylesheet.createFormat({
            format: '0.0#%',
            font : {
                color: "FF0000FF"
            }
        });


        var content = [
            settings.serialize(headingFormatter, moneyFormatter),
            widgets["salary"].serialize(headingFormatter, moneyFormatter, percentFormatter),
            widgets["fringebenefits"].serialize(headingFormatter, moneyFormatter),
            widgets["travel"].serialize(headingFormatter, moneyFormatter),
            widgets["subcontract"].serialize(headingFormatter, moneyFormatter),
            widgets["contract"].serialize(headingFormatter, moneyFormatter),
            widgets["commodities"].serialize(headingFormatter, moneyFormatter),
            widgets["equipment"].serialize(headingFormatter, moneyFormatter),
            totals.serialize(headingFormatter, moneyFormatter)
        ];

        var merged = [];
        merged = merged.concat.apply(merged, content);

        albumList.setData(merged);
        artistWorkbook.addWorksheet(albumList);

        albumList.setColumns([
            {width: 5},
            {width: 30},
            {width: 16}, {width: 16}, {width: 16},
            {width: 16}, {width: 16}, {width: 16},
            {width: 16}, {width: 16}, {width: 16}
        ]);

        var link = $("<a>").attr({
            download: "file.xlsx",
            href: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
                EB.createFile(artistWorkbook)
        }).css("display", "none");
        $("body").append(link);
        link[0].click();
    }

    save = function() {
        var config = {};
        for (var key in widgets) {
            if (key !== "totals") {
                config[key] = widgets[key].save();
            }
        }

        $.post("save.php", {
            id : location.search.split('id=')[1],
            pi : $("#settings-author").val(),
            title : $("#settings-title").val(),
            data : JSON.stringify(config)
        }, function(data){
            console.log("saved");
            alert("Save complete.");
        });

        return config;
    }

    restore = function(config) {
        widgets["settings"].restore(config["settings"]);
        var i=1;
        for (var key in config) {
            setTimeout(function(key){
                return function() {
                    if (key !== "totals" && key !== "settings") {
                        console.log("restoring", key);
                        widgets[key].restore(config[key]);
                    }
                }
            }(key), i*1000);
            ++i;
        }

        setTimeout(function(){
            totals.update();
        }, 1000*i);
    }

    $(document).ready(function() {
        widgets = {
            "salary" : new SalaryWidget($(".container")),
            "fringebenefits" : new FringeBenefitsWidget($(".container")),
            "travel" : new TravelWidget($(".container")),
            "subcontract" : new SubContractWidget($(".container")),
            "contract" : new ContractWidget($(".container")),
            "commodities" : new CommoditiesWidget($(".container")),
            "equipment" : new EquipmentWidget($(".container")),
        };

        settings = new SettingsWidget($(".container"), widgets);
        totals = new TotalsWidget($(".container"), widgets);
        settings.totals = totals;

        widgets["fringebenefits"].salaryWidget = widgets["salary"];
        benefits = widgets["fringebenefits"]; // TODO remove this

        widgets["settings"] = settings;

        var updateTotals = function(){
            totals.update();
        }
        $(document).on("change keyup click", updateTotals);

        window.onbeforeunload = function(){
            return 'Any unsaved changes will be lost.';
        };

        $("#download").click(function(e){
            e.preventDefault();
            download()
        });
        $("#save").click(function(e){
            e.preventDefault();
            save();
        });

        // Try to restore with this ID, do nothing otherwise
        setTimeout(function(){
            $.get("restore.php", {
                id : location.search.split('id=')[1],
            }, function(data){
                if (JSON.parse(data)) {
                    var restoreData =
                        JSON.parse(JSON.parse(data).data.replace(/\\/g, ""))
                    restore(restoreData);

                    for (var key in widgets) {
                        if (widgets[key].body) {
                            widgets[key].body.find(".row:first").show();
                        }
                    }
                    totals.body.find(".row:first").show();
                    $("#continue-button").remove();
                    updateTotals();
                }
            });
        }, 400);
    });
});
