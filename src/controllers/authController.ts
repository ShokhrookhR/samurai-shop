import {Request, Response} from 'express';
import {AuthService} from '../domain';
import {JWTService} from '../infra';
import {ILoginInputModel, IRegisterInputModel} from '../models';
import {HTTP_STATUSES} from '../constants';

export class AuthController {
    constructor() {
        this.service = new AuthService();
        this.jwtService = new JWTService();
    }

    private readonly service: AuthService;
    private readonly jwtService: JWTService;

    login = async (req: Request<{}, {}, ILoginInputModel>, res: Response) => {
        const user = await this.service.checkCredentials(req.body);
        if (!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const token = this.jwtService.createJWT({
            userId: user._id,
            username: user.accountData.username,
        });
        res.send({accessToken: token});
    };

    confirmEmail = async (req: Request, res: Response) => {
        const isConfirmed = await this.service.confirmEmail(req.query.code as string);
        if (!isConfirmed) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    };

    register = async (req: Request<{}, {}, IRegisterInputModel>, res: Response) => {
        const createdUser = await this.service.createUser(req.body);
        if (!createdUser) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        res.status(HTTP_STATUSES.CREATED_201).send({success: true});
    };
}
