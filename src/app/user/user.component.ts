import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { User } from "./user.model";
import { UserService } from "./user.service";

@Component({
    selector: 'app-user',
    styleUrls: ['./user.component.css'],
    templateUrl: './user.component.html',
  })
  export class UserComponent implements OnInit {
      
      users: User[]=[];

      constructor(private userService: UserService){}

      ngOnInit(): void {
            this.getAll();
      }

      getAll():void{
            this.userService.getAll().subscribe(data=>{
                  this.users=data;
            },error =>{
                  console.log('Error occurred.',error);     
            })
      }

      deleteUser(id: number):void{  
            this.userService.deleteById(id).subscribe(data=>{
                  this.getAll();
            },error=>{
                  console.log('Error occured.',error)
            });
      } 

      activateUser(id: number):void{  
            this.userService.activateById(id).subscribe(data=>{
                  this.getAll();
            },error=>{
                  console.log('Error occured.',error)
            });
      }
}