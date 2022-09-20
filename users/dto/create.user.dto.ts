export interface CreateUserDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export interface CreateUserWithoutPassWordDto {
    email: string;
    name: string;
    providerUID: string;
}

