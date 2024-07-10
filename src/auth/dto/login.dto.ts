import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message: 'Email es requerido' })
    @IsEmail()
    readonly email: string;
    @IsNotEmpty({ message: 'Password es requerido' })
    @IsString({ message: 'Ingrese un password valido' })
    readonly password: string;
}