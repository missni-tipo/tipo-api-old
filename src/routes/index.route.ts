import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: `Welcome to API ${process.env.APP_NAME} ${process.env.API_VERSION}`,
    });
});

export default router;
