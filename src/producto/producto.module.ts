import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductoSchema } from './schemas/producto.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Producto', schema: ProductoSchema }])],
    controllers: [ProductoController],
    providers: [
        ProductoService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        }
    ],
})
export class ProductoModule { }
