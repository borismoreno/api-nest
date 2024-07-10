import { Controller, Get, UseGuards, Request, Param, BadRequestException } from '@nestjs/common';
import { FirmaService } from './firma.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { EmpresaService } from 'src/empresa/empresa.service';

@Controller('firma')
export class FirmaController {
    constructor(private firmaService: FirmaService, private empresaService: EmpresaService) { }

    @UseGuards(AuthGuard)
    @Get(':claveAcceso')
    async getFirma(
        @Request() req,
        @Param('claveAcceso') claveAcceso
    ): Promise<String> {
        const claims = req.user;
        if (claims && claims.empresaId) {
            const empresa = await this.empresaService.findById(claims.empresaId);
            return this.firmaService.firma(empresa.pathCertificado, empresa.claveFirma, claveAcceso);
        } else {
            throw new BadRequestException('Error al obtener la empresa');
        }
    }
}
