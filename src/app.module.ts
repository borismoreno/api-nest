import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FirmaModule } from './firma/firma.module';
import { EmpresaModule } from './empresa/empresa.module';
import { UploadModule } from './upload/upload.module';
import { ClienteModule } from './cliente/cliente.module';
import { ProductoModule } from './producto/producto.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            // envFilePath: '.env',
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.DB_URI),
        BookModule,
        AuthModule,
        UsersModule,
        FirmaModule,
        EmpresaModule,
        UploadModule,
        ClienteModule,
        ProductoModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
