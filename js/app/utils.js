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
            var e = end.clone();
            e.subtract(1, 'days');
            var years = 1 + (e.year() - start.year());
            return years;
        }
    };

    return utils;
});
