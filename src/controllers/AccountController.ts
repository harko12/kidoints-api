import { Request, Response } from 'express';
import { AccountService } from '../services/AccountService';
import { Account, Kid, Admin, AccountCreate } from '../entities/Account';
import { MailService } from '../services/MailService';

export class AccountController {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  test = async (req: Request, res: Response): Promise<void> => {
    try {
        let name = "Charlie";
        let email = "charlie.pauch@gmail.com";
        let hash = this.accountService.getAccountNumber(name, email).toString();
        let data = {hash: hash};

        let ac = new AccountCreate(name, email, "MYCODE");

        this.accountService.createAccount(ac);


      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Account data not found',
        });
        return;
      }

      res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.error('Error fetching account data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };


  // GET /users/:id
  getAccountById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data = this.accountService.findById(id);

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Account data not found',
        });
        return;
      }

      res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.error('Error fetching account data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };

  createAccount = async(req: Request, res: Response): Promise<void> => {
    try {
      const accountData = new AccountCreate(req.body.accountData.name, req.body.accountData.email, req.body.accountData.accessCode);

      // accountData should be {name, email, accessCode}

      const data = this.accountService.createAccount(accountData);

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Account data not found',
        });
        return;
      }

      res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.error('Error creating account:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }

  };


  updateAccountKidsDataById = async(req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { kidData } = req.body;

      const data = this.accountService.updateKidsById(id, kidData);

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Account data not found',
        });
        return;
      }

      res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.error('Error fetching account data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }

  };
}