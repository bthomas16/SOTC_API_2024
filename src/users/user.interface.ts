export enum ROLES {
    ADMIN = "ADMIN",
    USER = "USER"
}

export interface User {
    username : string,
    email : string,
    password : string,
    role: ROLES,
    lastLogin: number,
    isEnabled: boolean,
    createdAt: number
}

export interface UnitUser extends User {
    id : string
}

export interface Users {
    [key : string] : UnitUser
}