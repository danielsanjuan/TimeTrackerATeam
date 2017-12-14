import { Component, OnInit, ViewContainerRef, Input, NgZone, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidenceService } from '../providers/incidence.provider';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-incidence',
  templateUrl: './personal-incidence.component.html',
  styleUrls: ['./personal-incidence.component.css']
})
export class PersonalIncidenceComponent implements OnInit {

  email: any;
  private sub: any;
  employees = [];
  incidences = [];
  modalRef: BsModalRef;
  incidence: any;

  constructor(private zone: NgZone, private route: ActivatedRoute, private services: IncidenceService,
    private modalService: BsModalService, private router: Router) {
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
    this.incidence = incidence;
    this.modalRef = this.modalService.show(template);
  }

  setSolved() {
    this.services.solveIncidence(this.incidence.date).subscribe((data) => {
      setTimeout(() => {
        this.zone.run(() => {
          this.modalRef.hide();
          this.modalRef = null;
          this.services.getPersonalIncidences(this.email).subscribe((data) => {
            this.incidences = data.incidences;
          });
        });
      }, 200);
    });
  }

  decline() {
    this.modalRef.hide();
    this.modalRef = null;
  }

}
