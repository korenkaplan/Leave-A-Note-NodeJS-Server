 interface IHttpResponse<T> {
success:boolean;
data?:T;
message:string;
error?:string;
tokenError?:boolean;
}
export default IHttpResponse