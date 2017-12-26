import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IncidenceService } from '../providers/incidence.provider';
@Component({
  selector: 'app-incidence',
  templateUrl: './incidence.component.html',
  styleUrls: ['./incidence.component.css']
})
export class IncidenceComponent implements OnInit {

  constructor(private router: Router, private service: IncidenceService) { }

  employees = [];

  ngOnInit() {
    this.service.getIncidenceReport().subscribe((data) => {
      if (data != undefined){
        this.employees = data.users;
      }
    })
  }

  showPersonalIncidence(email){
    // console.log(email);
    this.router.navigate(['/personalIncidence', email]);
  }

}
