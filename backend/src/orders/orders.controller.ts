import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
  OrdersQueryDto,
  OrderResponseDto,
  OrdersListResponseDto,
  OrderCreatedResponseDto,
  OrderUpdatedResponseDto,
  MessageResponseDto,
} from './dto/orders.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'List orders',
    description: 'Users see only their own orders. Admins can see all orders.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of orders retrieved successfully',
    type: OrdersListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  findAll(
    @Query() query: OrdersQueryDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.ordersService.findAll(query, userId, userRole);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: 'ord_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Order details retrieved successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied (not your order)' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.ordersService.findOne(id, userId, userRole);
  }

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderCreatedResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser('id') userId: string) {
    return this.ordersService.create(createOrderDto, userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update order',
    description: 'Can only update orders with status "pending" or "processing"',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: 'ord_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
    type: OrderUpdatedResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation error / Cannot modify completed/cancelled order',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.ordersService.update(id, updateOrderDto, userId, userRole);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update order status (Admin only)',
    description: 'Valid transitions: pending → processing → shipped → delivered, pending/processing → cancelled',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: 'ord_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
    type: OrderUpdatedResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid status transition' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete order (Admin only)',
    description: 'Only pending orders can be deleted',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: 'ord_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Cannot delete non-pending order' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
