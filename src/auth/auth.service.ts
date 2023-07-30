import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash
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
    const user = this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
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

    delete (await user).hash;// on retourne l'user sans le mot de passe hasher
    return user;
  }
}
