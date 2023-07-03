import UnMatchedReportsModel from '@/resources/unMatchedReports/unMatchedReports.model';
import IUnMatchedReports from './unMatchedReports.interface';
import HttpException from '@/utils/exceptions/http.exception';
import { IAccident } from '@/resources/accident/accident.interface';
import NoteService from '../note/note.service';
class UnMatchedReportsService {
     unMatchedReports = UnMatchedReportsModel;
    noteService = new NoteService();
    public async addUnmatchedReport(accident: IAccident, damagedCarNumber: string): Promise<void> {
        await this.unMatchedReports.create({accident,damagedCarNumber});
    };
}

export default UnMatchedReportsService;
