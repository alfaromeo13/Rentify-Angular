import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { FilterService } from "../filter/filter.service";
import { ApartmentDTO } from "../models/apartment.model";
import { ImageDTO } from "../models/image.model";
import { RoomShowcaseModel } from "../models/roomshowcase";
import { ApartmentSearch } from "../models/search.model";

@Injectable({ providedIn: 'root' })
export class ApartmentService {
  isFilterVisible: boolean = true;
  selectedApartmentId: number;
  apartmentList: ApartmentDTO[] = [];
  apartmani: RoomShowcaseModel[] = [];

  constructor(
    private httpClient: HttpClient,
    public filterService: FilterService
  ) { }

  public generateRooms() {
    var rez = [];
    for (let apartment of this.apartmentList) {
      var soba = new RoomShowcaseModel(apartment.id, apartment.propertyType.name.toLowerCase(),
        apartment.title, apartment.description, apartment.address.street + ' , ' + apartment.address.neighborhood.name,
        apartment.price, apartment.period.name, apartment.grade, apartment.liked);
      apartment.images.forEach((image: ImageDTO) => {
        soba.imgLinks.push(image.path);
      });
      rez.push(soba);
    }
    this.apartmani = rez;
  }

  setSelected(pid: number) {
    this.selectedApartmentId = pid;
    localStorage.setItem('selectedApartmentId', pid + "");
  }

  allFavorite(): void {
    this.getFavoriteIds(this.filterService.pageNo - 1).subscribe(
      (apartmentIds: number[]) => { //we get favourite ids
        const apartmentSearch: ApartmentSearch = {
          id: apartmentIds,
          isActive: true,
        };//we getthose liked apartments with help of search specification
        this.filterService.filter(apartmentSearch, this.filterService.pageNo - 1).subscribe(
          (apartmentDTOs: ApartmentDTO[]) => {
            this.apartmentList = apartmentDTOs;
            this.generateRooms();
          }, (error) => {
            console.error(error);
          }
        );
      }, (error) => {
        console.error(error);
      }
    );
  }

  getFavoriteIds(pageNumber: number): Observable<number[]> {
    const url = `${environment.apiUrl}user/favourite-apartment?page=${pageNumber}&size=9`;
    return this.httpClient.get<number[]>(url);
  }

  deleteFavorite(id: number): Observable<any> {
    const url = `${environment.apiUrl}user/favourite-apartment/${id}`;
    return this.httpClient.delete(url);
  }

  addFavorite(id: number): Observable<any> {
    const url = `${environment.apiUrl}user/favourite-apartment/${id}`;
    return this.httpClient.post(url, null);
  }

  createApartment(formData: FormData): Observable<any> {
    const url = `${environment.apiUrl}apartment/`;
    const headers = new HttpHeaders();
    return this.httpClient.post(url, formData, { headers });
  }
}