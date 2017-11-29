import { Route} from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { LoginProvider } from './providers/login.provider';
import { Router } from '@angular/router';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  navbar:boolean = true;
  numberIncidences: number = 0;
  imagen:any;
  nombre:string;
  
  constructor(private services:LoginProvider, private router: Router, private sesionService: SessionStorageService){}

  ngOnInit() {

  }

  ngAfterViewInit(){
    this.imagen = this.sesionService.retrieve('image');
    console.log(this.imagen);
    this.nombre = this.sesionService.retrieve('name');
  }
  
  

}
