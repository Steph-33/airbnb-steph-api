const { BAD_REQUEST } = require('../status_codes');

module.exports = class BadRequest extends Error {
  constructor(title, description, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadRequest);
    }

    this.name = `BadRequest: ${title}`;
    this.status = BAD_REQUEST;
    this.title = title;
    this.description = description;
  }
};
