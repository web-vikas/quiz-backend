const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorageSchema = new Schema({
    file_id: { type: String, required: true },
    telegram_file_id: { type: String, required: true },
    name: { type: Schema.Types.ObjectId, required: true},
    telegram_response: { type: String, required: true }
}, {
    timestamps: true,
})

const StorageModel = mongoose.model('storage', StorageSchema);
module.exports = StorageModel;