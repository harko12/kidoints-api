import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { CreateUserDto, UpdateUserDto } from '../dto/UserDto';
import * as bcrypt from 'bcryptjs';

export class UserService {
  private userRepository: Repository<User>;
  private postRepository: Repository<Post>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.postRepository = AppDataSource.getRepository(Post);
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as User;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      return null;
    }

    const updateData = { ...updateUserDto };
    
    // Hash password if provided
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateData);
    
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    
    if (updatedUser) {
      const { password: _, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword as User;
    }
    
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected !== 0;
  }

  async findUserPosts(userId: string): Promise<Post[]> {
    return await this.postRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}