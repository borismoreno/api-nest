import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateClienteDto {
    @IsNotEmpty()
    @IsString()
    readonly razonSocial: string;
    @IsNotEmpty()
    @IsString()
    readonly tipoIdentificacion: string;
    @IsNotEmpty()
    @IsString()
    readonly numeroIdentificacion: string;
    @IsNotEmpty()
    @IsString()
    readonly telefono: string;
    @IsNotEmpty()
    @IsEmail()
    readonly mail: string;
    @IsNotEmpty()
    @IsString()
    readonly direccion: string;
}