import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Observable } from 'rxjs';
import { mergeMapTo } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
  <button (click)="requestPermission()">
    Подписаться на уведомления
  </button><br>
  <br><br><hr>
  <div *ngIf="token.length > 0">
    Токен: <br><b>{{token}}</b>
  </div>
  <br>
  <br><br><hr>
  <div>Если пользователь сейчас на страничке, то мы можем вывести ему уведомление</div>
  <div style="border: 1px dashed; padding: 20px" *ngIf="pushMessage">
    <h2>{{pushMessage.title}}</h2>
    <p>{{pushMessage.body}}</p>
    <img src="{{pushMessage.image}}" />
  </div>
  `
})
export class AppComponent implements OnInit {


  token: string = 'ещё не получен';
  pushMessage = null;
  protected localStorageName: string = 'notificationToken';

  constructor(private afMessaging: AngularFireMessaging) { }


  ngOnInit() {
    console.log('ok, we init, go listen messages');

    const token = localStorage.getItem(this.localStorageName);
    console.log('token is in localStorage', token);

    if (!token) {
      this.afMessaging.getToken.subscribe(
        (token) => {
          this.saveToken(token);
          console.log('token saves localy', localStorage.getItem(this.localStorageName));

        },
        (error) => { console.error(error); },
      )
    } else {
      this.token = token;
    }

    this.afMessaging.messages
      .subscribe((message) => {

        console.log(message);
        console.log(message['notification']['title']);


        this.pushMessage = message['notification'];

      });
   

  }

  requestPermission() {
    this.afMessaging.requestPermission
      .pipe(mergeMapTo(this.afMessaging.tokenChanges))
      .subscribe(
        (token) => {
          console.log('Permission granted! Save to the server!', token);
          this.token = token;
        },
        (error) => { console.error(error); },
      );
  }

  listen() {
    this.afMessaging.messages
      .subscribe((message) => { console.log(message); });
  }

  saveToken(token) {
    this.token = token;
    localStorage.setItem(this.localStorageName, token);
  }

}