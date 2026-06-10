import { opendir } from 'fs/promises';
import * as bcrypt from 'bcryptjs';
import fs from 'fs'
import { Account, Kid, Admin, AccountCreate } from '../entities/Account';
import { stringify } from 'querystring';

export class AccountService {

  constructor() {
  }

  findById(id: string): Account | null {
    // find a directory matching the id
    let path = './accounts/' + id;

    console.log(path);
    
    try {
        const data = fs.readFileSync(path + '/data.json', 'utf8');
        console.log(data);
        return JSON.parse(data);
    } catch (err) {
    console.error(err);
    }

    return null;

  }

  getAccountNumber() {
    let length = 8;
    // let combined =  name + email;

    // let seed = combined.split('').reduce((accumulator, char, ) => {
    //     return char.charCodeAt(0) + accumulator;
    // }, 0);

    let charSet = ['0','1','2','3','4','5','6','7','8','9',
      'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
    ]
    let poolLength = charSet.length;
    let code: string = "";
    for(let lcv = 0; lcv < length; ++lcv){
      let rand = Math.floor(Math.random() * (poolLength - 1));
      code += charSet[rand];
    }

    return code;
  }

  createAccount(accountData: AccountCreate): Account | null {
    try {
        // generate meaningfull ID from name / email ?
        let accountNumber = this.getAccountNumber().toString();

        // see if that account is in use
        let data = this.findById(accountNumber);
        if (data != null){
            throw new Error("Account with those credentials already exists");
        }

        // otherwise, create a new account
        let admin = new Admin();
        admin.name = accountData.name;
        admin.passcode = accountData.accessCode;

        let account = new Account();
        account.accountKey = accountNumber;
        account.admin = admin;
        account.maxPoints = 10;
        account.kids = [];

        // create the directory and file 
        let path1 = './accounts/' + accountNumber;
        let path2 = path1 + '/data.json';
        if (!fs.existsSync(path1)){
            fs.mkdirSync(path1);
        }
        const fd = fs.openSync(path2, 'wx'); fs.closeSync(fd);
        fs.writeFileSync(path2, JSON.stringify(account, null, 2), 'utf8');
        return account;
    }
    catch (err) {
    console.error(err);
    }
    return null;
  }

  updateAccountById(id: string, accountData: Account): Account | null {
    try {
        let data = this.findById(id);
        if (data != null){
            data.maxPoints = accountData.maxPoints;
            data.kids = accountData.kids;
            let path = './accounts/' + id + '/data.json';
            fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');

            return data;
        }
    }
    catch (err) {
    console.error(err);
    }
    return null;
  }

  updateKidsById(id: string, kidData: Kid[]): Account | null {
    try {
        let data = this.findById(id);
        if (data != null){
            data.kids = kidData;
            let path = './accounts/' + id + '/data.json';
            fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');

            return data;
        }
    }
    catch (err) {
    console.error(err);
    }
    return null;
  }
}