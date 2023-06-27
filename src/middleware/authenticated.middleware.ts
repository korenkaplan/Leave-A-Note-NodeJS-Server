import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/token';
import UserModel from '@/resources/user/user.model';
import IToken from '@/utils/interfaces/token.interface';
import IHttpResponse from '@/utils/interfaces/httpResponse.interface';
import jwt from 'jsonwebtoken';

async function authenticatedMiddleware(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  // Extract the token from the Authorization header
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith('Bearer ')) {
    // Respond with an error if the token is missing or improperly formatted
    const resBody: IHttpResponse<void> = {
      message: 'Token Error',
      success: false,
      error: 'Bearer token is missing or improperly formatted',
      tokenError:true,
    };
    return res.status(401).json(resBody);
  }
  const accessToken = bearer.split('Bearer ')[1];

  try {
    // Verify the token and extract the payload
    const payload: IToken | jwt.JsonWebTokenError = await verifyToken(accessToken);
    if (payload instanceof jwt.JsonWebTokenError) {
      // Respond with an error if the token is invalid or expired
      const resBody: IHttpResponse<void> = {
        message: 'Token Error',
        success: false,
        error: 'Unauthorized token credentials',
        tokenError:true,

      };
      return res.status(401).json(resBody);
    }

    // Fetch the user associated with the token from the database
    const user = await UserModel.findById(payload.id).select('-password').exec();

    if (!user) {
      // Respond with an error if the user is not found
      const resBody: IHttpResponse<void> = {
        message: 'Token Error',
        success: false,
        error: 'Unauthorized token credentials',
      tokenError:true,

      };
      return res.status(401).json(resBody);
    }

    // Assign the user object to the request for further processing
    req.user = user;
    next();
  } catch (e: any) {
    // Respond with an error if an exception occurs during token verification
    const resBody: IHttpResponse<void> = {
      message: 'Token Error',
      success: false,
      error: e.message,
      tokenError:true,

    };
    return res.status(401).json(resBody);
  }
}

export default authenticatedMiddleware;
