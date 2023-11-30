import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from 'class-validator';

export class LoginDto {
    @ApiProperty()
    @IsEmail({}, { message: 'Wrong email format!' })
    readonly email: string;
    @ApiProperty()
    readonly password: string;
}