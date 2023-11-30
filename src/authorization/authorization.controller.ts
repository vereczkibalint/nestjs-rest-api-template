import { Controller, UseFilters, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { LoginDto } from './dto/login.dto';
import { AuthorizationGuard } from './authorization.guard';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthorizationController {
    constructor(private authService: AuthorizationService) {}

    @Post('login')
    @UseFilters(new HttpExceptionFilter())
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @UseGuards(AuthorizationGuard)
    @Get('me')
    @UseFilters(new HttpExceptionFilter())
    @ApiBearerAuth()
    getMe(@Request() request) {
        return request.user;
    }
}
