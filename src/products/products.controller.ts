import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      return this.productClient.send(
        { cmd: 'createProduct' },
        createProductDto,
      );
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @Get()
  getProducts(@Query() paginationDto: PaginationDto) {
    return this.productClient.send({ cmd: 'findAllProducts' }, paginationDto);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.productClient.send({ cmd: 'findOneProduct' }, { id }),
      );
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @Patch(':id')
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      return await firstValueFrom(
        this.productClient.send(
          { cmd: 'updateProduct' },
          { id, ...updateProductDto },
        ),
      );
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      return await firstValueFrom(
        this.productClient.send({ cmd: 'removeProduct' }, { id }),
      );
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
