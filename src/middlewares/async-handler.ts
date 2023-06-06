import { Request, Response, NextFunction } from "express";
const asyncAwaitHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncAwaitHandler;
