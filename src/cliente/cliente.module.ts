import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClienteSchema } from './schemas/cliente.schema';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Cliente', schema: ClienteSchema }])],
    providers: [
        ClienteService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        }
    ],
    controllers: [ClienteController]
})
export class ClienteModule { }
