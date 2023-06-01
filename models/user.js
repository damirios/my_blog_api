const {Schema, model} = require("mongoose");


const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    avatar: {type: String},
    login: {type: String, required: true, maxLength: 16},
    password: {type: String, required: true, maxLength: 64},
    posts: [{type: Schema.Types.ObjectId, ref: "Post"}],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    regDate: {type: String, required: true},
    isAdmin: {type: Boolean, required: true, default: false},
});

UserSchema.virtual("url").get(function() {
    return `/user/${this._id}`;
});

module.exports = model("User", UserSchema);