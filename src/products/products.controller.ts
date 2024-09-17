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
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly transportClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      return this.transportClient.send(
        { cmd: 'createProduct' },
        createProductDto,
      );
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @Get()
  async getProducts(@Query() paginationDto: PaginationDto) {
    try {
      return await firstValueFrom(
        this.transportClient.send({ cmd: 'findAllProducts' }, paginationDto),
      );
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.transportClient.send({ cmd: 'findOneProduct' }, { id }),
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
        this.transportClient.send(
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
        this.transportClient.send({ cmd: 'removeProduct' }, { id }),
      );
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
