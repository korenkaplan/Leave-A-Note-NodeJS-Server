 interface IHttpResponse<T> {
success:boolean;
data?:T;
message:string;
error?:string;
}
export default IHttpResponse