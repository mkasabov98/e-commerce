export enum UserRoles {
    User,
    Admin,
}

export interface loggedUser {
    email: string;
    role: UserRoles;
    id: number;
}

export interface loginResponse {
    userData: loggedUser;
    token: string;
}
