import express, {Request, Response} from "express";
import * as database from "./watch.database"
import {StatusCodes} from "http-status-codes"
import { AUTHENTICATE } from "../middleware/authenticate"
import { onlyUnique } from "./watch.helpers";

export const watchRouter = express.Router()

// Get all watches for Owner ID (token making request)
watchRouter.get('/watches', AUTHENTICATE, async (req : Request, res : Response) => {
    try {
       const allWatches = await database.findAll(req.user.id)

       if (!allWatches) {
        return res.status(StatusCodes.NOT_FOUND).json({error : `No watches found!`})
       }

       return res.status(StatusCodes.OK).json({total : allWatches.length, allWatches})
    } catch (error) {
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error}) 
    }
})

watchRouter.get("/watches/wearing", AUTHENTICATE, async (req : Request, res : Response) => {
    try {
        const watch = await database.findAllCurrentWearing(req.user.id)

        if (!watch[0]) {
            return res.status(StatusCodes.NOT_FOUND).json({error : "No Watch is currently being worn"})
        }

        return res.status(StatusCodes.OK).json({watch: watch[0]})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

watchRouter.get('/watches/preferences', AUTHENTICATE, async (req : Request, res : Response) => {
    try {
        const allWatches = await database.findAll(req.user.id)

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

watchRouter.get('/watches/recommend', AUTHENTICATE, async (req : Request, res : Response) => {
    try {
        const {style, color, recentlyWorn} = req.query;

        const allWatches = await database.findAll(req.user.id)

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

        const Recommendation = Options[Math.floor(Math.random()*Options.length)];
       return res.status(StatusCodes.OK).json(Recommendation)
    } catch (error) {
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error}) 
    }
})



watchRouter.get("/watches/:id", AUTHENTICATE, async (req : Request, res : Response) => {
    try {
        const watch = await database.findOne(req.params.id)

        if (!watch) {
            return res.status(StatusCodes.NOT_FOUND).json({error : "Watch does not exist"})
        }

        return res.status(StatusCodes.OK).json({watch})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})


watchRouter.post("/watches", AUTHENTICATE, async (req : Request, res : Response) => {
    try {
        const {name, brand, image} = req.body;

        if (!name || !brand || !image) {
            return res.status(StatusCodes.BAD_REQUEST).json({error : `Please provide all the required parameters...`})
        }
        const newWatch = await database.create({...req.body, ownerId: req.user.id})
        return res.status(StatusCodes.CREATED).json({newWatch})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

watchRouter.put("/watches/:id", AUTHENTICATE, async (req : Request, res : Response) => {
    try {
        const id = req.params.id

        const newWatch = req.body

        const findWatch = await database.findOne(id)

        if (!findWatch) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `Watch does not exist..`})
        }

        const updateWatch = await database.update(id, newWatch)

        return res.status(StatusCodes.OK).json({updateWatch})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

watchRouter.put("/watches/:id/wearing", AUTHENTICATE, async (req : Request, res : Response) => {
    try {
        const id = req.params.id
        const findWatch = await database.findOne(id)

        if (!findWatch) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `Watch does not exist..`})
        }

        const otherWatchesCurrentWearing = await database.findAllCurrentWearing(id);
        otherWatchesCurrentWearing.forEach(async (watch) => {
            await database.update(id, {...watch, isCurrentlyWearing: false});
        })

        const updateWatch = await database.update(id, {...findWatch, isCurrentlyWearing: !findWatch.isCurrentlyWearing});

        return res.status(StatusCodes.OK).json({updateWatch})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})


watchRouter.delete("/watches/:id", AUTHENTICATE, async (req : Request, res : Response) => {
    try {
        const getWatch = await database.findOne(req.params.id)

        if (!getWatch) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `No watch with ID ${req.params.id}`})
        }

        await database.remove(req.params.id)

        return res.status(StatusCodes.OK).json({msg : `Watch deleted..`})

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

