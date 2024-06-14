import { Watch, Watches, UnitWatch } from "./watch.interface";
import { v4 as random } from "uuid";
import fs from "fs";

let watches: Watches = loadWatches();

function loadWatches(): Watches {
  try {
    const data = fs.readFileSync("./watches.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error ${error}`);
    return {};
  }
}

function saveWatches() {
    try {
        fs.writeFileSync("./watches.json", JSON.stringify(watches), "utf-8");
        console.log("Watches saved successfully!")
    } catch (error) {
        console.log("Error", error)
    }
}


export const findAllByOwner = async (ownerId : string) : Promise<UnitWatch[]> => Object.values(watches).filter(watch => watch.ownerId === ownerId);

export const findOneByOwner = async (id : string, ownerId: string) : Promise<UnitWatch> => Object.values(watches).find(watch => (watch.ownerId === ownerId && watch.id === id));

export const findAllCurrentWearingByOwner = async (ownerId: string) : Promise<UnitWatch[]> => Object.values(watches).filter(watch => (watch.ownerId === ownerId && watch.isCurrentlyWearing));

export const create = async (watchInfo : Watch) : Promise<null | UnitWatch> => {

    let id = random()
    let watch = await findOneByOwner(id, watchInfo.ownerId)

    while (watch) {
        id = random ()
        await findOneByOwner(id, watchInfo.ownerId)
    }

    watches[id] = {
        id : id,
        ...watchInfo
    }

    saveWatches()

    return watches[id]
}

export const update = async (id : string, updateValues : Watch) : Promise<UnitWatch | null> => {

    const watch = await findOneByOwner(id, updateValues.ownerId) 

    if (!watch) {
        return null
    }

    watches[id] = {
        id,
        ...updateValues
    }

    saveWatches()

    return watches[id]
}

export const remove = async (id : string, ownerId: string) : Promise<null | void> => {

    const watch = await findOneByOwner(id, ownerId)

    if (!watch) {
        return null
    }

    delete watches[id]

    saveWatches()

}