import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

// Nested DTOs
export class AddressDto {
  @ApiProperty({ description: 'Street address', example: '123 Main St' })
  @IsString()
  street: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'State/Province', example: 'NY' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'ZIP/Postal code', example: '10001' })
  @IsString()
  zipCode: string;

  @ApiProperty({ description: 'Country', example: 'USA' })
  @IsString()
  country: string;
}

export class OrderItemDto {
  @ApiProperty({ description: 'Product ID', example: 'prod_abc123' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Product name', example: 'Product A' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Quantity', example: 2, minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Price per unit', example: 29.99 })
  @IsNumber()
  @Min(0)
  price: number;
}

// Request DTOs
export class CreateOrderDto {
  @ApiProperty({ description: 'Customer full name', example: 'John Doe' })
  @IsString()
  customerName: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'customer@example.com',
  })
  @IsEmail()
  customerEmail: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({ description: 'Shipping address', type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  @ApiPropertyOptional({
    description: 'Billing address (defaults to shipping)',
    type: AddressDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress?: AddressDto;

  @ApiProperty({ description: 'Order items', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional({ description: 'Order notes', example: 'Please handle with care' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderDto {
  @ApiPropertyOptional({ description: 'Customer full name', example: 'John Doe' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    description: 'Customer email',
    example: 'customer@example.com',
  })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional({ description: 'Shipping address', type: AddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress?: AddressDto;

  @ApiPropertyOptional({ description: 'Order items', type: [OrderItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];

  @ApiPropertyOptional({ description: 'Order notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    enum: OrderStatus,
    example: 'processing',
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Reason for status change',
    example: 'Order is being prepared',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class OrdersQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    default: 1,
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page (max 100)',
    default: 10,
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: OrderStatus,
    example: 'pending',
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Filter orders from date (ISO 8601)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter orders until date (ISO 8601)',
    example: '2024-01-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Sort field',
    default: 'createdAt',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: SortOrder,
    default: SortOrder.DESC,
    example: 'desc',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}

// Response DTOs
export class OrderItemResponseDto {
  @ApiProperty({ example: 'item_001' })
  id: string;

  @ApiProperty({ example: 'prod_abc123' })
  productId: string;

  @ApiProperty({ example: 'Product A' })
  name: string;

  @ApiPropertyOptional({ example: 'Product description' })
  description?: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 29.99 })
  price: number;

  @ApiProperty({ example: 59.98 })
  total: number;
}

export class AddressResponseDto {
  @ApiProperty({ example: '123 Main St' })
  street: string;

  @ApiProperty({ example: 'New York' })
  city: string;

  @ApiProperty({ example: 'NY' })
  state: string;

  @ApiProperty({ example: '10001' })
  zipCode: string;

  @ApiProperty({ example: 'USA' })
  country: string;
}

export class OrderResponseDto {
  @ApiProperty({ example: 'ord_123456789' })
  id: string;

  @ApiProperty({ example: 'ORD-2024-0001' })
  orderNumber: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ example: 'John Doe' })
  customerName: string;

  @ApiProperty({ example: 'customer@example.com' })
  customerEmail: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  customerPhone?: string;

  @ApiProperty({ type: AddressResponseDto })
  shippingAddress: AddressResponseDto;

  @ApiPropertyOptional({ type: AddressResponseDto })
  billingAddress?: AddressResponseDto;

  @ApiProperty({ enum: OrderStatus, example: 'pending' })
  status: OrderStatus;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ example: 59.98 })
  subtotal: number;

  @ApiProperty({ example: 0 })
  discount: number;

  @ApiProperty({ example: 5.4 })
  tax: number;

  @ApiProperty({ example: 5.0 })
  shipping: number;

  @ApiProperty({ example: 70.38 })
  total: number;

  @ApiPropertyOptional({ example: 'Please handle with care' })
  notes?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class OrderListItemDto {
  @ApiProperty({ example: 'ord_123456789' })
  id: string;

  @ApiProperty({ example: 'ORD-2024-0001' })
  orderNumber: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ example: 'John Doe' })
  customerName: string;

  @ApiProperty({ example: 'customer@example.com' })
  customerEmail: string;

  @ApiProperty({ enum: OrderStatus, example: 'pending' })
  status: OrderStatus;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ example: 59.98 })
  subtotal: number;

  @ApiProperty({ example: 5.4 })
  tax: number;

  @ApiProperty({ example: 65.38 })
  total: number;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 150 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 15 })
  totalPages: number;
}

export class OrdersListResponseDto {
  @ApiProperty({ type: [OrderListItemDto] })
  data: OrderListItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class OrderCreatedResponseDto {
  @ApiProperty({ example: 'ord_123456789' })
  id: string;

  @ApiProperty({ example: 'ORD-2024-0001' })
  orderNumber: string;

  @ApiProperty({ enum: OrderStatus, example: 'pending' })
  status: OrderStatus;

  @ApiProperty({ example: 70.38 })
  total: number;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;
}

export class OrderUpdatedResponseDto {
  @ApiProperty({ example: 'ord_123456789' })
  id: string;

  @ApiProperty({ example: 'ORD-2024-0001' })
  orderNumber: string;

  @ApiProperty({ enum: OrderStatus, example: 'pending' })
  status: OrderStatus;

  @ApiProperty({ example: '2024-01-15T11:00:00.000Z' })
  updatedAt: Date;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Order deleted successfully' })
  message: string;
}
