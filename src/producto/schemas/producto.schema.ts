import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    autoIndex: true,
    toJSON: { virtuals: true }
})
export class Producto {
    @Prop()
    descripcion: string;
    @Prop()
    codigoPrincipal: string;
    @Prop()
    codigoAuxiliar: string;
    @Prop()
    tipoProducto: string;
    @Prop()
    tarifaIva: string;
    @Prop()
    valorUnitario: number;
    @Prop()
    activo: boolean;
    @Prop()
    usuario: string;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);