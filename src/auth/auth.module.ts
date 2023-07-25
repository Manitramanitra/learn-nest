import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  // imports: [PrismaModule], mais on peut aussi l'utiliser pour tout les components en utilisant le décorateur @
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}