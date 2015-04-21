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
        }
    };

    return utils;
});
