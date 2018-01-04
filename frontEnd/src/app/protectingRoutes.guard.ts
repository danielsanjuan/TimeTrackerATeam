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
      this.roleUser = this.sessionSt.retrieve('role');
        if(this.roleUser == "1" || this.roleUser == "2"){
          return true;
        }
        else{
          this.router.navigate(['/home']);
          return false;
        }
  }


}
