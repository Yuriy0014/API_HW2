import {UserType} from "../models/Users/UserModel";
import {UserViewModel} from "../models/Users/UserViewModel";
import {usersCollection} from "../db/db";
import {getUserViewModel} from "../helpers/map-UserViewModel";


export const usersRepo = {

    async createUser(createdUser: UserType): Promise<UserViewModel> {
        await usersCollection.insertOne(createdUser)

        return getUserViewModel(createdUser)
    },

    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({"id": id});
        return result.deletedCount === 1
    },

}