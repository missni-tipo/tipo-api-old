import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { CustomRequest } from "../shared/models/customRequest.model";
import authRoutes from "../modules/auth/routes/auth.route";
import userRoutes from "../modules/user/routes/user.route";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: `Welcome to API ${process.env.APP_NAME} ${process.env.API_VERSION}`,
    });
});

router.use(`/auth`, authRoutes);

router.use(`/users`, authMiddleware, userRoutes);

router.get("/protected", authMiddleware, (req: CustomRequest, res) => {
    res.status(200).json({
        status: true,
        message: "You have accessed a protected route!",
        user: req.user,
    });
});

export default router;
