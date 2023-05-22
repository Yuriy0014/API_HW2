import {BlogType} from "../models/BlogModel";
import {BlogViewModel} from "../models/BlogViewModel";
import {blogsCollection} from "./db";
import {BlogsFilterModel} from "../models/BlogsFilterModel";

const getBlogViewModel = (blog: BlogType): BlogViewModel => {
    return {
        "id": blog.id,
        "name": blog.name,
        "description": blog.description,
        "websiteUrl": blog.websiteUrl,
        "createdAt": blog.createdAt,
        "isMembership": blog.isMembership
    }
}


export const blogsRepo = {
    async findBlogs(queryFilter: BlogsFilterModel): Promise<BlogType[]> {
        let  re = new RegExp(queryFilter.searchNameTerm + "");
        const findFilter: any = queryFilter.searchNameTerm === null ? {} : {"name": re}
        const sortField: string = queryFilter["sortBy"]

        return blogsCollection
            .find(findFilter)
            .sort({sortField: queryFilter.sortDirection === 'asc' ? 1 : -1})
            .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
            .limit(queryFilter.pageSize)
            .map(blog => getBlogViewModel(blog)).toArray();
    },
    async findBlogById(id: string): Promise<BlogType | null> {
        let foundBlog: BlogType | null = await blogsCollection.findOne({"id": id})
        if (foundBlog) {
            return getBlogViewModel(foundBlog)
        } else {
            return null
        }
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({"id": id});
        return result.deletedCount === 1
    },
    async createBlog(createdBlog: BlogType): Promise<BlogType> {
        await blogsCollection.insertOne(createdBlog)

        //return createdBlog;
        return getBlogViewModel(createdBlog)
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await blogsCollection.updateOne({"id": id}, {
            $set: {
                "name": name,
                "description": description,
                "websiteUrl": websiteUrl
            }
        })
        return result.matchedCount === 1
    },
    async deleteAll() {
        await blogsCollection.deleteMany({});

    }
}