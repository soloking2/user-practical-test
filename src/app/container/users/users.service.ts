import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { catchError, filter, finalize, map, retry, shareReplay, switchMap, tap } from 'rxjs/operators';
import { User, UserData, UserLocation, UserResponseData } from 'src/app/models/user';
import { MessagesService } from 'src/app/shared/messages.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = environment.baseUrl;
  private username = environment.USERNAME;

  private cordinatesSub = new BehaviorSubject({});
  getCoordinates = this.cordinatesSub.asObservable();

  private refreshSub = new BehaviorSubject<boolean>(false);
  refreshAction = this.refreshSub.asObservable();

  private pageSub = new BehaviorSubject<number>(1);
  getPage = this.pageSub.asObservable();

  private addSub = new Subject<UserData>();
  addAction = this.addSub.asObservable();

  private getByIdSub = new BehaviorSubject<{ id: number }>(
    {} as { id: number }
  );
  getByIdAction = this.getByIdSub.asObservable();

  private editSub = new BehaviorSubject<UserData>({} as UserData);
  editAction = this.editSub.asObservable();

  loading = new BehaviorSubject<boolean>(false);

  add$ = this.addAction.pipe(
    filter((data) => Boolean(data?.name)),
    switchMap((data) =>
      this.http.post(`${this.baseUrl}api/users`, data).pipe(
        tap(() => this.refresh()),
        map((data: UserData) => data),
        catchError((err) => EMPTY),
        finalize(() => {
          this.loading.next(false);
        })
      )
    )
  );
  getValue$ = this.getByIdAction.pipe(
    filter((data) => Boolean(data?.id)),
    switchMap((data) =>
      this.http
        .get<{ data: User }>(`${this.baseUrl}api/users/${data.id}`)
        .pipe(
          map((res) => res),
          shareReplay(1),
          catchError((err) => EMPTY),
          finalize(() => {
            this.getByIdSub.next(null);
          })
        )
    )
  );

  edit$ = this.editAction.pipe(
    filter((data) => Boolean(data?.name) && Boolean(data?.id)),
    switchMap((data) =>
      this.http.put<UserData>(`${this.baseUrl}api/users/${data.id}`, data).pipe(
        tap(() => this.refresh()),
        map((res) => res),
        catchError((err) => EMPTY),
        finalize(() => {
          this.loading.next(false);
          this.editSub.next({} as UserData);
        })
      )
    )
  );
  delete$ = this.getByIdAction.pipe(
    filter((data) => Boolean(data?.id)),
    switchMap((data) =>
      this.http.delete<UserData>(`${this.baseUrl}api/users/${data.id}`).pipe(
        tap(() => {
          this.alert.setMessage({
            type: 'Success',
            title: 'Success Report',
            body: 'Data deleted successfully',
          });
        }),
        catchError((err) => EMPTY),
        finalize(() => {
          this.editSub.next({} as UserData);
        })
      )
    )
  );

  constructor(private http: HttpClient, private alert: MessagesService) {}

  setPage(page: number) {
    this.pageSub.next(page);
  }

  setCoordinates(lat: number, lng: number) {
    this.cordinatesSub.next({lat, lng});
  }

  getUsers(page: number): Observable<UserResponseData> {
    return this.http
      .get<UserResponseData>(`${this.baseUrl}api/users?page=${page}`)
      .pipe(
        map((res) => res),
        retry(1),
        shareReplay(1),
        catchError((err) => EMPTY)
      );
  }

  add(data: UserData) {
    this.addSub.next(data);
    this.loading.next(true);
  }

  getValue(id: number) {
    this.getByIdSub.next({ id });
  }

  initiateEdit(data: UserData) {
    this.editSub.next(data);
    this.loading.next(true);
  }
  initiateDelete(id: number) {
    this.getByIdSub.next({ id });
  }

  getUserCountry(lat: number, lng: number) {
    const url = `http://api.geonames.org/countryCodeJSON?lat=${lat}&lng=${lng}&username=${this.username}`;
    return this.http.get<UserLocation>(url).pipe(
      shareReplay(1),
      catchError(err => EMPTY)
    )
  }

  refresh() {
    this.refreshSub.next(true);
  }
}
