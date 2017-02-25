import React from 'react';

export default class CartCommunication extends React.Component {
    static CurrentCart = [];

    static Funcs = new Map();

    static registerCartUpdateFunc(obj, func) {
        this.Funcs.set(obj, func);
    }

    static raiseCartUpdatedEvent() {
        for (let [obj, func] of this.Funcs.entries()) {
            func(obj);
        }
    }
}