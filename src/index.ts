import 'dotenv/config'
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import UserController from '@/resources/user/user.controller';
import NoteController from '@/resources/note/note.controller';
import ReportController from '@/resources/report/report.controller';
import StatsController from './resources/stats/stats.controller';
validateEnv();
const app = new App([ new UserController(), new NoteController(), new ReportController(),new StatsController()],Number(process.env.PORT));
app.listen();