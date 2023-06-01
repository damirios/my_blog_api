const Post = require('../models/post');

const {body, validationResult} = require('express-validator');
const getFormattedDate = require('../utilities/getFormattedDate');

exports.post_list = async (req, res) => {
    const posts = await Post.find({});

    if (posts.length === 0) {
        throw new Error("Постов пока нет(");
    }

    res.json(posts);
};

exports.post_single = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        throw new Error("Пост с таким id не найден");
    }

    res.json(post);
}

exports.post_create = [
    body("title", "Введите название поста (макс. 64 символа)")
        .trim()
        .isLength({min: 1, max: 64})
        .escape(),
    body("image", "Картинка к посту обязательна")
        .trim()
        .escape(),
    body("text", "Введите текст поста")
        .trim()
        .isLength({min: 1})
        .escape(),
    async (req, res, next) => {
        const errors = validationResult(body);

        if (!errors.isEmpty()) {
            throw new Error(errors.array());
        }

        const authorId = req.user ? req.user.id : "6478437ebc86b77912f80fe5";
        
        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            image: req.body.image,
            author: authorId,
            publicationDate: getFormattedDate(new Date())
        });

        await post.save();
        // res.redirect(post.url);
        res.json(post);
    }
];

exports.post_udpate = [
    body("title", "Введите название поста (макс. 64 символа)")
        .trim()
        .isLength({min: 1, max: 64})
        .escape(),
    body("image", "Картинка к посту обязательна")
        .trim()
        .escape(),
    body("text", "Введите текст поста")
        .trim()
        .isLength({min: 1})
        .escape(),
    async (req, res, next) => {
        const errors = validationResult(body);

        if (!errors.isEmpty()) {
            throw new Error(errors.array());
        }
        
        const updatedPost = {
            title: req.body.title,
            text: req.body.text,
            image: req.body.image,
            isEdited: true,
            editDate: getFormattedDate(new Date()),
            isModerated: false,
            _id: req.params.id 
        }
        
        const thepost = await Post.findByIdAndUpdate(req.params.id, updatedPost);
        res.redirect(thepost.url);
        // res.redirect(post.url);
    }
];

exports.post_moderate = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        throw new Error("Поста с таким id не найдено");
    }

    const moderatedPost = await Post.findByIdAndUpdate(req.params.id, {isModerated: true});
    res.redirect(moderatedPost.url);
};

exports.post_delete = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        throw new Error("Поста с таким id не найдено");
    }

    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/');
};