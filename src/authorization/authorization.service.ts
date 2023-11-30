import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
var bcrypt = require('bcryptjs');

@Injectable()
export class AuthorizationService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async login(email: string, password: string): Promise<{ token: string }> {
        const user = await this.usersService.findOne(email);

        if(!user) {
            throw new UnauthorizedException('User not found with email: ' + email);
        }

        return bcrypt.compare(password, user.password).then(async (res: boolean) => {
            if(!res) {
                throw new UnauthorizedException('Wrong credentials!');
            }
    
            const jwtPayload = { email };
    
            return {
                token: await this.jwtService.signAsync(jwtPayload)
            };
        })
    }
}
