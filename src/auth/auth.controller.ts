import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get, Request, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @Public()
    async login(
        @Body()
        login: LoginDto
    ): Promise<any> {
        return this.authService.signIn(login.email, login.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile/:id')
    getProfile(@Request() req, @Param('id') clave) {
        return req.user;
    }
}
