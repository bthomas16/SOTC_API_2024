import express, {Request, Response} from "express";
import * as database from "./watch.database"
import {StatusCodes} from "http-status-codes"
import { onlyUnique } from "./watch.helpers";
import { UnitWatch } from "./watch.interface";
import { WatchClass } from "./watch.class";

export const watchRouter = express.Router()

// Get all watches for Owner ID (token making request)
watchRouter.get('/', async (req : Request, res : Response) => {
    try {
       const allWatches = await (await database.findAllByOwner(req.user.id)).sort((a,b) => a.sortOrder - b.sortOrder);

       if (!allWatches) {
        return res.status(StatusCodes.NOT_FOUND).json({error : `No watches found!`})
       }

       return res.status(StatusCodes.OK).json({total : allWatches.length, allWatches})
    } catch (error) {
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error}) 
    }
})

// Get Current Watch Being Worn
watchRouter.get("/wearing", async (req : Request, res : Response) => {
    try {
        const watch = await database.findAllCurrentWearingByOwner(req.user.id);
        console.log('currently wearing', watch)

        if (!watch[0]) {
            return res.status(StatusCodes.NOT_FOUND).json({error : "No Watch is currently being worn"})
        }

        return res.status(StatusCodes.OK).json({watch: watch})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

// Build Watch Recommendation Preferences DDL's
watchRouter.get('/preferences', async (req : Request, res : Response) => {
    try {
        const allWatches = await database.findAllByOwner(req.user.id)

        if (!allWatches) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `No watches found!`})
        }

        const STYLES = allWatches.filter((x) => x.style).map(x => x.style).filter(onlyUnique).concat(["Any"]).sort();
        const DIAl_COLORS = allWatches.filter(x => x.dialColor).map((x) => x.dialColor);
        const BEZEL_COLORS = allWatches.filter(x => x.bezelColor).map((x) => x.bezelColor);
        const UNIQUE_COLORS = DIAl_COLORS.concat(BEZEL_COLORS).filter(onlyUnique).concat(["Any"]).sort();

        const result = {styles: STYLES, colors: UNIQUE_COLORS, recentlyWorn: ["Worn Recently", "Not Worn Recently", "Any"]};

       return res.status(StatusCodes.OK).json(result)
    } catch (error) {
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error}) 
    }
})

// Make Watch Recommendation
watchRouter.get('/recommend', async (req : Request, res : Response) => {
    try {
        const {style, color, recentlyWorn} = req.query;

        const allWatches = await database.findAllByOwner(req.user.id)

        if (!allWatches) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `No watches found!`})
        }

        let Options = allWatches;

        if (style === "Any" && color !== "Any") {
            Options = allWatches.filter(watch => watch.dialColor === color || watch.bezelColor === color);
        } else if (style !== "Any" && color === "Any") {
            Options = allWatches.filter(watch => watch.style === style);
        } else if (style !== "Any" && color !== "Any") {
            Options = allWatches.filter(watch => watch.style === style || (watch.dialColor === color || watch.bezelColor === color));
        }

        switch (recentlyWorn) {
            case "Worn Recently": 
                Options.sort((a,b) => a.dateLastWorn - b.dateLastWorn).slice(0, 3);
                break;
            case "Not Worn Recently": 
                Options.sort((a,b) => b.dateLastWorn - a.dateLastWorn).slice(0, 3);
                break;
        }

        const Recommendation: UnitWatch = Options[Math.floor(Math.random()*Options.length)];
        if (Recommendation) {
            return res.status(StatusCodes.OK).json(Recommendation);
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({message: "No Watch Recommendation available at this time."});
        }
    } catch (error) {
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error}) 
    }
})

// Get Watch By ID
watchRouter.get("/:id", async (req : Request, res : Response) => {
    try {
        const watch = await database.findOneByOwner(req.params.id, req.user.id);

        if (!watch) {
            return res.status(StatusCodes.NOT_FOUND).json({error : "Watch does not exist"})
        }

        return res.status(StatusCodes.OK).json({watch})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

// Create Watch
watchRouter.post("/", async (req : Request, res : Response) => {
    try {
        const {name, brand, image} = req.body;
        console.log('owner ID here', req.user.id)

        if (!name || !brand || !image) {
            return res.status(StatusCodes.BAD_REQUEST).json({error : `Please provide all the required parameters...`})
        }

        const watchCount = await database.findAllByOwner(req.user.id);
        let sortOrder = 0;
        if (watchCount.length >= 1) {
            sortOrder = watchCount.length;
        }

        const newWatch = await database.create(new WatchClass({...req.body, ownerId: req.user.id, sortOrder}));
        
        return res.status(StatusCodes.CREATED).json(newWatch)
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

// Update Watch by Owner & ID
watchRouter.put("/:id", async (req : Request, res : Response) => {
    try {
        const watchId = req.params.id

        const newWatch = req.body;

        const findWatch = await database.findOneByOwner(watchId, req.user.id)

        if (!findWatch) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `Watch does not exist..`})
        }

        newWatch.ownerId = req.user.id

        const updateWatch = await database.update(watchId, {...findWatch, ...newWatch})

        return res.status(StatusCodes.OK).json(updateWatch)
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

// Toggle Currently Wearing Watch By ID & Owner
watchRouter.put("/wearing/:id", async (req : Request, res : Response) => {
    try {
        const watchId = req.params.id;
        const findWatch = await database.findOneByOwner(watchId, req.user.id);

        if (!findWatch) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `Watch does not exist..`})
        }

        const otherWatchesCurrentWearing = await database.findAllCurrentWearingByOwner_NotId(req.user.id, watchId);
        otherWatchesCurrentWearing.forEach(async (watch) => {
            watch.isCurrentlyWearing = false;
            console.log('other watches wearing', watch)
            let updated = await database.update(watchId, watch);
            console.log('updated', updated)
        })

        findWatch.isCurrentlyWearing = !findWatch.isCurrentlyWearing;

        const updateWatch = await database.update(watchId, findWatch);
        console.log('updated the 2nd', updateWatch)


        return res.status(StatusCodes.OK).json(updateWatch)
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

// Delete Watch By Owner & ID
watchRouter.delete("/:id", async (req : Request, res : Response) => {
    try {
        const getWatch = await database.findOneByOwner(req.params.id, req.user.id)

        if (!getWatch) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `No watch with ID ${req.params.id}`})
        }

        await database.remove(req.params.id, req.user.id)

        return res.status(StatusCodes.OK).json({message : `Watch deleted..`})

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

