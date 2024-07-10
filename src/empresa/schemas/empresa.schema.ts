import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Empresa {
    @Prop()
    obligadoContabilidad: string;
    @Prop()
    activo: boolean;
    @Prop()
    tipoEmision: number;
    @Prop()
    razonSocial: string;
    @Prop()
    nombreComercial: string;
    @Prop()
    establecimiento: string;
    @Prop()
    puntoEmision: string;
    @Prop()
    direccionMatriz: string;
    @Prop()
    direccionEstablecimiento: string;
    @Prop()
    contribuyenteEspecial: string;
    @Prop()
    secuencialFactura: string;
    @Prop()
    claveFirma: string;
    @Prop()
    ruc: string;
    @Prop()
    pathCertificado: string;
    @Prop()
    contribuyenteRimpe: boolean;
}

export const EmpresaSchema = SchemaFactory.createForClass(Empresa);