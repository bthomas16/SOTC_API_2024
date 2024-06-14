import { User, UnitUser, Users, ROLES } from "./user.interface";
import bcrypt from "bcryptjs"
import {v4 as random} from "uuid"
import fs from "fs"

let users: Users = loadUsers() 

function loadUsers () : Users {
  try {
    const data = fs.readFileSync("./users.json", "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.log(`Error ${error}`)
    return {}
  }
}

function saveUsers () {
  try {
    fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8")
    console.log(`User saved successfully!`)
  } catch (error) {
    console.log(`Error : ${error}`)
  }
}

export const findOneById = async (id: string): Promise<UnitUser> => users[id];

export const findOneByEmail = async (email: string): Promise<UnitUser> => Object.values(users).find(user => (user.email === email));

export const findOneByUsername = async (username: string): Promise<UnitUser> => Object.values(users).find(user => (user.username === username));

export const findOneByEmail_NotId = async (userId: string, email: string): Promise<UnitUser> => Object.values(users).find(user => (user.id !== userId && user.email === email))

export const findOneByUsername_NotId = async (userId: string, username: string): Promise<UnitUser> => Object.values(users).find(user => user.id !== userId && user.username === username)

export const create = async (userData: UnitUser): Promise<UnitUser | null> => {

  let id = random()

  let check_user = await findOneById(id);

  while (check_user) {
    id = random()
    check_user = await findOneById(id)
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const role = userData.email === "brentthomas.c@gmail.com" ? ROLES.ADMIN : ROLES.USER;

  const user : UnitUser = {
    id : id,
    username : userData.username,
    email : userData.email,
    password: hashedPassword,
    role: role,
    lastLogin: null,
    isEnabled: true,
    createdAt: Date.now()
  };

  users[id] = user;

  saveUsers()

  return user;
};

export const comparePassword  = async (email : string, supplied_password : string) : Promise<null | UnitUser> => {

    const user = await findOneByEmail(email);
    console.log('do it for you', user, "supplied pword", supplied_password)

    const decryptPassword = await bcrypt.compare(supplied_password, user.password)

    if (!decryptPassword) {
        return null
    }

    // delete users.password
    return user
}

export const update = async (id : string, updateValues : User) : Promise<UnitUser | null> => {

    const userExists = await findOneById(id)

    if (!userExists) {
        return null
    }

    if(updateValues.password) {
        const salt = await bcrypt.genSalt(10)
        const newPass = await bcrypt.hash(updateValues.password, salt)

        updateValues.password = newPass
    }

    users[id] = {
        ...userExists,
        ...updateValues
    }

    saveUsers();
    // delete users[id].password

    return users[id]
}

