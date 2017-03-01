import React from 'react';

//we can also use the contextType in React for passing variables
export default class CartCommunication {
    //normally, we may use a set function for setting new cart value,
    //meanwhile, in the set function, we will raise raiseCartUpdatedEvent in the same time
    static CurrentCart = [];
    static Funcs = new Map();

    static registerCartUpdateFunc(obj, func) {
        this.Funcs.set(obj, func);
    }

    static unregisterCartUpdateFunc(obj) {
        this.Funcs.delete(obj);
    }

    static raiseCartUpdatedEvent() {
        for (let [obj, func] of this.Funcs.entries()) {
            func(obj);
        }
    }
}