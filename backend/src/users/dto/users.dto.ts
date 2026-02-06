import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

// Request DTOs
export class CreateUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'Jane Smith',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'jane@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Initial password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
    example: 'user',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Account status',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    example: 'active',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Smith',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({
    description: 'User email address',
    example: 'john.smith@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    example: 'admin',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Account status',
    enum: UserStatus,
    example: 'active',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}

export class UpdateUserPasswordDto {
  @ApiProperty({
    description: 'New password (minimum 6 characters)',
    example: 'newpassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class UsersQueryDto {
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
    description: 'Search by name or email',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by role',
    enum: UserRole,
    example: 'user',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: UserStatus,
    example: 'active',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}

// Response DTOs
export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ enum: UserRole, example: 'user' })
  role: UserRole;

  @ApiProperty({ enum: UserStatus, example: 'active' })
  status: UserStatus;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class UsersListResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;
}
