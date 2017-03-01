import React from 'react';

//a communication service for showing alert messages
export default class AlertCommunicationService {
    constructor() {
        this.ShowAlertFunc = undefined;
        this.CurrentObject = undefined;
    }

    static registerShowAlertFunc(currentObject, func) {
        this.ShowAlertFunc = func;
        this.CurrentObject = currentObject;
    }

    static unregisterShowAlertFunc() {
        this.ShowAlertFunc = undefined;
    }

    static raiseShowAlertEvent(msg, type) {
        if (this.CurrentObject && this.ShowAlertFunc) {
            this.ShowAlertFunc(this.CurrentObject, msg, type)
        }
    }
}