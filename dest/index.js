"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUSES_HTTP = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const app = (0, express_1.default)();
const port = 7050;
const jsonBodyMW = express_1.default.json();
app.use(jsonBodyMW);
// const isItNotString = (value: any) => {
//     return typeof value !== 'string'
// }
//
// const notCorrectResolutions = (arr: Array<string>) => {
//     let correctResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
//     return arr.reduce(function (answer, item) {
//         return correctResolutions.indexOf(item) === -1 ? answer + 1 : answer
//     }, 0)
//
// }
// const isNotDate = (date: string) => {
//     return (String(new Date(date)) === "Invalid Date") || isNaN(+(new Date(date)));
// }
const lengthValidation = (field, len) => {
    return (0, express_validator_1.body)(field).trim().isLength({
        min: 1,
        max: len
    }).withMessage(`${field} length should be from 1 to 15 symbols`);
};
const stringTypeValidation = (param) => {
    return (0, express_validator_1.body)(param).isString().withMessage(`${param} should be string type`);
};
const urlValidation = (0, express_validator_1.body)("websiteUrl").isURL({ protocols: ['https'] }).withMessage("websiteUrl should be correct");
const inputValidationMw = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        //@ts-ignore
        res.send({ errors: result.array().map(val => ({ "message": val.msg, "type": val["path"] })) });
    }
    else {
        next();
    }
};
let db_blogs = {
    blogs: [
        {
            "id": 1,
            "name": "Marieh Kondo",
            "description": "Bingo article about Marieh Kondo and his famous book",
            "websiteUrl": "https://telegra.ph/Marieh-Kondo-02-14"
        },
        {
            "id": 2,
            "name": "Meandr",
            "description": "Bingo article about Meandr",
            "websiteUrl": "https://telegra.ph/Meandr-02-14"
        },
        {
            "id": 3,
            "name": "Dzhiro dItaliya",
            "description": "Bingo article about famous italian bicycle race Dzhiro dItaliya",
            "websiteUrl": "https://telegra.ph/Dzhiro-dItaliya-02-13"
        }
    ]
};
exports.STATUSES_HTTP = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
};
app.get('/blogs', (req, res) => {
    let foundBlogs = db_blogs.blogs;
    if (!foundBlogs.length) {
        res.status(exports.STATUSES_HTTP.NOT_FOUND_404)
            .json(foundBlogs);
        return;
    }
    res.status(exports.STATUSES_HTTP.OK_200)
        .json(foundBlogs);
});
app.get('/blogs/:id', (req, res) => {
    const foundBlog = db_blogs.blogs.find(c => c.id === +req.params.id);
    if (!foundBlog) {
        res.sendStatus(exports.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    res.json(foundBlog);
});
app.delete('/blogs/:id', (req, res) => {
    const foundBlog = db_blogs.blogs.find(c => c.id === +req.params.id);
    if (!foundBlog) {
        res.sendStatus(exports.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    db_blogs.blogs = db_blogs.blogs.filter(c => c.id !== +req.params.id);
    res.sendStatus(exports.STATUSES_HTTP.NO_CONTENT_204);
});
app.post('/blogs', stringTypeValidation("name"), stringTypeValidation("description"), stringTypeValidation("websiteUrl"), lengthValidation("name", 15), lengthValidation("description", 500), lengthValidation("websiteUrl", 100), urlValidation, inputValidationMw, (req, res) => {
    const createdPost = {
        "id": +(new Date()),
        "name": req.body.name,
        "description": req.body.description,
        "websiteUrl": req.body.websiteUrl
    };
    db_blogs.blogs.push(createdPost);
    res.status(exports.STATUSES_HTTP.CREATED_201)
        .json(createdPost);
});
//
// app.put('/blogs/:id', (req, res) => {
//
//         if (isItNotString(req.body.title) || isItNotString(req.body.author) || req.body.title.length > 40 || req.body.author.length > 20
//             || notCorrectResolutions(req.body.availableResolutions) || typeof (req.body.canBeDownloaded) !== "boolean"
//             || !Number.isInteger(req.body.minAgeRestriction)|| !(req.body.minAgeRestriction > 0) || !(req.body.minAgeRestriction < 19)
//             || (isItNotString(req.body.publicationDate) || isNotDate(req.body.publicationDate))) {
//             let errorsMessages = [];
//             if (isItNotString(req.body.title) || req.body.title.length > 40) {
//                 let titleErrorMessage = {
//                     "message": "Title is incorrect",
//                     "field": "title"
//                 }
//                 errorsMessages.push(titleErrorMessage)
//             }
//             if (isItNotString(req.body.author) || req.body.author.length > 20) {
//                 let titleErrorMessage = {
//                     "message": "Author is incorrect",
//                     "field": "author"
//                 }
//                 errorsMessages.push(titleErrorMessage)
//             }
//             if (notCorrectResolutions(req.body.availableResolutions)) {
//                 let titleErrorMessage = {
//                     "message": "availableResolutions contains unavailable value",
//                     "field": "availableResolutions"
//                 }
//                 errorsMessages.push(titleErrorMessage)
//             }
//             if (typeof (req.body.canBeDownloaded) !== "boolean") {
//                 let titleErrorMessage = {
//                     "message": "canBeDownloaded is not boolean",
//                     "field": "canBeDownloaded"
//                 }
//                 errorsMessages.push(titleErrorMessage)
//             }
//             if (!Number.isInteger(req.body.minAgeRestriction) || !(req.body.minAgeRestriction > 0) || !(req.body.minAgeRestriction < 19)) {
//                 let titleErrorMessage = {
//                     "message": "minAgeRestriction is not correct",
//                     "field": "minAgeRestriction"
//                 }
//                 errorsMessages.push(titleErrorMessage)
//             }
//             if ((isItNotString(req.body.publicationDate) || isNotDate(req.body.publicationDate))) {
//                 let titleErrorMessage = {
//                     "message": "publicationDate is not correct",
//                     "field": "publicationDate"
//                 }
//                 errorsMessages.push(titleErrorMessage)
//             }
//
//             res.status(STATUSES_HTTP.BAD_REQUEST_400)
//                 .json({errorsMessages: errorsMessages})
//             return;
//
//         }
//         const foundVideo = db_blogs.blogs.find(c => c.id === +req.params.id);
//
//         if (!foundVideo) {
//             res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
//             return;
//         }
//
//         foundVideo.title = req.body.title;
//         foundVideo.author = req.body.author;
//         foundVideo.availableResolutions = req.body.availableResolutions;
//         foundVideo.canBeDownloaded = req.body.canBeDownloaded;
//         foundVideo.minAgeRestriction = req.body.minAgeRestriction;
//         foundVideo.publicationDate = req.body.publicationDate;
//
//         res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
//     }
// )
//
app.delete('/testing/all-data', (req, res) => {
    db_blogs.blogs = [];
    res.sendStatus(exports.STATUSES_HTTP.NO_CONTENT_204);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
