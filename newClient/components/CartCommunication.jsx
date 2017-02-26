import React from 'react';

export default class CartCommunication extends React.Component {
    constructor() {
        super();
    }

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