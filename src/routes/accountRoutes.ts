import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateUUID } from '../middlewares/validateUUID';
import { AccountController } from '../controllers/AccountController';

const router = Router();
const accountContoller = new AccountController();

router.get('/test', accountContoller.test);

// GET /accounts/:id - Get account by ID
router.get('/:id', validateUUID, accountContoller.getAccountById);

// POST /accounts - Create new account
router.post('/', accountContoller.createAccount);

// PUT /accounts/kids/:id - Update kids data for account
router.put('/kids/:id', validateUUID, accountContoller.updateAccountKidsDataById);

// DELETE /users/:id - Delete user
// router.delete('/:id', validateUUID, userController.deleteUser);

export default router;