import express, {Request, Response} from "express";
import { UnitUser } from "./user.interface"
import {StatusCodes} from "http-status-codes"
import * as JWT from "jsonwebtoken";
import * as database from "./user.database"
import { AUTHENTICATE } from "../middleware/authenticate";

export const userRouter = express.Router();

// Register New User
userRouter.post("/register", async (req : Request, res : Response) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({error : `Please provide all the required parameters..`})
        }

        const isEmailFound = await database.findOneByEmail(email);
        const isUsernameFound = await database.findOneByUsername(username);

        if (isEmailFound) {
            return res.status(StatusCodes.BAD_REQUEST).json({error : `This email has already been registered, ${email}`});
        }

        if (isUsernameFound) {
            return res.status(StatusCodes.BAD_REQUEST).json({error : `This username has already been registered, ${username}`});
        }

        const newUser = await database.create(req.body);
        delete newUser.password;

        return res.status(StatusCodes.CREATED).json({newUser})

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

// Login Existing User
userRouter.post("/login", async (req : Request, res : Response) => {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({error : "Please provide all the required parameters.."})
        }

        const user = await database.findOneByEmail(email)

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({error : "No user exists with the email provided.."})
        }
        console.log('herere', user)

        const comparePassword = await database.comparePassword(email, password)

        if (!comparePassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({error : `Incorrect Password!`})
        }

        await database.update(user.id, {lastLogin: Date.now()} as any)

        const details = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
            isEnabled: user.isEnabled,
            createdAt: user.createdAt
        }

        const token = JWT.sign(
            { 
                ...details
            }, process.env.JWT_SECRET as string,
            {
              expiresIn: "7d",
        })


        return res.status(StatusCodes.OK).json({
            success: true,
            message: "login success",
            user: details,
            token: token,
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

// Get User
userRouter.get("/", AUTHENTICATE, async (req : Request, res : Response) => {
    try {
        const user : UnitUser = await database.findOneById(req.user.id);
        delete user.password

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `User not found!`})
        }

        return res.status(StatusCodes.OK).json({user})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

// Update User
userRouter.put('/', AUTHENTICATE, async (req : Request, res : Response) => {
    try {
        const {username, email, password} = req.body
        const getUser = await database.findOneById(req.user.id)

        if (!username || !email || !password) {
            return res.status(401).json({error : `Please provide all the required parameters..`})
        }

        if (!getUser) {
            return res.status(404).json({error : `No user with id ${req.user.id}`})
        }

        // Unique Email to Update
        const matchingEmail = await database.findOneByEmail_NotId(req.user.id, req.user.email);
        if (matchingEmail) {
            return res.status(401).json({error : `Email address is not available, ${req.user.email}`});
        }

        // Unique username to Update
        const matcherUsername = await database.findOneByUsername_NotId(req.user.id, req.user.username);
        if (matcherUsername) {
            return res.status(401).json({error : `Username is not available, ${req.user.username}`});
        }

        const updateUser = await database.update((req.user.id), req.body)

        return res.status(201).json({updateUser})
    } catch (error) {
        console.log(error) 
        return res.status(500).json({error})
    }
})