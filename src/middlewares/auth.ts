import { Response, Request } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { User } from "../models";

const protectRoute = async (req: Request, res: Response, next: any) => {
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }
  //  else if (req.cookies.token) {
  //     // Set token from cookie
  //     token = req.cookies.token;
  //   }

  // Make sure token exists
  if (!token) {
    return res
      .status(401)
      .json({ error: "Not authorized to access this route" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload;
    req.user = await User.findByPk(decoded.id);
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ error: "Not authorized to access this route" });
  }
};

export default protectRoute;
