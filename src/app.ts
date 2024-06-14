import express from "express";
import * as dotevnv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { userRouter } from "./users/users.routes";
import { watchRouter } from "./watches/watch.routes";
import { adminRouter } from "./admin/admin.routes";
import { ADMIN } from "./middleware/admin";
import { AUTHENTICATE } from "./middleware/authenticate";

dotevnv.config();

if (!process.env.PORT) {
    console.log(`No port value specified...`);
}

const PORT = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());
app.use(helmet());

app.use('/user', userRouter);
app.use('/watches', AUTHENTICATE, watchRouter);
app.use('/admin', ADMIN, adminRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
