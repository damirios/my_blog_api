const Comment = require("../models/comment");
const Post = require("../models/post");

const {body, validationResult} = require('express-validator');
const getFormattedDate = require("../utilities/getFormattedDate");

exports.comment_list = async (req, res, next) => {
    const post = await Post.findById(req.params.postId);

    if (!post) {
        throw new Error("Поста с таким id не найдено");
    }

    const comments = await Comment.find({post: req.params.postId});

    if (comments.length === 0) {
        throw new Error("Комментариев к посту с таким id нет");
    }

    res.json(comments);
};

exports.comment_create = [
    body("text", "Введите комментарий")
        .trim()
        .isLength({min: 1})
        .escape(),
    async (req, res, next) => {
        const errors = validationResult(body);
        if (!errors.isEmpty()) {
            throw new Error(errors.array());
        }

        const post = await Post.findById(req.params.postId);

        if (!post) {
            throw new Error("Поста с таким id не найдено");
        }

        const commentAuthorId = req.user ? req.user.id : "6478437ebc86b77912f80fe5";

        const comment = new Comment({
            author: commentAuthorId,
            publicationDate: getFormattedDate(new Date()),
            post: req.params.postId,
            text: req.body.text,
        });

        await comment.save();
        
        // добавляем id комментария в список комментариев поста
        post.comments = [...post.comments, comment.id];
        await post.save();

        // res.redirect(post.url);
        res.json(comment);
}];

exports.comment_update = [
    body("text", "Введите комментарий")
        .trim()
        .isLength({min: 1})
        .escape(),
    async (req, res, next) => {
        const errors = validationResult(body);
        if (!errors.isEmpty()) {
            throw new Error(errors.array());
        }

        const post = await Post.findById(req.params.postId);
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            throw new Error("Комментария с таким id не найдено");
        }

        const updatedComment = {
            text: req.body.text,
            isEdited: true,
            editDate: getFormattedDate(new Date()),
            isModerated: false,
            _id: req.params.id
        };

        const thecomment = await Comment.findByIdAndUpdate(req.params.id, updatedComment);

        res.redirect(post.url);
}];

exports.comment_moderate = async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    if (!post) {
        throw new Error("Поста с таким id не найдено");
    }

    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
        throw new Error("Комментария с таким id не найдено");
    }

    const moderatedComment = await Comment.findByIdAndUpdate(req.params.id, {isModerated: true});
    res.redirect(post.url);
};

exports.comment_delete = async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    if (!post) {
        throw new Error("Поста с таким id не найдено");
    }

    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
        throw new Error("Комментария с таким id не найдено");
    }

    await Post.findByIdAndDelete(req.params.id);
    res.redirect(post.url);
};