import UnMatchedReportsModel from '@/resources/unMatchedReports/unMatchedReports.model';
import IUnMatchedReports from './unMatchedReports.interface';
import HttpException from '@/utils/exceptions/http.exception';
import { IAccident } from '@/resources/accident/accident.interface';
class UnMatchedReportsService {
    private unMatchedReports = UnMatchedReportsModel;

    public async addUnmatchedReport(accident: IAccident, damagedCarNumber: string): Promise<void> {
    try {
        await this.unMatchedReports.create({accident,damagedCarNumber});
    } catch (error: any) {
        throw new HttpException(400, error.message)
    }

    };
}

export default UnMatchedReportsService;
