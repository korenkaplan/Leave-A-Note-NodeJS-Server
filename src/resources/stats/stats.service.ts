import { log } from "console";
import userModel from "../user/user.model";
import { RegisteredUsersPerMonthAmount, CounterMonthsDictionary} from "./stats.interface";
import IUser from "../user/user.interface";
import { FilterQuery } from "mongoose";
class StatsService {
// amount of user registered , timeline
public  RegisteredUsersPerMonth = async (year: number):Promise<[boolean,RegisteredUsersPerMonthAmount[]]> =>{
    const sortedUsers = await this.sortUsersCollection({createdAt:1},year);
    const amountOfUsersRegisteredPerMonth: CounterMonthsDictionary = this.InitUsersPerMonthDict(sortedUsers);
    const finalArrayOfData: RegisteredUsersPerMonthAmount[] = this.initFinalArrayRegisteredUsersPerMonth(amountOfUsersRegisteredPerMonth);
    finalArrayOfData[6].label = 'Register form update';
   return [true,finalArrayOfData]
}
//sort the users collection by any query
public sortUsersCollection = async (query: FilterQuery<IUser>,year: number):Promise<IUser[]> => {
    console.log(year);
    
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${year}-12-31`);
    
    const users = await userModel.find({
      $expr: {
        $and: [
          { $gte: ["$createdAt", startOfYear] },
          { $lt: ["$createdAt", endOfYear] }
        ]
      }
    }).sort(query).exec();
    return users;
    
 }
 // get a sorted users list by date and create the month dictionary of type
private InitUsersPerMonthDict(sortedUsers: IUser[]):CounterMonthsDictionary {
    const amountOfUsersRegisteredPerMonth: CounterMonthsDictionary = {
        Jan: 0,
        Feb: 0,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0,
    };
    sortedUsers.forEach(user => {
        const monthName = user.createdAt.toLocaleString('default', { month: 'short' });
        amountOfUsersRegisteredPerMonth[monthName] += 1;
    });
    return amountOfUsersRegisteredPerMonth;
}
 // convert the month dictionary the array to fit the Client side data structure requirement. 
private initFinalArrayRegisteredUsersPerMonth(amountOfUsersRegisteredPerMonth: CounterMonthsDictionary):RegisteredUsersPerMonthAmount[] {
        const data: RegisteredUsersPerMonthAmount[] = [];
        for (const key in amountOfUsersRegisteredPerMonth) {
            const month: RegisteredUsersPerMonthAmount = { month: key, users: amountOfUsersRegisteredPerMonth[key] } as RegisteredUsersPerMonthAmount;
            data.push(month);
        }
        return data;
}






// Distribution of Reports and notes by year and Month

// show the relationship between amount of user to the distribution of reports and notes

//returns the ratio between anonymous reports vs  not anonymous reports
}

export default StatsService;
