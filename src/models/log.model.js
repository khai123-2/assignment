const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema(
  {
    level: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: false,
    },
    message: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } },
);
module.exports = mongoose.model('Log', logSchema);
