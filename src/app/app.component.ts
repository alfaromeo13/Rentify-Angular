import { Component, OnInit } from '@angular/core';
import { ToastRef } from 'ngx-toastr';
import { CoreSocketService } from './core/core-socket.service';
import { GlobalSocketService } from './core/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit(): void { }

  isActive: boolean = false;
  showParagraph: boolean = false;
  title: string = 'rentify-frontend';

  handleClick(): void {
    this.isActive = !this.isActive;
    this.showParagraph = !this.showParagraph;
    console.log('Clicked!');
  }
}