import { Route} from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { LoginProvider } from './providers/login.provider';
import { Router } from '@angular/router';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  navbar:boolean = true;
  numberIncidences: number = 0;
  imagen:any;
  nombre:string="";
  subscription: Subscription;
  subscription2: Subscription;
  isCollapsed:boolean=true;
  
  constructor(private services:LoginProvider,  
              public router: Router, 
              private sesionService: SessionStorageService){
              
  }

  ngOnInit() {
    this.subscription = this.services.getNameUser().subscribe(data => { 
      this.nombre = data; 
    });
    this.subscription2 = this.services.getImgUser().subscribe(data => { 
      this.imagen = data; 
    });
  }

  ngAfterViewInit(){
    this.services.setSubjests();
  }
  
}
