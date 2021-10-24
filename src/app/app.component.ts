import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
  <button (click)="requestPermission()">
    Hello this is a chat app. You should let us send you notifications for this reason.
  </button><br>
  <button (click)="listen()">
    Get notified!
  </button><br><br>

  <button (click)="send()">
    Go nutify!
  </button><br><br>
  `
})
export class AppComponent implements OnInit {

  constructor(private afMessaging: AngularFireMessaging) { }


  ngOnInit() {
    console.log('ok, we init, go listen messages');
    
    this.afMessaging.messages
      .subscribe((message) => { 
        
        console.log(message);
      
      });
  }

  requestPermission() {
    this.afMessaging.requestPermission
      .pipe(mergeMapTo(this.afMessaging.tokenChanges))
      .subscribe(
        (token) => { console.log('Permission granted! Save to the server!', token); },
        (error) => { console.error(error); },  
      );
  }

  listen() {
    this.afMessaging.messages
      .subscribe((message) => { console.log(message); });
  }
  send() {
    this.afMessaging.getToken.subscribe(token => {
      console.log('token on getToken subscribe', token);
      
      const key = 'BKMXf-RGn51MY2SKQcBMiq7ho9G9G_tfeoEKZp3sXRJkohmj2u-mmPcYHzktzpltUPe2s8xttBnaRvu_YR19sv8';
      fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                    'Authorization': 'key=' + key,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        "title": "Ералаш",
                        "body": "Начало в 21:00",
                        "icon": "https://eralash.ru.rsz.io/sites/all/themes/eralash_v5/logo.png?width=40&height=40",
                        "click_action": "http://eralash.ru/",
                        "image": "https://peter-gribanov.github.io/serviceworker/Bubble-Nebula_big.jpg"
                    },
                    to: token
                })
            }).then(function(response) {
                return response.json();
            }).then(function(json) {
                console.log('Response', json);
            }).catch(function(error) {
                console.log('error send notify', error);
                
            });
    });
  }
}