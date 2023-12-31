import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash; // cela veut dire qu'on ne retourne pas le mot de passe hasher
      return user;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credential taken',
          );
        }
        throw error;
      }
    }
  }

  async signin(dto: AuthDto) {
    try {
      const user = this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      console.log(user);
      if (!user)
        throw new ForbiddenException(
          'Credentials incorrect',
        );

      const pwMatch = await argon.verify(
        (
          await user
        ).hash,
        dto.password,
      );

      if (!pwMatch)
        throw new ForbiddenException(
          'Credential incorrect',
        );
      return this.signToken(
        (await user).id,
        (await user).email,
      );
    } catch (e) {
      return e;
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '300m',
        secret: secret,
      },
    );
    return {
      access_token: token,
    };
  }
}
