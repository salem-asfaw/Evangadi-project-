import { StatusCodes } from 'http-status-codes';
import { registerService, loginService } from '../service/auth.service.js';

/**
 * Handles user registration requests.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
export const registerController = async (req, res, next) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const authResult = await registerService(req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      user: authResult.user,
      token: authResult.token,
    });
  } catch (error) {
    console.log("REGISTER ERROR FULL:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

/**
 * Handles user login requests.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
export const loginController = async (req, res, next) => {
  try {
    const authResult = await loginService(req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      user: authResult.user,
      token: authResult.token,
    });
  } catch (error) {
    console.log("LOGIN ERROR FULL:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};