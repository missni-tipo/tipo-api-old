import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
    user?: { role: string };
}

function checkRole(requiredRole: string) {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (user.role !== requiredRole) {
            return res
                .status(403)
                .json({ message: "Forbidden: Insufficient role" });
        }

        next();
    };
}

export default checkRole;
