interface IDB {
  clubs: IClub[];
}
interface IClub {
  id: number;
  name: string;
  url: string;
}
const db: IDB = {
  clubs: [
    {id: 1, name: 'Manchester United', url: 'https://www.manutd.com/'},
    {id: 2, name: 'PSG', url: 'https://www.kuku.com/'},
    {id: 3, name: 'Chicago Bulls', url: 'https://www.kuku.com/'},
    {id: 4, name: 'LA Lakers', url: 'https://www.kuku.com/'},
    {id: 5, name: 'Westham United', url: 'https://www.kuku.com/'},
  ],
};
export class ClubRepository {
  constructor() {}
  async findClubs(name?: string): Promise<IClub[]> {
    let foundClubsQuery = db.clubs;
    if (name) {
      foundClubsQuery = db.clubs.filter(
        (club) => club.name.indexOf(name) !== -1
      );
    }
    return foundClubsQuery;
  }
  async findClubById(id: number): Promise<IClub | null> {
    const foundClub = db.clubs.find((club) => club.id === id);
    if (!foundClub) {
      return null;
    }
    return foundClub;
  }
  async createClub(name: string, url: string): Promise<IClub> {
    const newClub = {
      id: +new Date(),
      name: name,
      url: url,
    };
    db.clubs.push(newClub);
    return newClub;
  }
}
