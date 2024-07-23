import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cliente } from './schemas/cliente.schema';
import mongoose from 'mongoose';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { IGenericResponse } from 'src/models/generic-response';

@Injectable()
export class ClienteService {
    constructor(
        @InjectModel(Cliente.name)
        private clienteModel: mongoose.Model<Cliente>
    ) { }

    async findAll(usuarioId: string): Promise<Cliente[]> {
        const clientes = await this.clienteModel.find({ Usuario: usuarioId }).exec();
        return clientes;
    }

    async create(cliente: CreateClienteDto, usuarioId: string): Promise<IGenericResponse> {
        const clienteInsertar: Cliente = {
            RazonSocial: cliente.razonSocial,
            TipoIdentificacion: cliente.tipoIdentificacion,
            Activo: true,
            NumeroIdentificacion: cliente.numeroIdentificacion,
            Telefono: cliente.telefono,
            Mail: cliente.mail,
            Direccion: cliente.direccion,
            Usuario: usuarioId
        };

        await this.clienteModel.create(clienteInsertar);
        return { success: true };
    }

    async update(clienteId: string, clienteDTO: CreateClienteDto, usuarioId: string): Promise<IGenericResponse> {
        const clienteInsertar: Cliente = {
            RazonSocial: clienteDTO.razonSocial,
            TipoIdentificacion: clienteDTO.tipoIdentificacion,
            Activo: true,
            NumeroIdentificacion: clienteDTO.numeroIdentificacion,
            Telefono: clienteDTO.telefono,
            Mail: clienteDTO.mail,
            Direccion: clienteDTO.direccion,
            Usuario: usuarioId
        };
        await this.clienteModel.findByIdAndUpdate(clienteId, clienteInsertar);
        return { success: true };
    }

    async deleteById(id: string): Promise<IGenericResponse> {
        await this.clienteModel.findByIdAndDelete(id)
        return { success: true };
    }
}
