import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-personal-incidence',
  templateUrl: './personal-incidence.component.html',
  styleUrls: ['./personal-incidence.component.css']
})
export class PersonalIncidenceComponent implements OnInit {

  message: any;
  private sub: any;
  employees: [{
    name: "Daniel San Juan",
    email: "dani.sanjuan.93@gmail.com",
    image: "https://lh5.googleusercontent.com/-ZznyY8-otZY/AAAAAAAAAAI/AAAAAAAAAAA/AFiYof1Fo5giu-KtmpMu0XQ3v2wPR8JotQ/s96-c/photo.jpg",
    incidences: [{
      date: "12/12/2017",
      message: "Has llegado tarde",
    },{
      date: "12/12/2017",
      message: "Has llegado pronto",
    },{
      date: "12/12/2017",
      messages: "No has llegado",
    }]
  },{
    name: "Mathew Munoz",
    email: "mathew@gmail.com",
    image: "https://lh5.googleusercontent.com/-ZznyY8-otZY/AAAAAAAAAAI/AAAAAAAAAAA/AFiYof1Fo5giu-KtmpMu0XQ3v2wPR8JotQ/s96-c/photo.jpg",
    incidences: [{
      date: "12/12/2017",
      messages: "Has llegado tarde",
    },{
      date: "12/12/2017",
      message: "Has llegado pronto",
    },{
      date: "12/12/2017",
      message: "No has llegado",
    }]
  }];
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) =>{
      this.message = params['email'];
    });
  }

}
