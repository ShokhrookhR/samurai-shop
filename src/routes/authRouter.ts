import {ILoginInputModel, IRegisterInputModel} from '../models';
import {Router, Request, Response} from 'express';
import {checkSchema} from 'express-validator';
import {AuthService} from '../domain';
import {JWTService} from '../infra';
import {inputValidationMiddleware} from '../middlewares';
import {HTTP_STATUSES} from '../constants';

export const getAuthRoutes = () => {
    const authRouter = Router();
    const authService = new AuthService();
    const jwtService = new JWTService();
    authRouter
        .post(
            '/login',
            checkSchema({
                usernameOrEmail: {
                    trim: true,
                    isString: true,
                    notEmpty: true,
                    errorMessage: {message: 'usernameOrEmail is required'},
                },
                password: {
                    notEmpty: true,
                    errorMessage: {message: 'Password is required'},
                },
            }),
            inputValidationMiddleware,
            async (req: Request<{}, {}, ILoginInputModel>, res: Response) => {
                const user = await authService.checkCredentials(req.body);
                if (!user) {
                    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
                    return;
                }
                const token = jwtService.createJWT({
                    userId: user._id,
                    username: user.accountData.username,
                });
                res.send({accessToken: token});
            }
        )
        .post(
            '/confirm-email',
            checkSchema({
                code: {
                    in: ['query'],
                    isString: true,
                    notEmpty: true,
                    errorMessage: {message: 'Confirmation code is required'},
                },
            }),
            inputValidationMiddleware,
            async (req: Request, res: Response) => {
                const isConfirmed = await authService.confirmEmail(req.query.code as string);
                if (!isConfirmed) {
                    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                    return;
                }
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
            }
        )
        .post(
            '/register',
            checkSchema({
                username: {
                    trim: true,
                    isString: true,
                    isLength: {options: {min: 3, max: 30}},
                    errorMessage: {message: 'Username should be from 3 to 30 characters'},
                },
                email: {
                    trim: true,
                    isEmail: true,
                    errorMessage: {message: 'Email should be correct'},
                },
                password: {
                    isLength: {options: {min: 6, max: 100}},
                    errorMessage: {message: 'Password should be from 6 to 100 characters'},
                },
            }),
            inputValidationMiddleware,
            async (req: Request<{}, {}, IRegisterInputModel>, res: Response) => {
                const createdUser = await authService.createUser(req.body);
                if (!createdUser) {
                    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                    return;
                }
                res.status(HTTP_STATUSES.CREATED_201).send({success: true});
            }
        );
    return authRouter;
};
