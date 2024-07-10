import { Module } from '@nestjs/common';
import { FirmaService } from './firma.service';
import { FirmaController } from './firma.controller';
import { EmpresaModule } from 'src/empresa/empresa.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
    imports: [EmpresaModule, UploadModule],
    providers: [FirmaService],
    controllers: [FirmaController]
})
export class FirmaModule { }
