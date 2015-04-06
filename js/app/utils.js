/**
 * A module which provides some helpful utility functions
 */
define(function(){
    "use strict"

    var utils = {
        asCurrency : function(value){
            return value.toFixed(2);
        }
    };

    return utils;
});
