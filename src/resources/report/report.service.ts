import ReportModel from '@/resources/report/report.model';
import IUser from '@/resources/user/user.interface';
import UserService from '@/resources/user/user.service';
import NoteService from '@/resources/note/note.service';
import HttpException from '@/utils/exceptions/http.exception';
import { IAccident } from '@/resources/accident/accident.interface';
import UnMatchedReportsService from '@/resources/unMatchedReports/unMatchedReports.service';
import { Types } from 'mongoose';
import { log } from 'console';
class ReportService {
     ReportModel = ReportModel;
     NoteService = new NoteService();
     UserService = new UserService()
     UnMatchedReportsService = new UnMatchedReportsService();

    public async addReport(damagedCarNumber: string, hittingCarNumber: string, isAnonymous: boolean, reporter: { name: string; phoneNumber: string }, imageUrl: string): Promise<string> {
            const hittingUser: IUser | null = await this.UserService.GetUserQuery({ carNumber: hittingCarNumber });
            const damagedUser: IUser | null = await this.UserService.GetUserQuery({ carNumber: damagedCarNumber });
            if (hittingUser && damagedUser) {
               await this.handleBothDriversFound(hittingUser, damagedUser, isAnonymous, reporter, imageUrl);
            } else if (!hittingUser && damagedUser) {
               await this.handleHittingDriverNotFound(damagedUser, hittingCarNumber, isAnonymous, reporter, imageUrl);
            } else if (hittingUser && !damagedUser) {
               await this.handleDamagedDriverNotFound(hittingUser, damagedCarNumber, isAnonymous, reporter, imageUrl);
            } else {
               await this.handleBothDriversNotFound(damagedCarNumber, hittingCarNumber, isAnonymous, reporter, imageUrl);
            }
            return `Report has been added to ${damagedUser  === null? " unmatched reports collection": damagedUser.name}`;
    }
     async addToUnmatchedReportsCollection(accident: IAccident, damagedCarNumber: string): Promise<void> {
        //save the accident and the car number every sign up compare the car number to the reports on the list.
            await this.UnMatchedReportsService.addUnmatchedReport(accident, damagedCarNumber);
    };
     async handleBothDriversFound(hittingUser: IUser,damagedUser: IUser,isAnonymous: boolean,reporter: { name: string; phoneNumber: string },imageUrl: string    ): Promise<void> {
        const accidentData: IAccident = {
            hittingDriver: {
                name: hittingUser.name,
                carNumber: hittingUser.carNumber,
                phoneNumber: hittingUser.phoneNumber,
            },
            //date: Date.now,
            imageSource: imageUrl,
            type: 'report',
            isAnonymous: isAnonymous,
            isIdentify: true,
            reporter: {
                name: reporter.name,
                phoneNumber: reporter.phoneNumber,
            },
            isDeleted:false,
        };
         await this.UserService.addMessageToUser(accidentData, damagedUser);
    }
     async handleHittingDriverNotFound(
        damagedUser: IUser,   hittingCarNumber: string, isAnonymous: boolean, reporter: { name: string; phoneNumber: string },imageUrl: string): Promise<void> {
            const accidentData: IAccident = {
            hittingDriver: {
                carNumber: hittingCarNumber,
            },
            //date: this.NoteService.formatDate(),
            imageSource: imageUrl,
            type: 'report',
            isAnonymous: isAnonymous,
            isIdentify: false,
            reporter: {
                name: reporter.name,
                phoneNumber: reporter.phoneNumber,
            },
            isDeleted:false,

        };
         await this.UserService.addMessageToUser(accidentData, damagedUser);
    }
     async handleDamagedDriverNotFound(
        hittingUser: IUser,damagedCarNumber: string, isAnonymous: boolean, reporter: { name: string; phoneNumber: string }, imageUrl: string  ): Promise<void> {
            const accidentData: IAccident = {
            hittingDriver: {
                name: hittingUser.name,
                carNumber: hittingUser.carNumber,
                phoneNumber: hittingUser.phoneNumber,
            },
            //date: this.NoteService.formatDate(),
            imageSource: imageUrl,
            type: 'report',
            isAnonymous: isAnonymous,
            isIdentify: true,
            reporter: {
                name: reporter.name,
                phoneNumber: reporter.phoneNumber,
            },
            isDeleted:false,
        };
         await this.addToUnmatchedReportsCollection(accidentData, damagedCarNumber);
    }
     async handleBothDriversNotFound(
        damagedCarNumber: string, hittingCarNumber: string,  isAnonymous: boolean, reporter: { name: string; phoneNumber: string }, imageUrl: string): Promise<void> {
        const accidentData: IAccident = {
            hittingDriver: {
                carNumber: hittingCarNumber,
            },
            //date: this.NoteService.formatDate(),
            imageSource: imageUrl,
            type: 'report',
            isAnonymous: isAnonymous,
            isIdentify: false,
            reporter: {
                name: reporter.name,
                phoneNumber: reporter.phoneNumber,
            },
            isDeleted:false,
        };
        await this.addToUnmatchedReportsCollection(accidentData, damagedCarNumber);
    }
}

export default ReportService;
