import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateUUID } from '../middlewares/validateUUID';

const router = Router();
const userController = new UserController();

// GET /users - Get all users with pagination
router.get('/', userController.getAllUsers);

// GET /users/:id - Get user by ID
router.get('/:id', validateUUID, userController.getUserById);

// POST /users - Create new user
router.post('/', userController.createUser);

// PUT /users/:id - Update user
router.put('/:id', validateUUID, userController.updateUser);

// DELETE /users/:id - Delete user
router.delete('/:id', validateUUID, userController.deleteUser);

// GET /users/:id/posts - Get user's posts
router.get('/:id/posts', validateUUID, userController.getUserPosts);

export default router;