import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const RANDOM_USER_URL: string = "https://randomuser.me/api/?inc=name,email,phone,cell,picture";

@Injectable({
  providedIn: 'root'
})
export class RandomUserService {

  constructor(
    private http: HttpClient) { }

  // Gets data from API
  async getData(): Promise<any> {
    return await this.http.get<any>(RANDOM_USER_URL).toPromise();
  }

  // Gets 'results' array from API data
  async getResults(): Promise<void>{
    const data = await this.getData();
    return await data.results;
  }
}
