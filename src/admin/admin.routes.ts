import express, {Request, Response} from "express";
import * as adminUserDatabase from "./admin.user.database";
import * as adminWatchDatabase from "./admin.watch.database";
import * as userDatabase from "../users/user.database";
import {StatusCodes} from "http-status-codes"
import { UnitUser } from "../users/user.interface";

export const adminRouter = express.Router()

// Get All Users
adminRouter.get("/users", async (req : Request, res : Response) => {
    try {
        const allUsers : UnitUser[] = await adminUserDatabase.findAllUsers()

        if (!allUsers) {
            return res.status(StatusCodes.NOT_FOUND).json({message : `No users at this time..`})
        }

        return res.status(StatusCodes.OK).json({total_user : allUsers.length, allUsers})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

// Get User by ID
adminRouter.get("/users/:id", async (req : Request, res : Response) => {
    try {
        const user : UnitUser = await adminUserDatabase.findOneUser(req.user.id)

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `User not found!`})
        }

        return res.status(StatusCodes.OK).json({user})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

// Update User by ID
adminRouter.put('/users/:id', async (req : Request, res : Response) => {
    try {
        const {username, email, password} = req.body

        const getUser = await adminUserDatabase.findOneUser(req.params.id)

        if (!username || !email || !password) {
            return res.status(401).json({error : `Please provide all the required parameters..`})
        }

        if (!getUser) {
            return res.status(404).json({error : `No user with id ${req.params.id}`})
        }

        const updateUser = await userDatabase.update((req.params.id), req.body)

        return res.status(201).json({updateUser})
    } catch (error) {
        console.log(error) 
        return res.status(500).json({error})
    }
})

// Delete User By ID
adminRouter.delete("/users/:id", async (req : Request, res : Response) => {
    try {
        const id = (req.params.id)

        const user = await adminUserDatabase.findOneUser(id)

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `User does not exist`})
        }

        await adminUserDatabase.removeUser(id)

        return res.status(StatusCodes.OK).json({message : "User deleted"})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

// Delete All Watches for Every User
adminRouter.delete('/watches', async (req : Request, res : Response) => {
    try {
        await adminWatchDatabase.removeAllWatches();
        return res.status(201).json({success: true, message: "All Watches have been deleted"})
    } catch (error) {
        console.log(error) 
        return res.status(500).json({error})
    }
});

// Delete watch by ID
adminRouter.delete("/watches/:id", async (req : Request, res : Response) => {
    try {
        const getWatch = await adminWatchDatabase.findOneWatch(req.params.id)

        if (!getWatch) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `No watch with ID ${req.params.id}`})
        }

        await adminWatchDatabase.removeWatch(req.params.id)

        return res.status(StatusCodes.OK).json({message : `Watch deleted.`})

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})