import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IncidenceService } from '../providers/incidence.provider';
@Component({
  selector: 'app-incidence',
  templateUrl: './incidence.component.html',
  styleUrls: ['./incidence.component.css']
})
export class IncidenceComponent implements OnInit {

  employees: any = [];
  responsiveName: string[] = [];

  constructor(private router: Router, private service: IncidenceService) { }


  ngOnInit() {
    this.service.getIncidenceReport().subscribe((data) => {
      if (data.users != undefined){
        this.employees = data.users;
        this.setResponsiveName(this.employees);
      } else {
        this.employees = [];
      }
    });
  }

  showPersonalIncidence(email){
    this.router.navigate(['/personalIncidence', email]);
  }

  setResponsiveName(employees){
    for (var i = 0; i < employees.length; i++) {
      let separate = employees[i].name.split(" ");
      if(separate.length>3){
        this.responsiveName[i] = separate[0]+" "+separate[2];
      }else{
        this.responsiveName[i] = separate[0]+" "+separate[1];
      }
    }
  }

}
