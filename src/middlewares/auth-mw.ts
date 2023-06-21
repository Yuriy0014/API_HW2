import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepo} from "../repos/query-repos/users-query-repo";

export const authenticationCheck = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["authorization"] !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401)
    } else {
        next();
    }
}

export const authenticationCheckBearer = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userID = await jwtService.getUserIdByToken(token)
    if(userID) {
        req.user = await usersQueryRepo.findUserById(userID)
        next()
        return;
    }
    res.sendStatus(401)
}

export const doesLoginEmailAlreadyExist = async (req: Request, res: Response, next: NextFunction) => {
    const loginExists = await usersQueryRepo.findByLoginOrEmail(req.body.login)
    const emailExists = await usersQueryRepo.findByLoginOrEmail(req.body.email)


    if(loginExists) {
        res.status(400)
            .json( { errorsMessages: [{ message: "Login or email is already used on the website", field: "login" }] }
            )
        return
    }


    if(emailExists) {
        res.status(400)
            .json( { errorsMessages: [{ message: "Login or email is already used on the website", field: "email" }] }
            )
        return
    }

    next()

}

export const isAlreadyConfirmed = async (req: Request, res: Response, next: NextFunction) => {
    const confirmed = await usersQueryRepo.findUserByConfirmationCode(req.body.code)


    if(confirmed?.emailConfirmation.isConfirmed === true) {
        res.status(400)
            .json( { errorsMessages: [{ message: "The email is already confirmed", field: "email" }] }
            )
        return
    }

    next()

}