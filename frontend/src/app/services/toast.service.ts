import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private subject = new Subject<{message: string, isError: boolean}>();
  toast$ = this.subject.asObservable();

  show(message: string, isError = false) {
    this.subject.next({ message, isError });
  }
}
