import express, { Request } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { AuthRequest } from "../shared/models/authRequest.model";
import authRoutes from "../modules/auth/routes/auth.route";
import userRoutes from "../modules/user/routes/user.route";
import roleRoutes from "../modules/user/routes/role.route";
import tourRoutes from "../modules/tour/routes/tour.route";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: `Welcome to API ${process.env.APP_NAME} ${process.env.API_VERSION}`,
    });
});

router.use(`/auth`, authRoutes);

router.use(`/users`, authMiddleware, userRoutes);

router.use(`/roles`, authMiddleware, roleRoutes);

router.use(`/tours`, authMiddleware, tourRoutes);

router.get("/protected", authMiddleware, (req, res) => {
    const authReq = req as AuthRequest;
    res.status(200).json({
        status: true,
        message: "You have accessed a protected route!",
        user: authReq.auth,
    });
});

export default router;
