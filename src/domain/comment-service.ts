import {CommentsRepo} from "../repos/comments-repo";
import {CommentDbModel, CommentViewModel} from "../models/Comments/CommentModel";
import {ObjectId} from "mongodb";
import {
    likesDBModel,
    likesInfoViewModel,
    likeStatusModel,
    usersLikesConnectionDBModel
} from "../models/Comments/LikeModel";
import {likeStatus} from "../enum/likeStatuses";
import {likesRepo} from "../repos/like-repo";

export class CommentService {

    constructor(protected commentsRepo: CommentsRepo) {
    }

    async updateComment(id: string, content: string): Promise<boolean> {
        return this.commentsRepo.updateComment(id, content)
    }

    async deleteComment(id: string): Promise<boolean> {
        return this.commentsRepo.deleteComment(id);
    }

    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<CommentViewModel> {
        const newComment = new CommentDbModel(
            new ObjectId(),
            postId,
            content,
            {
                "userId": userId,
                "userLogin": userLogin
            },
            new Date().toISOString()
        )

        const newLikesInfo = new likesDBModel(
            new ObjectId(),
            "Comment",
            newComment._id.toString(),
            0,
            0
        )

        const newUsersLikesConnection = new usersLikesConnectionDBModel(
            new ObjectId(),
            userId,
            newComment._id.toString(),
            "Comment",
            likeStatus.None
        )

        return this.commentsRepo.createComment(newComment, userId, newLikesInfo, newUsersLikesConnection);
    }

    async likeComment(commentId: string, likesInfo: likesInfoViewModel, newLikeStatus: likeStatusModel, userId: string): Promise<boolean> {
        const savedLikeStatus = likesInfo.myStatus
        let result: boolean = true
        if (savedLikeStatus === likeStatus.None) {
            if (newLikeStatus === likeStatus.Like) {
                result = await likesRepo.Like('Comment', commentId, userId)
            }
            if (newLikeStatus === likeStatus.Dislike) {
                result = await likesRepo.Dislike('Comment', commentId, userId)
            }
        }

        if (savedLikeStatus === likeStatus.Like) {
            // По условию домашки, при повторной отправке того-же статуса ничего не меняется
            // if(newLikeStatus === likeStatus.Like) {
            //     await likesRepo.Reset('Comment', req.params.id, req.user!.id,likeStatus.Like)
            // }
            if (newLikeStatus === likeStatus.Dislike) {
                await likesRepo.Reset('Comment', commentId, userId, likeStatus.Like)
                result = await likesRepo.Dislike('Comment', commentId, userId)
            }
            if (newLikeStatus === likeStatus.None) {
                result = await likesRepo.Reset('Comment', commentId, userId, likeStatus.Like)
            }
        }

        if (savedLikeStatus === likeStatus.Dislike) {
            // По условию домашки, при повторной отправке того-же статуса ничего не меняется
            // if(newLikeStatus === likeStatus.Dislike) {
            //     await likesRepo.Reset('Comment', req.params.id, req.user!.id,likeStatus.Like)
            // }
            if (newLikeStatus === likeStatus.Like) {
                await likesRepo.Reset('Comment', commentId, userId, likeStatus.Dislike)
                result = await likesRepo.Like('Comment', commentId, userId)
            }
            if (newLikeStatus === likeStatus.None) {
                result = await likesRepo.Reset('Comment', commentId, userId, likeStatus.Dislike)
            }
        }

        return result
    }
}