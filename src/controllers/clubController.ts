import {Request, Response} from 'express';
import {ClubService} from '../domain';
import {IClubInputBodyModel, IClubInputModel} from '../models';
import {HTTP_STATUSES} from '../constants';

export class ClubController {
    constructor() {
        this.service = new ClubService();
    }

    private readonly service: ClubService;

    getClubs = async (
        req: Request<{}, {}, {}, IClubInputModel>,
        res: Response
    ) => {
        const allClubs = await this.service.findClubs(req.query.name);
        res.send(allClubs);
    };

    getClubByUId = async (req: Request<{uid: string}>, res: Response) => {
        const foundClub = await this.service.findClubByUId(req.params.uid);
        if (!foundClub) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.send(foundClub);
    };

    createClub = async (
        req: Request<{}, {}, IClubInputBodyModel>,
        res: Response
    ) => {
        const createdClub = await this.service.createClub(
            req.body.name,
            req.body.url
        );
        if (!createdClub) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        res.status(HTTP_STATUSES.CREATED_201).send(createdClub);
    };
}
