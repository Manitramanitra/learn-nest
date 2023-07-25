import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//il suffit juste de mettre  @Global() pour que le service soit acceccible a tous le monde
@Global()

@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
