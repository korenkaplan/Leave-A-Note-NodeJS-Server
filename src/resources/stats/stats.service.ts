import { log } from "console";
import userModel from "../user/user.model";
import unMatchedReportsModel from "../unMatchedReports/unMatchedReports.model";
import { RegisteredUsersPerMonthAmount, CounterMonthsDictionary,DistributionOfReports} from "./stats.interface";
import IUser from "../user/user.interface";
import { FilterQuery } from "mongoose";
class StatsService {
// #region Register per month each year + sub functions
// amount of user registered , timeline
public  RegisteredUsersPerMonth = async (year: number):Promise<[boolean,RegisteredUsersPerMonthAmount[]]> =>{
    const users = await userModel.find();
    const amountOfUsersRegisteredPerMonth: CounterMonthsDictionary = this.InitUsersPerMonthDict(users);
    const finalArrayOfData: RegisteredUsersPerMonthAmount[] = this.initFinalArrayRegisteredUsersPerMonth(amountOfUsersRegisteredPerMonth);
   return [true,finalArrayOfData]
}
 // get a sorted users list by date and create the month dictionary of type
private InitUsersPerMonthDict(users: IUser[]):CounterMonthsDictionary {
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
    users.forEach(user => {
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
// #endregion

// #region Distribution of Reports and notes by year and Month
 public reportsAndNotesDistribution = async():Promise<DistributionOfReports[]> => {
    const notesAmount = await userModel.aggregate([
      { $unwind: "$accidents" },
      { $match: { "accidents.type": "note" } },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);
    const reportsAmount = await userModel.aggregate([
      { $unwind: "$accidents" },
      { $match: { "accidents.type": "report" } },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);
    const unMatchedReportsAmount = await unMatchedReportsModel.aggregate([
      {$match:{"accidentReference":{$exists:false}}},
      { $group: { _id: null, count: { $sum: 1 } } },
    ])
    const notes: DistributionOfReports = {'category': 'Notes',count:notesAmount.length > 0 ?notesAmount[0].count: 0}
    const reports: DistributionOfReports = {'category': 'Reports',count: reportsAmount.length > 0 ?reportsAmount[0].count: 0}
    const unMatchedReports: DistributionOfReports = {'category': 'Unmatched \n Reports',count:unMatchedReportsAmount.length > 0 ? unMatchedReportsAmount[0].count: 0}
    return [notes,reports,unMatchedReports]
 
};


// #endregion
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







// show the relationship between amount of user to the distribution of reports and notes

//returns the ratio between anonymous reports vs  not anonymous reports
}

export default StatsService;
