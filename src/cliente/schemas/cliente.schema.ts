import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// export type ClienteDocument = HydratedDocument<Cliente>;

@Schema({
    autoIndex: true,
    toJSON: { virtuals: true }
})
export class Cliente {
    @Prop()
    RazonSocial: string;
    @Prop()
    Activo: boolean;
    @Prop()
    TipoIdentificacion: string;
    @Prop()
    NumeroIdentificacion: string;
    @Prop()
    Telefono: string;
    @Prop()
    Mail: string;
    @Prop()
    Direccion: string;
    @Prop()
    Usuario: string;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);