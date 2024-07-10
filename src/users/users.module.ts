import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema } from './schemas/user.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Usuario', schema: UsuarioSchema }])],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule { }
