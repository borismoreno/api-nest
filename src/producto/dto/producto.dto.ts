import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ProductoDto {
    @IsNotEmpty()
    @IsString()
    readonly descripcion: string;
    @IsNotEmpty()
    @IsString()
    readonly codigoPrincipal: string;
    @IsString()
    readonly codigoAuxiliar: string;
    @IsNotEmpty()
    @IsString()
    readonly tipoProducto: string;
    @IsNotEmpty()
    @IsString()
    readonly tarifaIva: string;
    @IsNotEmpty()
    @IsNumber()
    readonly valorUnitario: number;
}