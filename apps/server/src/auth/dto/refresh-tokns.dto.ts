import { IsJWT, IsNotEmpty, IsString } from "class-validator"



export class RefreshTokensDto {


    @IsString()
    @IsJWT()
    @IsNotEmpty()
    accessToken: string

    @IsString()
    @IsNotEmpty()
    refreshToken: string

}