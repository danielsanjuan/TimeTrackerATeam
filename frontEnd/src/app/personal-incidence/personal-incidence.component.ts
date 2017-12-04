import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidenceService } from '../providers/incidence.provider';

@Component({
  selector: 'app-personal-incidence',
  templateUrl: './personal-incidence.component.html',
  styleUrls: ['./personal-incidence.component.css']
})
export class PersonalIncidenceComponent implements OnInit {

  message: any;
  private sub: any;
  employees = [];
  incidences = [];

  constructor(private route: ActivatedRoute, private services: IncidenceService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) =>{
      this.message = params['email'];
    });
    this.services.getEmployee(this.message).subscribe((data) =>{
      this.employees = data.employee;
      console.log(data.employee);
    })
    this.services.getPersonalIncidences(this.message).subscribe((data) => {
      this.incidences = data.incidences;
      console.log(data.incidences);
    })
  }

}
