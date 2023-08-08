import { Body, Controller, Get, HttpCode, HttpStatus, ParseIntPipe, Post, Req, Request } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){

    }

    @Post("signup")
    signup(@Body() dto: AuthDto){
        return this.authService.signup(dto);
    }

    // @HttpCode(HttpStatus.OK)
    @HttpCode(200)
    @Post("signin")
    signin(@Body() dto: AuthDto){
        return this.authService.signin(dto);
    }
}
