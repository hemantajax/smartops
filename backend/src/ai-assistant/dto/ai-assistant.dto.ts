import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// Request DTOs
export class ChatMessageDto {
  @ApiProperty({
    description: 'User message or query',
    example: 'Show me all pending orders from last week',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'ID to continue existing conversation',
    example: 'conv_xyz789',
  })
  @IsOptional()
  @IsString()
  conversationId?: string;

  @ApiPropertyOptional({
    description: 'Additional context for the AI',
    example: {
      currentPage: 'orders',
      selectedItems: ['ord_001', 'ord_002'],
      filters: { status: 'pending', dateRange: 'last_7_days' },
    },
  })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}

export class ExecuteActionDto {
  @ApiProperty({
    description: 'Action type',
    example: 'process_order',
  })
  @IsString()
  action: string;

  @ApiProperty({
    description: 'Action parameters',
    example: { orderId: 'ord_001', newStatus: 'processing' },
  })
  @IsObject()
  params: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Related conversation ID',
    example: 'conv_xyz789',
  })
  @IsOptional()
  @IsString()
  conversationId?: string;
}

export class ConversationsQueryDto {
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
    description: 'Items per page',
    default: 20,
    minimum: 1,
    maximum: 100,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class ConversationMessagesQueryDto {
  @ApiPropertyOptional({
    description: 'Number of messages to retrieve',
    default: 50,
    minimum: 1,
    maximum: 100,
    example: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @ApiPropertyOptional({
    description: 'Get messages before this message ID',
    example: 'msg_abc123',
  })
  @IsOptional()
  @IsString()
  before?: string;
}

// Response DTOs
export class SuggestedActionDto {
  @ApiProperty({ example: 'View all orders' })
  label: string;

  @ApiProperty({ example: 'navigate' })
  action: string;

  @ApiProperty({ example: { path: '/orders?status=pending' } })
  params: Record<string, any>;
}

export class ChatDataDto {
  @ApiProperty({ example: 'orders_summary' })
  type: string;

  @ApiPropertyOptional({
    example: [
      { id: 'ord_001', orderNumber: 'ORD-2024-0150', total: 125.0, status: 'pending' },
    ],
  })
  orders?: any[];

  @ApiPropertyOptional({
    example: { count: 15, totalValue: 2450.0, averageValue: 163.33 },
  })
  summary?: Record<string, any>;
}

export class ChatResponseDto {
  @ApiProperty({ example: 'msg_abc123' })
  id: string;

  @ApiProperty({ example: 'conv_xyz789' })
  conversationId: string;

  @ApiProperty({
    example:
      "I found 15 pending orders from last week. Here's a summary:\n\n- Total value: $2,450.00\n- Average order value: $163.33\n- Oldest pending order: 5 days ago\n\nWould you like me to show the detailed list or help you process these orders?",
  })
  response: string;

  @ApiPropertyOptional({ type: ChatDataDto })
  data?: ChatDataDto;

  @ApiPropertyOptional({ type: [SuggestedActionDto] })
  suggestedActions?: SuggestedActionDto[];

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;
}

export class MessageDto {
  @ApiProperty({ example: 'msg_001' })
  id: string;

  @ApiProperty({ enum: ['user', 'assistant'], example: 'user' })
  role: string;

  @ApiProperty({ example: 'Show me all pending orders' })
  content: string;

  @ApiPropertyOptional({ type: ChatDataDto })
  data?: ChatDataDto;

  @ApiProperty({ example: '2024-01-15T10:29:00.000Z' })
  createdAt: Date;
}

export class ConversationDetailDto {
  @ApiProperty({ example: 'conv_xyz789' })
  id: string;

  @ApiProperty({ type: [MessageDto] })
  messages: MessageDto[];

  @ApiProperty({ example: '2024-01-15T10:29:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class ConversationListItemDto {
  @ApiProperty({ example: 'conv_xyz789' })
  id: string;

  @ApiProperty({ example: 'Pending orders inquiry' })
  title: string;

  @ApiProperty({ example: 'I found 15 pending orders...' })
  lastMessage: string;

  @ApiProperty({ example: 5 })
  messageCount: number;

  @ApiProperty({ example: '2024-01-15T10:29:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}

export class ConversationsListResponseDto {
  @ApiProperty({ type: [ConversationListItemDto] })
  data: ConversationListItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class ActionResultDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    example: 'Order ORD-2024-0150 has been updated to processing status',
  })
  message: string;

  @ApiPropertyOptional({
    example: {
      orderId: 'ord_001',
      previousStatus: 'pending',
      newStatus: 'processing',
    },
  })
  result?: Record<string, any>;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Conversation deleted successfully' })
  message: string;
}
