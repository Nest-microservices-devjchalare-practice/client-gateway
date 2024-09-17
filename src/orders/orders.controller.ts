import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly transportClient: ClientProxy,
  ) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.transportClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAllOrders(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.transportClient.send('findAllOrders', orderPaginationDto);
  }

  @Get('id/:id')
  async findOneOrder(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await firstValueFrom(
        this.transportClient.send('findOneOrder', { id }),
      );
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @Get(':status')
  async findAllByStatus(
    @Query() paginationDto: PaginationDto,
    @Param() statusDto: StatusDto,
  ) {
    try {
      return await firstValueFrom(
        this.transportClient.send('findAllOrders', {
          ...paginationDto,
          status: statusDto.status,
        }),
      );
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return this.transportClient.send('changeStatusOrder', {
        id,
        status: statusDto.status,
      });
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
