import { Component, OnInit } from '@angular/core';
import { CoreSocketService } from './core/core-socket.service';
import { GlobalSocketService } from './core/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private coreSocketService: CoreSocketService, private globalSocketService: GlobalSocketService) { }
  
  ngOnInit(): void {
    this.coreSocketService.initConnection();
    
    // obavezan subscribe na onInit => IPAK NA LOGIN!!!
    this.globalSocketService.subscribeToConversation("/topic/notifications", (data: any) => {
      console.log(data); // vraca se kompletan conversation objekat
      // TODO: logika...
    });
  }

  isActive:boolean=false;
  showParagraph :boolean=false;
  title: string = 'rentify-frontend';

  handleClick():void {
    this.isActive=!this.isActive;
    this.showParagraph=!this.showParagraph;
    console.log('Clicked!');
  }


}