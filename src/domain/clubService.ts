import {ClubRepository} from '../repositories';
import {IClub} from '../types';

export class ClubService {
    constructor() {
        this.repository = new ClubRepository();
    }

    private readonly repository: ClubRepository;

    async findClubs(name?: string): Promise<IClub[]> {
        return await this.repository.findClubs(name);
    }

    async findClubByUId(uid: string): Promise<IClub | null> {
        return await this.repository.findClubById(uid);
    }

    async createClub(name: string, url: string): Promise<IClub | null> {
        return await this.repository.createClub(name, url);
    }
}
