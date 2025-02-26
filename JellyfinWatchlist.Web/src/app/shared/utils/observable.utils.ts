import { Observable, asyncScheduler, scheduled } from 'rxjs';

export function toObservable<T>(promise: Promise<T>): Observable<T> {
  return scheduled(promise, asyncScheduler);
}
