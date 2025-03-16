import express from "express";
import authRoutes from "../modules/auth/routes/auth.route";
import authMiddleware from "../middlewares/auth.middleware";
import { CustomRequest } from "../shared/models/customRequest.model";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: `Welcome to API ${process.env.APP_NAME} ${process.env.API_VERSION}`,
    });
});

router.use(`/auth`, authRoutes);

router.get("/protected", authMiddleware, (req: CustomRequest, res) => {
    res.status(200).json({
        status: true,
        message: "You have accessed a protected route!",
        user: req.user,
    });
});

export default router;
