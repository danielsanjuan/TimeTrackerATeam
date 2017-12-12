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
      this.employees = data.users;
      console.log("estoy aqui dentro")
      console.log(data);
    })
  }

  showPersonalIncidence(email){
    this.router.navigate(['/personalIncidence', email]);
  }

}
