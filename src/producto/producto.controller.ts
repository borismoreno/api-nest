import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from './schemas/producto.schema';
import { ProductoDto } from './dto/producto.dto';
import { IGenericResponse } from 'src/models/generic-response';

@Controller('producto')
export class ProductoController {
    constructor(private readonly productoService: ProductoService) { }

    @Get()
    async getAllProducts(@Request() req): Promise<Producto[]> {
        const claims = req.user;
        return this.productoService.findAll(claims.uid);
    }

    @Post()
    async createProducto(
        @Body()
        productoDTO: ProductoDto,
        @Request() req
    ): Promise<IGenericResponse> {
        const claims = req.user;
        return this.productoService.create(productoDTO, claims.uid);
    }

    @Put(':productoId')
    async updateProducto(
        @Param('productoId')
        productoId: string,
        @Body()
        productoDTO: ProductoDto,
        @Request() req
    ): Promise<IGenericResponse> {
        const claimns = req.user
        return this.productoService.update(productoId, productoDTO, claimns.uid);
    }

    @Delete(':id')
    async deleteProducto(
        @Param('id')
        id: string
    ): Promise<IGenericResponse> {
        return this.productoService.deleteById(id);
    }
}
