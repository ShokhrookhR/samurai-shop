export interface IAuthInputModel {
  body: {
    username: string;
    email: string;
    password: string;
  };
  query: {
    code: string;
  };
}
