import {
  Controller,
  Get,
  Post,
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
import { AiAssistantService } from './ai-assistant.service';
import {
  ChatMessageDto,
  ExecuteActionDto,
  ConversationsQueryDto,
  ConversationMessagesQueryDto,
  ChatResponseDto,
  ConversationDetailDto,
  ConversationsListResponseDto,
  ActionResultDto,
  MessageResponseDto,
} from './dto/ai-assistant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('ai')
@ApiBearerAuth('JWT-auth')
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send message to AI assistant',
    description:
      'Send a message to the AI assistant and get a response with optional data and suggested actions.',
  })
  @ApiResponse({
    status: 200,
    description: 'AI response generated successfully',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid message' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests - Rate limit exceeded',
    schema: {
      example: {
        statusCode: 429,
        message: 'Rate limit exceeded. Please try again in 5 minutes.',
        retryAfter: 300,
      },
    },
  })
  @ApiResponse({ status: 503, description: 'Service Unavailable - AI service temporarily unavailable' })
  chat(@Body() chatMessageDto: ChatMessageDto, @CurrentUser('id') userId: string) {
    return this.aiAssistantService.chat(chatMessageDto, userId);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'List all conversations for current user' })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
    type: ConversationsListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  getConversations(
    @Query() query: ConversationsQueryDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiAssistantService.getConversations(query, userId);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation history' })
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    example: 'conv_xyz789',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved successfully',
    type: ConversationDetailDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  getConversation(
    @Param('id') id: string,
    @Query() query: ConversationMessagesQueryDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiAssistantService.getConversation(id, query, userId);
  }

  @Delete('conversations/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete conversation and all its messages' })
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    example: 'conv_xyz789',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation deleted successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  deleteConversation(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.aiAssistantService.deleteConversation(id, userId);
  }

  @Post('actions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute AI suggested action',
    description: 'Execute a suggested action from the AI response.',
  })
  @ApiResponse({
    status: 200,
    description: 'Action executed successfully',
    type: ActionResultDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid action or parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  executeAction(
    @Body() executeActionDto: ExecuteActionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiAssistantService.executeAction(executeActionDto, userId);
  }
}
