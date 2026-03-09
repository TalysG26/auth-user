import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto } from './dtos/auth';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

 
  async signUp(data: SignUpDto) {

    const userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userAlreadyExists) {
      throw new UnauthorizedException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async signIn(data: SignInDto) {

    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return {
      accessToken,
    };
  }

  
  async delete(id: number) {

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: "User deleted successfully",
    };
  }
}