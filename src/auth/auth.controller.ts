import { Body, Controller, Get, ParseIntPipe, Post, Req, Request } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){

    }

    @Post("signup")
    //on peut utiliser ca mais 
    // @Body('email') email: string,
    // @Body('password',ParseIntPipe) password: string
    signup(@Body() dto: AuthDto){
        return this.authService.signup(dto);
    }

    @Post("signin")
    signin(@Body() dto: AuthDto){
        return this.authService.signin(dto);
    }
}
