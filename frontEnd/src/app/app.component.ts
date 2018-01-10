import { Route} from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { LoginProvider } from './providers/login.provider';
import { Router } from '@angular/router';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { Subscription } from 'rxjs/Subscription';
import { IncidenceService } from './providers/incidence.provider';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  navbar:boolean = true;
  numberIncidences: number = 0;
  imagen:any = "";
  nombre:string;
  subscription: Subscription;
  subscription2: Subscription;
  isCollapsed:boolean = true;
  email:string;
  roleUser:string;
  admin:boolean;
  hrm:boolean;

  constructor(private services:LoginProvider,
              public router: Router,
              private serviceIncidence: IncidenceService,
              private sesionService: SessionStorageService){
    document.addEventListener('click', () => { this.isCollapsed = true; });
  }

  ngOnInit() {
    this.subscription = this.services.getNameUser().subscribe(data => {
      this.nombre = data;
    });
    this.subscription2 = this.services.getImgUser().subscribe(data => {
      this.imagen = data;

      this.email = this.sesionService.retrieve('email');
      this.serviceIncidence.getEmployee(this.email).subscribe((data) => {
        this.roleUser = data.employee.role;
        this.sesionService.store('role', this.roleUser);
        if(this.roleUser == "1"){
          this.hrm = true;
          this.admin = false;
        }else if(this.roleUser == "2"){
          this.admin = true;
          this.hrm = true;
        }
        else{
          this.admin = false;
          this.hrm = false;
        }
      });
    });
  }

  ngAfterViewInit(){
    this.services.setSubjests();
  }

  buttonNavbar(){
    this.isCollapsed = !this.isCollapsed;
    event.stopPropagation();
  }

}
