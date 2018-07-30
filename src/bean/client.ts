export class Client {
  constructor(
    public signId:string,
    public clientSeconds: number,
    public start: number,
    public status:number,
    public signString:string,
    public ops:string
  ) {  }
}
