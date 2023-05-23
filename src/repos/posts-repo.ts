import {PostType} from "../models/PostModel";
import {PostViewModel} from "../models/PostViewModel";
import {postsCollection} from "./db";
import {PostFilterModel} from "../models/PostFilterModel";
import {PostsWithPaginationModel} from "../models/PostsWithPaginationModel";

const getPostViewModel = (post: PostType): PostViewModel => {
    return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

export const postsRepo = {
    async findPosts(queryFilter: PostFilterModel): Promise<PostsWithPaginationModel> {
        let findFilter = queryFilter.blogId === '' ? {} : {blogId: queryFilter.blogId}

        let foundPosts = await postsCollection
            .find(findFilter)
            .sort((queryFilter.sortBy === 'createdAt' ? {[queryFilter.sortBy]: (queryFilter.sortDirection === 'asc' ? 1 : -1)} : {[queryFilter.sortBy]: (queryFilter.sortDirection === 'asc' ? 1 : -1), 'createdAt': 1}))
            .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
            .limit(queryFilter.pageSize)
            .map(post => getPostViewModel(post)).toArray();


        let totalCount = await postsCollection
            .find(findFilter).toArray()

        return {
            "pagesCount": Math.ceil(totalCount.length / queryFilter.pageSize),
            "page": queryFilter.pageNumber,
            "pageSize": queryFilter.pageSize,
            "totalCount": totalCount.length,
            "items": foundPosts
        }
    },
    async findPostsById(id: string): Promise<PostType | null> {
        let foundPost: PostType | null = await postsCollection.findOne({"id": id})
        if (foundPost) {
            return getPostViewModel(foundPost)
        } else {
            return null
        }
    },
    async deletePost(id: string): Promise<boolean> {
        let result = await postsCollection.deleteOne({"id": id})
        return result.deletedCount === 1
    },
    async createPost(createdPost: PostType): Promise<PostType> {

        await postsCollection.insertOne(createdPost)
        return getPostViewModel(createdPost);
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        let result = await postsCollection.updateOne({"id": id}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId
            }
        })
        return result.matchedCount === 1
    },
    async deleteAll() {
        await postsCollection.deleteMany({})
    }
}