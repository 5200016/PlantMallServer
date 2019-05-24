import Vue from 'vue'
export const public_deep_copy = obj => {
    if(typeof obj != 'object'){
        return obj;
    }
    if (obj instanceof Array) {
        return obj
    } else {
        let newobj = {};
        for ( var attr in obj) {
            Vue.set(newobj, attr, public_deep_copy(obj[attr]))
        }
        return newobj;
    }
}
export const clone = (obj) => {
    if(obj) {
        var str, newobj = obj.constructor === Array ? [] : {};
        if(typeof obj !== 'object'){
            return;
        } else if(window.JSON){
            str = JSON.stringify(obj), //系列化对象
                newobj = JSON.parse(str); //还原
        } else {
            for(var i in obj){
                newobj[i] = typeof obj[i] === 'object' ?
                    clone(obj[i]) : obj[i];
            }
        }
        return newobj;
    }
    return null
}

export const isEmpty = (obj) => {
    if(obj === null || obj === undefined || obj === '') {
        return true;
    }
    return false;
}

export const public_equal_object = (x,y) => {
    if (x == null || y == null) {
        return false
    }
// If both x and y are null or undefined and exactly the same
    if ( x === y ) {
        return true;
    }

// If they are not strictly equal, they both need to be Objects
    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) {
        return false;
    }

//They must have the exact same prototype chain,the closest we can do is
//test the constructor.
    if ( x.constructor !== y.constructor ) {
        return false;
    }

    for ( var p in x ) {
        //Inherited properties were tested using x.constructor === y.constructor
        if ( x.hasOwnProperty( p ) ) {
            // Allows comparing x[ p ] and y[ p ] when set to undefined
            if ( ! y.hasOwnProperty( p ) ) {
                return false;
            }

            // If they have the same strict value or identity then they are equal
            if ( x[ p ] === y[ p ] ) {
                continue;
            }

            // Numbers, Strings, Functions, Booleans must be strictly equal
            if ( typeof( x[ p ] ) !== "object" ) {
                return false;
            }

            // Objects and Arrays must be tested recursively
            if ( ! public_equal_object( x[ p ], y[ p ] ) ) {
                return false;
            }
        }
    }

    for ( p in y ) {
        // allows x[ p ] to be set to undefined
        if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) {
            return false;
        }
    }
    return true;
};

