import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
// import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  // imports: [PrismaModule], mais on peut aussi l'utiliser pour tout les components en utilisant le décorateur @
  imports:[JwtModule.register({})],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
