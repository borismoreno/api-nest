import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Empresa } from './schemas/empresa.schema';

@Injectable()
export class EmpresaService {
    constructor(
        @InjectModel(Empresa.name)
        private empresaModel: mongoose.Model<Empresa>
    ) { }

    async findById(id: string): Promise<Empresa> {
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) {
            throw new BadRequestException('Please enter correct id');
        }
        const empresa = await this.empresaModel.findById(id);
        if (!empresa) {
            throw new NotFoundException('Empresa no encontrada');
        }
        return empresa;
    }
}
