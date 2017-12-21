import { Component, OnInit, ViewContainerRef, Input, NgZone, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidenceService } from '../providers/incidence.provider';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-personal-incidence',
  templateUrl: './personal-incidence.component.html',
  styleUrls: ['./personal-incidence.component.css']
})
export class PersonalIncidenceComponent implements OnInit {



  rForm: FormGroup;
  post:any;

  email: any;
  private sub: any;
  employees = [];
  incidences = [];
  modalRef: BsModalRef;
  incidence: any;
  check_in: any;
  check_out: any;
  constructor(private zone: NgZone, private route: ActivatedRoute, private services: IncidenceService,
    private modalService: BsModalService, private router: Router, private fb: FormBuilder) {

      this.rForm = fb.group({
        check_in: [null, Validators.required],
        check_out: [null, Validators.required]
      });
  }



  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.email = params['email'];
    });
    this.services.getEmployee(this.email).subscribe((data) => {
      this.employees = data.employee;
    })
    this.services.getPersonalIncidences(this.email).subscribe((data) => {
      this.incidences = data.incidences;
    })
    this.services.setIncidencesChecked(this.email).subscribe((data) => {
    })
  }

  openModal(incidence, template: TemplateRef<any>) {
    // this.services.getCheckHoursIncidence(incidence.email, incidence.date).subscribe((data) => {
    //   this.check_in = data.checkin;
    //   this.check_out = data.checkout;
    // });
    this.incidence = incidence;
    this.modalRef = this.modalService.show(template);
  }

  setSolved(event) {
    // this.services.solveIncidence(this.incidence.date).subscribe((data) => {
    //   setTimeout(() => {
    //     this.zone.run(() => {
    //       this.modalRef.hide();
    //       this.modalRef = null;
    //       this.services.getPersonalIncidences(this.email).subscribe((data) => {
    //         this.incidences = data.incidences;
    //       });
    //     });
    //   }, 200);
    // });
  }

  decline() {
    this.modalRef.hide();
    this.modalRef = null;
  }

  addPost(post) {
    this.check_in = post.check_in;
    this.check_out = post.check_out;
    console.log("Nuevos valores" + this.check_in + "--" + this.check_out);
  }

}
