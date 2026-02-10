/**
 * Prisma Module - PrismaService'i tüm modüllere sağlar.
 * Global olarak export edilir, her modülde ayrıca import etmeye gerek yoktur.
 */
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
