import express from "express";
import authRoutes from "../modules/auth/routes/auth.route";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: `Welcome to API ${process.env.APP_NAME} ${process.env.API_VERSION}`,
    });
});

router.use(`/auth`, authRoutes);

export default router;
