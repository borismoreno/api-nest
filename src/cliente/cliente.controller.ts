import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from './schemas/cliente.schema';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { IGenericResponse } from 'src/models/generic-response';

@Controller('cliente')
export class ClienteController {
    constructor(private clienteService: ClienteService) { }

    @Get()
    async getAllClientes(@Request() req): Promise<Cliente[]> {
        const claims = req.user;
        return this.clienteService.findAll(claims.uid);
    }

    @Post()
    async createCliente(
        @Body()
        clienteDTO: CreateClienteDto,
        @Request() req
    ): Promise<IGenericResponse> {
        const claimns = req.user
        return this.clienteService.create(clienteDTO, claimns.uid);
    }

    @Put(':clienteId')
    async updateCliente(
        @Param('clienteId')
        clienteId: string,
        @Body()
        clienteDTO: CreateClienteDto,
        @Request() req
    ): Promise<IGenericResponse> {
        const claimns = req.user
        return this.clienteService.update(clienteId, clienteDTO, claimns.uid);
    }

    @Delete(':id')
    async deleteCliente(
        @Param('id')
        id: string
    ): Promise<IGenericResponse> {
        return this.clienteService.deleteById(id);
    }
}
