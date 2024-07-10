import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Usuario {
    @Prop()
    _id: string;
    @Prop()
    rol: string;
    @Prop()
    nombre: string;
    @Prop()
    email: string;
    @Prop()
    password: string;
    @Prop()
    empresa: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);