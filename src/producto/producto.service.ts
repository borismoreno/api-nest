import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Producto } from './schemas/producto.schema';
import mongoose from 'mongoose';
import { ProductoDto } from './dto/producto.dto';
import { IGenericResponse } from 'src/models/generic-response';

@Injectable()
export class ProductoService {
    constructor(
        @InjectModel(Producto.name)
        private productoModel: mongoose.Model<Producto>
    ) { }

    async findAll(usuarioId: string): Promise<Producto[]> {
        const productos = await this.productoModel.find({ usuario: usuarioId }).exec();
        return productos;
    }

    async create(productoDto: ProductoDto, usuarioId: string): Promise<IGenericResponse> {
        const productoInsertar: Producto = {
            codigoPrincipal: productoDto.codigoPrincipal,
            codigoAuxiliar: productoDto.codigoAuxiliar,
            descripcion: productoDto.descripcion,
            tarifaIva: productoDto.tarifaIva,
            tipoProducto: productoDto.tipoProducto,
            valorUnitario: productoDto.valorUnitario,
            activo: true,
            usuario: usuarioId
        };

        await this.productoModel.create(productoInsertar);
        return { success: true };
    }

    async update(productoId: string, productoDto: ProductoDto, usuarioId: string):
        Promise<IGenericResponse> {
        const producto = this.productoModel.findById(productoId);
        if (!producto) throw new NotFoundException('Producto no encontrado');
        const productoInsertar: Producto = {
            codigoPrincipal: productoDto.codigoPrincipal,
            codigoAuxiliar: productoDto.codigoAuxiliar,
            descripcion: productoDto.descripcion,
            tarifaIva: productoDto.tarifaIva,
            tipoProducto: productoDto.tipoProducto,
            valorUnitario: productoDto.valorUnitario,
            activo: true,
            usuario: usuarioId
        };
        await this.productoModel.findByIdAndUpdate(productoId, productoInsertar);
        return { success: true };
    }

    async deleteById(id: string): Promise<IGenericResponse> {
        const producto = await this.productoModel.findById(id);
        if (!producto) return { success: false, message: 'Producto no encontrado' };
        await this.productoModel.findByIdAndDelete(id)
        return { success: true };
    }
}
