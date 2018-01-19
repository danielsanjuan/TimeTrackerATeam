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

  openModal(employee) {
    this.modalRef = this.modalService.show(ModalUserComponent);
    this.modalRef.content.employees = employee;
    this.modalRef.content.mySelf = this.sessionSt.retrieve('email');
    this.modalRef.content.selectedRole = employee.role;
    this.modalRef.content.modalRef = this.modalRef;
  }

  downloadLogs(){
    this.services.downloadLogs().subscribe((data) => {
      let fileContents = "";
      for (let i = 0; i< data.response.length; i++){
        if (data.response[i].changesIn != null){
          fileContents += data.response[i].changesIn+"\n";
        }
        if (data.response[i].changesOut != null){
          fileContents += data.response[i].changesOut+"\n";
        }
      }
      let date = data.response_date;
      let filename = date + "-Logs.txt";
      let filetype = "text/plain";

      let a = document.createElement("a");
      let dataURI = "data:" + filetype +
      ";base64," + btoa(fileContents);
      a.href = dataURI;
      a['download'] = filename;
      let e = document.createEvent("MouseEvents");
      // Use of deprecated function to satisfy TypeScript.
      e.initMouseEvent("click", true, false,
      document.defaultView, 0, 0, 0, 0, 0,
      false, false, false, false, 0, null);
      a.dispatchEvent(e);
      a.remove();
    });
  }
}
