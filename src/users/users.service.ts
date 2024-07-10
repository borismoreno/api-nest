import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './schemas/user.schema';
import mongoose from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(Usuario.name)
        private usuarioModel: mongoose.Model<Usuario>
    ) { }

    async findUsuarioByEmail(email: string): Promise<Usuario> {
        return await this.usuarioModel.findOne({ email: email }, '_id email password nombre rol empresa').exec();
    }
}
