import {IClub} from '../types';
import {ClubModel} from './db';
import {ObjectId} from 'mongodb';

export class ClubRepository {
    private model: typeof ClubModel;

    constructor() {
        this.model = ClubModel;
    }

    async findClubs(name?: string): Promise<IClub[]> {
        const filter: Record<string, unknown> = {};
        if (name) {
            filter.name = {$regex: this.escapeRegex(name), $options: 'i'};
        }
        const clubsFromDB = await this.model.find(filter).lean();
        return clubsFromDB.map((club) => this.mapToClub(club));
    }

    async findClubById(uid: string): Promise<IClub | null> {
        if (!ObjectId.isValid(uid)) {
            return null;
        }
        const club = await this.model.findById(uid).lean();
        return club ? this.mapToClub(club) : null;
    }

    async createClub(name: string, url: string): Promise<IClub | null> {
        const createdClub = await this.model.create({name, url});
        return this.mapToClub(createdClub);
    }

    private mapToClub(dbObject: {_id: unknown; name: string; url: string}): IClub {
        return {
            uid: String(dbObject._id),
            name: dbObject.name,
            url: dbObject.url,
        };
    }

    private escapeRegex(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
