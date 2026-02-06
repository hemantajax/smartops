import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
  OrdersQueryDto,
  OrderStatus,
} from './dto/orders.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${year}-${random}`;
  }

  async findAll(query: OrdersQueryDto, userId: string, userRole: string) {
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Users can only see their own orders, admins see all
    if (userRole !== 'admin') {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          items: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string, userRole: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check access: users can only view their own orders
    if (userRole !== 'admin' && order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress,
      items,
      notes,
    } = createOrderDto;

    // Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.09; // 9% tax
    const shipping = 5.0;
    const total = subtotal + tax + shipping;

    const order = await this.prisma.order.create({
      data: {
        id: `ord_${uuidv4().replace(/-/g, '').substring(0, 9)}`,
        orderNumber: this.generateOrderNumber(),
        userId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: shippingAddress as any,
        billingAddress: (billingAddress || shippingAddress) as any,
        status: OrderStatus.PENDING,
        subtotal,
        discount: 0,
        tax,
        shipping,
        total,
        notes,
        items: {
          create: items.map((item) => ({
            id: `item_${uuidv4().replace(/-/g, '').substring(0, 3)}`,
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
    };
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userId: string,
    userRole: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check access
    if (userRole !== 'admin' && order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Can only update pending or processing orders
    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.PROCESSING
    ) {
      throw new BadRequestException(
        'Cannot modify completed or cancelled order',
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        customerName: updateOrderDto.customerName,
        customerEmail: updateOrderDto.customerEmail,
        customerPhone: updateOrderDto.customerPhone,
        shippingAddress: updateOrderDto.shippingAddress as any,
        notes: updateOrderDto.notes,
      },
    });

    return {
      id: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      status: updatedOrder.status,
      updatedAt: updatedOrder.updatedAt,
    };
  }

  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[order.status]?.includes(updateStatusDto.status)) {
      throw new BadRequestException(
        `Invalid status transition from ${order.status} to ${updateStatusDto.status}`,
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
      },
    });

    return {
      id: updatedOrder.id,
      status: updatedOrder.status,
      updatedAt: updatedOrder.updatedAt,
    };
  }

  async remove(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be deleted');
    }

    await this.prisma.order.delete({
      where: { id },
    });

    return { message: 'Order deleted successfully' };
  }
}
