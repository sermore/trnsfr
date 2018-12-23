const uniqid = require('uniqid');

class Transfer {

    constructor(data) {
        this.id = data.id ? data.id : uniqid();
        this.params = data.params ? (Array.isArray(data.params) ? data.params : data.params.split(',')) : [];
        this.emails = (data.emails ? (Array.isArray(data.emails) ? data.emails : data.emails.split(',')) : []).filter(v => v.length > 0);
        this.subject = data.subject;
        this.message = data.message;
        this.enabled = data.enabled;
        this.enabledUntil = data.enabledUntil ? (data.enabledUntil instanceof Date ? data.enabledUntil : new Date(data.enabledUntil)) : null;
        this.count = 0;
        this.last = null;
    }

    update(data) {
        this.params = data.params ? (Array.isArray(data.params) ? data.params : data.params.split(',')) : this.params;
        this.emails = (data.emails ? (Array.isArray(data.emails) ? data.emails : data.emails.split(',')) : this.emails).filter(v => v.length > 0);
        this.subject = data.subject ? data.subject : this.subject;
        this.message = data.message ? data.message : this.message;
        this.enabled = data.enabled;
        this.enabledUntil = data.enabledUntil ? (data.enabledUntil instanceof Date ? data.enabledUntil : new Date(data.enabledUntil)) : null;
    }
}

module.exports = Transfer;