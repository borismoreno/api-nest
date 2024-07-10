import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema } from './schemas/book.schema';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }])],
    controllers: [BookController],
    providers: [
        BookService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        }
    ]
})
export class BookModule { }
