import UnMatchedReportsModel from '@/resources/unMatchedReports/unMatchedReports.model';
import IUnMatchedReports from './unMatchedReports.interface';
import HttpException from '@/utils/exceptions/http.exception';
import { IAccident } from '@/resources/accident/accident.interface';
class UnMatchedReportsService {
    private unMatchedReports = UnMatchedReportsModel;

    public async addUnmatchedReport(accident: IAccident, damagedCarNumber: string): Promise<void> {
        await this.unMatchedReports.create({accident,damagedCarNumber});
    };
}

export default UnMatchedReportsService;
