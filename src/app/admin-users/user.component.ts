import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { debounceTime, switchMap } from "rxjs";
import { MessageService } from "../messages/message.service";
import { CreateConversationDTO } from "../models/create-conversation.model";
import { UserDTO } from "../models/user.model";
import { UserService } from "./user.service";

@Component({
      selector: 'app-user',
      styleUrls: ['./user.component.css'],
      templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {

      users: UserDTO[] = [];
      userSearchForm: FormGroup;

      constructor(
            private router: Router,
            private userService: UserService,
            private messageService: MessageService) { }

      ngOnInit(): void {
            this.getAll();
            this.initializeForm();
            this.userSearchForm.get('searchTerm')?.valueChanges
                  .pipe(
                        debounceTime(300),
                        switchMap(value => {
                              if (value.length == 0)
                                    return this.userService.getAll();
                              return this.userService.findByUsername(value);
                        })
                  ).subscribe(data => { //podaci koje dobijamo sa strane bekenda
                        this.users = data;
                  });
      }

      private initializeForm(): void {
            this.userSearchForm = new FormGroup({
                  searchTerm: new FormControl(null)
            });
      }

      getAll(): void {
            this.userService.getAll().subscribe(data => {
                  this.users = data;
            }, error => {
                  console.log('Error occurred.', error);
            })
      }

      deleteUser(user: UserDTO): void {
            this.userService.deleteById(user.id).subscribe(data => {
                  user.isActive = false;
            }, error => {
                  console.log('Error occured.', error)
            });
      }

      activateUser(user: UserDTO): void {
            this.userService.activateById(user.id).subscribe(data => {
                  user.isActive = true;
            }, error => {
                  console.log('Error occured.', error)
            });
      }

      // pozivas klikom na odredjeno dugme (nova konverzacija)
      openNewConversation(toUsername: string) {
            const conversation: CreateConversationDTO = {
                  usernameFrom: 'johndoe',
                  usernameTo: toUsername,
            };
            this.messageService.createNewConversation(conversation).subscribe((data: any) => {
                  this.messageService.selectedConversationId = data.conversationId;
                  this.router.navigate(['messages']);
            }, error => {
                  console.log(error);
            });
      }
}