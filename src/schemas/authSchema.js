const {
  model,
  Schema
} = require('mongoose');

let authSchema = new Schema({
  Guild: String,
  Channel: String,
  Role: String,
});

module.exports = model('authSchema', authSchema)
