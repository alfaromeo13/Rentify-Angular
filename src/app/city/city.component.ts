import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { debounceTime, switchMap } from "rxjs";
import { CityWithCountry } from "../models/city.model";
import { CityService } from "./city.service";

@Component({
    selector:'app-city',
    templateUrl:'./city.conponent.html'
})
export class CityComponent implements OnInit{
    cities: CityWithCountry[] = [];
    citySearchForm: FormGroup;
    
    constructor(
        private cityService: CityService,
        private toastr :ToastrService
    ){}

    ngOnInit(): void {
        this.initializeForm();
        this.citySearchForm.get('searchTerm')?.valueChanges
        .pipe(  //ova prica moze jer je reaktivna forma u pitanju,slusacemo na promjene u odredjenoj kontroli
            debounceTime(300), //svaki put kad se desi neka promjena sacekaj neko vrijeme pa pozovi api 
            switchMap(value=>{ return this.cityService.searchByTerm(value); })
        ).subscribe (data=>{ //podaci koje dobijamo sa strane bekenda
            this.cities=data;
        });
    }

    private initializeForm(): void{
        this.citySearchForm=new FormGroup({
            searchTerm : new FormControl(null)
        });
    }
}