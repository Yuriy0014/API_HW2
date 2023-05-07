import express from 'express'
import {blogsRouter, db_blogs} from "./routes/blogs-router";

const app = express()
const port = 7050

const jsonBodyMW = express.json()
app.use(jsonBodyMW)

export const STATUSES_HTTP = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

app.use('/blogs', blogsRouter)

app.delete('/testing/all-data', (req, res) => {
    db_blogs.blogs = [];
    res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})