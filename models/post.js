const {Schema, model} = require("mongoose");


const PostSchema = new Schema({
    title: {type: String, required: true, maxLength: 64},
    image: {type: String, required: true},
    text: {type: String, required: true},
    publicationDate: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    isModerated: {type: Boolean, required: true, default: false},
    isEdited: {type: Boolean, default: false},
    editDate: {type: String},
    comments: [{type: Schema.Types.ObjectId, ref: "Comment", default: []}],
});

PostSchema.virtual("url").get(function() {
    return `/post/${this._id}`;
});

module.exports = model("Post", PostSchema);