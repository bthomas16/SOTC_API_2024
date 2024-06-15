import { ROLES } from "./user.class"

export interface User {
    username : string,
    email : string,
    password : string,
    role: ROLES,
    lastLogin?: number,
    isEnabled: boolean,
    createdAt: number
}

export interface UnitUser extends User {
    id : string
}

export interface Users {
    [key : string] : UnitUser
}