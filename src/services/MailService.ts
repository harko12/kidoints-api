import { Admin } from "@/entities/Account";

export class MailService {

    private nodemailer = require('nodemailer');
    private transporter;
    
  constructor() {
    this.transporter = this.nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
  }

//   public sendConfirmationEmail(email: string, accountNumber: string, adminInfo: Admin ){
//     let mailOptions = {
//         from: 'charlie.pauch+kidpoints@gmail.com',
//         to: email,
//         subject: 'Your KidPoints account information',
//         text: `
//         <p>Thank you for creating a KidPoints account.  We hope it helps you teach your kids the value of hard work!</p>
//         <p>Here is your info:
//         <ul>
//             <li>Account #: ${accountNumber}</li>
//             <li>Admin access code: ${adminInfo.passcode}
//         </ul>
//         </p>
//         <p>Enjoy!</p>
//         `
//     };

//     this.transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }        
//     })
//   }

  
}