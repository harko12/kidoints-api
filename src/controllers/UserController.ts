import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserDto, UpdateUserDto } from '../dto/UserDto';
import { validateCreateUser, validateUpdateUser } from '../validators/userValidator';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GET /users/:id
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };

  // GET /users
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const users = await this.userService.findAll(page, limit);

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };

  // POST /users
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error, value } = validateCreateUser(req.body);
      
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message),
        });
        return;
      }

      const createUserDto: CreateUserDto = value;
      const user = await this.userService.create(createUserDto);

      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully',
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      if (error.code === '23505') { // Unique constraint violation
        res.status(409).json({
          success: false,
          message: 'Email already exists',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };

  // PUT /users/:id
  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { error, value } = validateUpdateUser(req.body);

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message),
        });
        return;
      }

      const updateUserDto: UpdateUserDto = value;
      const user = await this.userService.update(id, updateUserDto);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        data: user,
        message: 'User updated successfully',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };

  // DELETE /users/:id
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.userService.delete(id);

      if (!success) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };

  // GET /users/:id/posts
  getUserPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const posts = await this.userService.findUserPosts(id);

      res.json({
        success: true,
        data: posts,
      });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
}