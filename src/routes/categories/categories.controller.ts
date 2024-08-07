import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { FirebaseAuth } from 'firebase-admin/firebase-auth.decorator';
import { CategoriesService } from 'routes/categories/categories.service';
import { CreateCategoryDto } from 'routes/categories/dto/create-category.dto';
import { UpdateCategoryDto } from 'routes/categories/dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @FirebaseAuth()
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    return this.categoriesService.create(createCategoryDto, req.user.uid);
  }

  @Get('/products')
  findAllProducts() {
    return this.categoriesService.findAllProducts();
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Get(':id/products')
  findProds(@Param('id') id: string) {
    return this.categoriesService.findProds(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
