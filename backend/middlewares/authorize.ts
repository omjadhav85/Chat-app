import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authCheck = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization token is missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decodedToken; // Attach the decoded payload to the req object
    next();
  } catch (error) {
    // 401 (not 403) tells the client the token is no longer valid
    // and that it should log the user out
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
