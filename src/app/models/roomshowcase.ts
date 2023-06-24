export class RoomShowcaseModel{

    public liked !: boolean;
    public pid: string = "";
    public title : string = "";
    public desc : string = "";
    public imgLinks : string[] = [];
    public loc : string = "";
    public price : number = 0.1;
    public rating : number = 0.1;

    constructor(pid: string,tit:string, des:string,img:string[],loc:string,pri:number, rat:number){
        this.pid = pid;
        this.title = tit;
        this.desc = des;
        this.imgLinks = img;
        this.loc = loc;
        this.price = pri;
        this.rating = rat;
    }

  
}