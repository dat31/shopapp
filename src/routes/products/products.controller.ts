import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FirebaseAuth } from 'firebase-admin/firebase-auth.decorator';
import { GetS3SignedUrlInterceptor } from 's3/get-s3-signed-url.interceptor';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @FirebaseAuth()
  @Post()
  create(@Request() req, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(req.user.uid, createProductDto);
  }

  @FirebaseAuth()
  @UseInterceptors(GetS3SignedUrlInterceptor)
  @Get()
  findAll(@Request() req) {
    console.log('findAll', req);
    return this.productsService.findAll(req.user.uid);
  }

  @FirebaseAuth()
  @UseInterceptors(GetS3SignedUrlInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
