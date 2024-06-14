import {Request, Response, NextFunction} from "express";
import { StatusCodes } from "http-status-codes";
import * as JWT from "jsonwebtoken";

const AUTHENTICATE = (req : Request, res : Response, next: NextFunction) => {
    const bearerToken = req.header('Authorization');
    const token = bearerToken?.substring(7, bearerToken.length);
    
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required.' });
    }
    
    try {
        const decoded: any = JWT.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid token.' });
    }
};

export { AUTHENTICATE }