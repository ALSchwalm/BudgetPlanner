/**
 * A module which provides some helpful utility functions
 */
define(function(){
    "use strict"

    var utils = {
        asCurrency : function(value){
            return value.toFixed(2);
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
