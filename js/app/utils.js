/**
 * A module which provides some helpful utility functions
 */
define(function(){
    "use strict"

    Number.prototype.format = function(n, x) {
        var n = n || 2;
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    };

    var utils = {

        fromCurrency : function(str) {
            if (!str.replace)
                return str;
            var str = str.replace(/,/g, '');
            return parseFloat(str);
        },
        yearsBetween : function(start, end) {
            var s = start.clone();
            var e = end.clone();

            var years = e.year() - s.year();
            if (e.months() > 5) {
                years += 1;
            }
            if (s.months() < 6) {
                years += 1;
            }
            return years;
        },
        fiscalYearName : function(date, i) {
            var s = date.clone();
            s.add(i, "year");
            if (s.months() >= 6) {
                return s.year() + 1;
            } else {
                return s.year();
            }
        },
        monthsOfYearWorked : function(i, start, end) {
            var budgetStart = moment($("#settings-start-date").val());
            var budgetEnd = moment($("#settings-end-date").val());
            var start = start || budgetStart.clone();
            var end = end || budgetEnd.clone();

            var yearStart = budgetStart.clone();
            yearStart.add(i, "year");
            if (yearStart.month() >= 6) {
                yearStart = moment({year : yearStart.year(), month: 6, day: 1});
            } else {
                yearStart = moment({year : yearStart.year()-1, month: 6, day: 1});
            }

            var yearEnd = budgetStart.clone();
            yearEnd.add(i, "year");
            if (yearEnd.month() <= 5) {
                yearEnd = moment({year : yearEnd.year(), month: 5, day: 30});
            } else {
                yearEnd = moment({year : yearEnd.year()+1, month: 5, day: 30});
            }

            var intersection = null;

            // The employee worked less than a year, during this year
            if (start >= yearStart && end <= yearEnd) {
                var workedRange = moment().range(start.clone(), end.clone());
                var yearRange = moment().range(yearStart, yearEnd);
                var intersection = workedRange.intersect(yearRange);
            }

            // The employee started working this year, and continues
            else if (start >= yearStart && start < yearEnd && end >= yearEnd) {
                var workedRange = moment().range(start.clone(), yearEnd);
                var yearRange = moment().range(yearStart, yearEnd);
                var intersection = workedRange.intersect(yearRange);
            }

            // The employee was working previously, but stopped this year
            else if (start <= yearStart && end <= yearEnd && end > yearStart) {
                var workedRange = moment().range(yearStart, end.clone());
                var yearRange = moment().range(yearStart, yearEnd);
                var intersection = workedRange.intersect(yearRange);
            }

            else if (start <= yearStart && end >= yearEnd) {
                return 12;
            }

            if (!intersection)
                return 0;
            return Math.round((intersection.diff("days")/30)*2)/2;
        }
    };

    return utils;
});
