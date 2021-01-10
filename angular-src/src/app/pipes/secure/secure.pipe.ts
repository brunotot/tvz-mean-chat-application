import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { MessageService } from 'src/app/services/message-service';
import { map } from 'rxjs/operators';

@Pipe({
    name: 'secure'
})
export class SecurePipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer, private messageService: MessageService) { }

    transform(attachmentId): Observable<SafeUrl> {
        return this.messageService.getAttachment(attachmentId).pipe(map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))));
    }

}