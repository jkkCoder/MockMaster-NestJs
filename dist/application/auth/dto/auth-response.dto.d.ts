export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        username: string;
        fullName: string;
        mail: string;
    };
}
