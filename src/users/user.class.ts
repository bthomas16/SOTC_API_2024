import { UnitUser } from "./user.interface";

export enum ROLES {
    ADMIN = "ADMIN",
    USER = "USER"
}

export class UserClass {
    username : string
    email : string
    password : string
    role: ROLES
    lastLogin?: number
    isEnabled: boolean
    createdAt: number

    constructor (user: UnitUser) {
        this.username  = user.username
        this.email  = user.email
        this.password  = user.password
        this.role = user?.role || ROLES.USER
        this.lastLogin = user?.lastLogin
        this.isEnabled = true
        this.createdAt = Date.now()
    }
}