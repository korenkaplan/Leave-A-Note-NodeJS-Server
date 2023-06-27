import { Schema } from "mongoose";

interface IToken extends  Object
{
    id:Schema.Types.ObjectId;
    role: string;
    expiresIn: number;
}
export default IToken;