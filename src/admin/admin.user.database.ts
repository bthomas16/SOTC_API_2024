import { UnitUser, Users } from "../users/user.interface";
import fs from "fs";

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

export const findAllUsers = async () : Promise<UnitUser[]> => Object.values(users);

export const findOneUser = async (id : string) : Promise<UnitUser> => users[id];

export const removeUser = async (id : string) : Promise<null | void> => {

    const user = await findOneUser(id)

    if (!user) {
        return null
    }

    delete users[id]

    saveUsers()
}

