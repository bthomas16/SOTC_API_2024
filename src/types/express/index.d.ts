import express from "express";

declare global {
  namespace Express {
    enum ROLES {
        ADMIN = "ADMIN",
        USER = "USER"
    }

    export interface RequestUser {
        id: string;
        email: string;
        role: ROLES;
        lastLogin: Date;
        isEnabled: boolean;
        createdAt: Date;
    }

    export interface Request {
        user: RequestUser;
    }
  }
}