export class AccountCreate {
  name: string;
  email: string;
  accessCode: string;

  public constructor(name: string, email: string, accessCode: string){
    this.name = name;
    this.email = email;
    this.accessCode = accessCode;
  }

}

export class Account {
  admin: Admin;
  maxPoints: number;
  kids: Kid[];

}

export class Admin {
  name: string;
  passcode: string;

  // toJSON() {
  //   const { passcode, ...withoutPasscode } = this;
  //   return withoutPasscode;
  // }
}

export class Kid {
   name: string;
   points: number;
   maxPoints: Number;
   goals: Goal[];

  public constructor(name: string, points: number){
    this.name = name;
    this.points = points;
    this.goals = [];
  }
}

export class Goal {
  name: string;
  targetPoints: number;

  public constructor(name: string, targetPoints: number){
    this.name = name; this.targetPoints = targetPoints;
  }
}