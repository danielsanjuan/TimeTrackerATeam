import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SessionStorageService } from 'ngx-webstorage';
import { IncidenceService } from './providers/incidence.provider';


@Injectable()
export class ProtectingRoutesGuard implements CanActivate {
  email:string;
  roleUser:string;
  constructor( private router:Router, private services: IncidenceService, private sessionSt: SessionStorageService){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean{
        this.email = this.sessionSt.retrieve('email');
        console.log(this.email);
        this.services.getEmployee(this.email).subscribe((data) => {
            this.roleUser = data.employee.role;
        });
        setTimeout(() => {
           if(this.roleUser == "0"){
              this.router.navigate(['/home']);
              return false;
            }
        }, 1);
        return true;
        // if(this.roleUser == "1"){
        //   console.log(this.roleUser);
        //   return true;
        // } 
        // else{
        //   console.log(this.roleUser);
        //   this.router.navigate(['/home']);
        //   return false;
        // }
  }
}
