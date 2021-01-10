import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

const API_ROOT = "http://localhost:3000";

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor(private http: HttpClient) { }

    sendMessage(receiverId, body, files) {
        let form = new FormData();
        if (files && files.length) {
            for (let file of files) {
                form.append('files', file, file.name);
            }
        }
        form.append('body', body);
        form.append('created', new Date().toString());
        return this.http.post(`${API_ROOT}/messages/${receiverId}`, form);
    }

    sendLocation(userId, latitude, longitude) {
        let body = {
            latitude: latitude,
            longitude: longitude,
            message: {
                body: 'This is my location',
                created: Date.now()
            }
        };
        return this.http.post(`${API_ROOT}/attachments/upload-location/${userId}`, body);
    }

    getAttachment(attachmentId) {
        return this.http.get(`${API_ROOT}/attachments/${attachmentId}`, {responseType: 'blob'});
    }

    async getMessage(messageId) {
        return new Promise<any>((resolve, reject) => {
            this.http.get(`${API_ROOT}/messages/byMessageId/${messageId}`)
            .subscribe(
                (res) => resolve(res),
                (err) => reject(err)
            );
        });
    }

    async getMessages(messageIds) {
        return new Promise<any>((resolve, reject) => {
            this.http.get(`${API_ROOT}/messages/getAll/${messageIds.toString()}`)
            .subscribe(
                (res) => resolve(res),
                (err) => reject(err)
            );
        });
    }

}