const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 280 },
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports =mongoose.models.Post || mongoose.model('Post', PostSchema);