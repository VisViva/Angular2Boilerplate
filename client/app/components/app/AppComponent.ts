import {Component} from '@angular/core';

@Component({
  selector: 'my-app',
  template: '<h1>My First Angular 2 App</h1>'
})
export class AppComponent {
  constructor(){
  console.log("We are up and running!");
}}
