import { Watch, Watches, UnitWatch } from "../watches/watch.interface";
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
};
  
function saveWatches() {
    try {
        fs.writeFileSync("./watches.json", JSON.stringify(watches), "utf-8");
        console.log("Watches saved successfully!")
    } catch (error) {
        console.log("Error", error)
    }
}

function deleteAllWatches() {
    try {
        fs.writeFileSync("./watches.json", JSON.stringify({}), "utf-8");
        console.log("Watches saved successfully!")
    } catch (error) {
        console.log("Error", error)
    }
}

export const findAllWatches = async () : Promise<UnitWatch[]> => Object.values(watches);

export const findOneWatch = async (id : string) : Promise<UnitWatch> => watches[id];

export const removeWatch = async (id : string) : Promise<null | void> => {

    const watch = await findOneWatch(id);

    if (!watch) {
        return null
    };

    delete watches[id];

    saveWatches();
};

export const removeAllWatches = async () : Promise<null | void> => {
    deleteAllWatches();
};