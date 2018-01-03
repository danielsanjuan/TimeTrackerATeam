import { Component, OnInit, TemplateRef} from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { UserService } from '../providers/user.provider';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalUserComponent } from '../modal-user/modal-user.component';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  employees = [];
  modalRef: BsModalRef;
  constructor(private router: Router, private sessionSt: SessionStorageService, 
    private services: UserService, private modalService: BsModalService) {
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
  }

  ngOnInit() {
    this.services.getUserList().subscribe((data) => {
      this.employees = data.response_list;
    });
  }
  

  // showUserInfo(email, template: TemplateRef<any>){
  //   // this.router.navigate(['/modaluser', email]);
  //   this.modalRef = this.modalService.show(template);
  //   }
  
  openModal(email) {
    this.modalRef = this.modalService.show(ModalUserComponent);
    this.modalRef.content.employees = email;
  }
}
