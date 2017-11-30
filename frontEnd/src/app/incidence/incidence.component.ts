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
  //     name: "Daniel San Juan",
  //     email: "dani.sanjuan.93@gmail.com",
  //     image: "https://image.flaticon.com/icons/svg/16/16480.svg"
  //   },  {
  //     name: "Mathew Munoz",
  //     email: "mathew@gmail.com",
  //     image: "https://image.flaticon.com/icons/svg/16/16480.svg"
  //   },  {
  //     name: "Alejandro",
  //     email: "alejandro@gmail.com",
  //     image: "https://image.flaticon.com/icons/svg/16/16480.svg"
  //   },  {
  //     name: "Daniel Arbelo",
  //     email: "arbelo@gmail.com",
  //     image: "https://image.flaticon.com/icons/svg/16/16480.svg"
  //   },  {
  //     name: "Eminencia",
  //     email: "eminem@gmail.com",
  //     image: "https://image.flaticon.com/icons/svg/16/16480.svg"
  //   }
  // ];

  ngOnInit() {
    this.service.getIncidenceReport().subscribe((data) => {
      this.employees = data.users;
    })
  }

  showPersonalIncidence(email){
    this.router.navigate(['/personalIncidence', email]);
  }

}
