import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  ChatMessageDto,
  ExecuteActionDto,
  ConversationsQueryDto,
  ConversationMessagesQueryDto,
} from './dto/ai-assistant.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AiAssistantService {
  constructor(private prisma: PrismaService) {}

  async chat(chatMessageDto: ChatMessageDto, userId: string) {
    const { message, conversationId, context } = chatMessageDto;

    // Get or create conversation
    let conversation: any;
    if (conversationId) {
      conversation = await this.prisma.conversation.findFirst({
        where: { id: conversationId, userId },
      });

      if (!conversation) {
        throw new NotFoundException('Conversation not found');
      }
    } else {
      conversation = await this.prisma.conversation.create({
        data: {
          id: `conv_${uuidv4().replace(/-/g, '').substring(0, 6)}`,
          userId,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        },
      });
    }

    // Store user message
    await this.prisma.message.create({
      data: {
        id: `msg_${uuidv4().replace(/-/g, '').substring(0, 6)}`,
        conversationId: conversation.id,
        role: 'user',
        content: message,
      },
    });

    // Generate AI response (placeholder - integrate with actual AI service)
    const aiResponse = await this.generateAiResponse(message, context, userId);

    // Store AI message
    const aiMessage = await this.prisma.message.create({
      data: {
        id: `msg_${uuidv4().replace(/-/g, '').substring(0, 6)}`,
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse.response,
        data: aiResponse.data as any,
      },
    });

    // Update conversation
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: aiResponse.response.substring(0, 100),
        messageCount: { increment: 2 },
      },
    });

    return {
      id: aiMessage.id,
      conversationId: conversation.id,
      response: aiResponse.response,
      data: aiResponse.data,
      suggestedActions: aiResponse.suggestedActions,
      createdAt: aiMessage.createdAt,
    };
  }

  private async generateAiResponse(
    message: string,
    context: Record<string, any> | undefined,
    userId: string,
  ) {
    // This is a placeholder implementation
    // In production, integrate with OpenAI, Anthropic, or other AI providers

    const lowerMessage = message.toLowerCase();
    let response = '';
    let data: any = null;
    let suggestedActions: any[] = [];

    // Handle common queries
    if (lowerMessage.includes('pending order')) {
      const orders = await this.prisma.order.findMany({
        where: { status: 'pending', userId },
        take: 5,
      });

      const count = orders.length;
      const totalValue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

      response = `I found ${count} pending orders. Total value: $${totalValue.toFixed(2)}. Would you like me to show the details or help process them?`;
      data = {
        type: 'orders_summary',
        orders: orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          total: o.total,
          status: o.status,
        })),
        summary: { count, totalValue },
      };
      suggestedActions = [
        { label: 'View all orders', action: 'navigate', params: { path: '/orders?status=pending' } },
        { label: 'Process orders', action: 'bulk_process', params: { status: 'processing' } },
      ];
    } else if (lowerMessage.includes('revenue') || lowerMessage.includes('sales')) {
      const orders = await this.prisma.order.findMany({
        where: { userId, status: 'delivered' },
      });

      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      response = `Your total revenue from delivered orders is $${totalRevenue.toFixed(2)} across ${orders.length} orders.`;
      data = {
        type: 'revenue_summary',
        summary: { totalRevenue, orderCount: orders.length },
      };
    } else if (lowerMessage.includes('help')) {
      response = `I can help you with:\n\n• **Orders**: "Show pending orders", "What's my revenue?"\n• **Users**: "List admin users" (admin only)\n• **Analytics**: "Show sales trend"\n• **Actions**: "Process order ORD-2024-0001"\n\nWhat would you like to know?`;
      suggestedActions = [
        { label: 'Show pending orders', action: 'query', params: { type: 'pending_orders' } },
        { label: 'View dashboard', action: 'navigate', params: { path: '/dashboard' } },
      ];
    } else {
      response = `I understood your query: "${message}". This is a placeholder response. In production, I would use an AI model to provide a more intelligent response based on your data and context.`;
      suggestedActions = [
        { label: 'Ask another question', action: 'prompt', params: {} },
        { label: 'View help', action: 'help', params: {} },
      ];
    }

    return { response, data, suggestedActions };
  }

  async getConversations(query: ConversationsQueryDto, userId: string) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [conversations, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          lastMessage: true,
          messageCount: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.conversation.count({ where: { userId } }),
    ]);

    return {
      data: conversations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getConversation(
    id: string,
    query: ConversationMessagesQueryDto,
    userId: string,
  ) {
    const { limit = 50, before } = query;

    const conversation = await this.prisma.conversation.findFirst({
      where: { id, userId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const where: any = { conversationId: id };
    if (before) {
      const beforeMessage = await this.prisma.message.findUnique({
        where: { id: before },
      });
      if (beforeMessage) {
        where.createdAt = { lt: beforeMessage.createdAt };
      }
    }

    const messages = await this.prisma.message.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'asc' },
    });

    return {
      id: conversation.id,
      messages,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  async deleteConversation(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, userId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Delete all messages first
    await this.prisma.message.deleteMany({
      where: { conversationId: id },
    });

    // Delete conversation
    await this.prisma.conversation.delete({
      where: { id },
    });

    return { message: 'Conversation deleted successfully' };
  }

  async executeAction(executeActionDto: ExecuteActionDto, userId: string) {
    const { action, params } = executeActionDto;

    // Handle different action types
    switch (action) {
      case 'process_order':
        return this.processOrderAction(params, userId);
      case 'navigate':
        return {
          success: true,
          message: `Navigate to ${params.path}`,
          result: { action: 'redirect', path: params.path },
        };
      case 'bulk_process':
        return this.bulkProcessAction(params, userId);
      default:
        throw new BadRequestException(`Unknown action: ${action}`);
    }
  }

  private async processOrderAction(params: any, userId: string) {
    const { orderId, newStatus } = params;

    const order = await this.prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const previousStatus = order.status;

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    return {
      success: true,
      message: `Order ${order.orderNumber} has been updated to ${newStatus} status`,
      result: { orderId, previousStatus, newStatus },
    };
  }

  private async bulkProcessAction(params: any, userId: string) {
    const { status } = params;

    const result = await this.prisma.order.updateMany({
      where: { userId, status: 'pending' },
      data: { status },
    });

    return {
      success: true,
      message: `${result.count} orders have been updated to ${status} status`,
      result: { updatedCount: result.count, newStatus: status },
    };
  }
}
