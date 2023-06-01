const {Schema, model} = require("mongoose");


const CommentSchema = new Schema({
    author: {type: Schema.Types.ObjectId, required: true},
    publicationDate: {type: String, required: true},
    post: {type: Schema.Types.ObjectId, required: true},
    text: {type: String, required: true},
    isModerated: {type: Boolean, required: true, default: false},
    isEdited: {type: Boolean, default: false},
    editDate: {type: String},
});

CommentSchema.virtual("url").get(function() {
    return `/post/${this.post._id}/comment/${this._id}`;
});

module.exports = model("Post", PostSchema);