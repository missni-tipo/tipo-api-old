import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

import { config } from "./config/config";
import router from "./routes/index.route";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use(`/api/${config.API_VERSION}`, router);

const startServer = async () => {
    try {
        app.listen(config.PORT, () => {
            console.log(`🚀 Server running at http://localhost:${config.PORT}`);
        });
    } catch (error) {
        console.error("🔥 Error starting server:", error);
        process.exit(1);
    }
};

startServer();
