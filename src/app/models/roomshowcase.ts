export class RoomShowcaseModel {

    public pid: number;
    public liked: boolean;
    public loc: string = "";
    public desc: string = "";
    public title: string = "";
    public property: string = "";
    public price: number = 0.1;
    public period: string = "";
    public rating: number = 0.1;
    public imgLinks: string[] = [];
    public imagePreviews: any[] = [];

    constructor(pid: number, property: string, tit: string, des: string,
        loc: string, pri: number, period: string, rat: number,liked : boolean) {
        this.pid = pid;
        this.property = property;
        this.title = tit;
        this.desc = des;
        this.loc = loc;
        this.price = pri;
        this.period = period;
        this.rating = rat;
        this.liked=liked;
    }
}