import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

const API_ROOT = "http://localhost:3000";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

    login(loginBody) {
        return this.http.post(`${API_ROOT}/auth/login`, loginBody);
    }

    register(user) {
        return this.http.post(`${API_ROOT}/auth/register`, user);
    }

    findById(userId) {
        return this.http.get(`${API_ROOT}/users/${userId}`);
    }

    findAll() {
        return this.http.get(`${API_ROOT}/users`);
    }

    create(user: any) {
        return this.http.post(`${API_ROOT}/users`, user);
    }

    update(user: any) {
        return this.http.patch(`${API_ROOT}/users/${user._id}`, user);
    }

    delete(userId: string) {
        return this.http.delete(`${API_ROOT}/users/${userId}`);
    }

}