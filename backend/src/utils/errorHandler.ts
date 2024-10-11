import { Request, Response, NextFunction } from "express";

export const errorHandler = {
  handleErrors: (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  },
  handle404: (req: Request, res: Response) => {
    console.log("404 Not Found:", req.method, req.url);
    res.status(404).json({ error: "Not Found" });
  },
};
