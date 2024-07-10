import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(username: string, password: string): Promise<any> {
        const usuario = await this.usersService.findUsuarioByEmail(username);
        if (usuario) {
            const isMatch = await bcrypt.compare(password, usuario.password);
            if (!isMatch) throw new UnauthorizedException();
        }
        const payload = { uid: usuario._id, userName: usuario.nombre, email: usuario.email, rol: usuario.rol, empresaId: usuario.empresa }
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}
