import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

const API_ROOT = "http://localhost:3000";

@Injectable({
    providedIn: 'root'
})
export class ChatroomService {

    constructor(private http: HttpClient) { }

    findAllFromMe() {
        return this.http.get(`${API_ROOT}/chatrooms/self`);
    }

    dropDatabases() {
        return this.http.delete(`${API_ROOT}/chatrooms`);
    }

}