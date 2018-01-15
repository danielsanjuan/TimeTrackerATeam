import { Component, OnInit, ViewContainerRef, Input, NgZone, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { UserService } from '../providers/user.provider';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-user-ip',
  templateUrl: './user-ip.component.html',
  styleUrls: ['./user-ip.component.css']
})
export class UserIpComponent implements OnInit {

  rForm: FormGroup;
  nameUser:string;
  emailUser:string;
  imageUser:any;

  private ip_address = [
    {
      "date": "25/10/2017",
      "ip_address1": "48.89.86.144",
      "ip_address2": "148.164.92.173",
      "ip_address3": "249.15.117.21",
      "ip_address4": "53.84.191.13",
      "ip_address5": "-",
      "ip_address6": "-"
    }, {
      "date": "29/6/2017",
      "ip_address1": "106.14.152.163",
      "ip_address2": "-",
      "ip_address3": "-",
      "ip_address4": "-",
      "ip_address5": "-",
      "ip_address6": "-"
    }, {
      "date": "26/2/2017",
      "ip_address1": "159.196.239.243",
      "ip_address2": "25.40.173.60",
      "ip_address3": "240.210.111.31",
      "ip_address4": "3.15.251.212",
      "ip_address5": "1.246.106.21",
      "ip_address6": "30.206.104.216"
    }, {
      "date": "24/7/2017",
      "ip_address1": "224.183.132.165",
      "ip_address2": "-",
      "ip_address3": "-",
      "ip_address4": "-",
      "ip_address5": "-",
      "ip_address6": "-"
    }, {
      "date": "30/6/2017",
      "ip_address1": "22.102.230.203",
      "ip_address2": "25.6.116.211",
      "ip_address3": "-",
      "ip_address4": "-",
      "ip_address5": "-",
      "ip_address6": "-"
    }, {
      "date": "22/3/2017",
      "ip_address1": "109.169.204.0",
      "ip_address2": "85.36.137.189",
      "ip_address3": "-",
      "ip_address4": "-",
      "ip_address5": "-",
      "ip_address6": "-"
    }, {
      "date": "25/1/2017",
      "ip_address1": "85.118.240.191",
      "ip_address2": "41.76.180.76",
      "ip_address3": "204.126.178.152",
      "ip_address4": "154.123.106.223",
      "ip_address5": "254.11.10.172",
      "ip_address6": "242.68.217.254"
    }, {
      "date": "18/12/2017",
      "ip_address1": "227.219.57.129",
      "ip_address2": "138.172.179.137",
      "ip_address3": "-",
      "ip_address4": "-",
      "ip_address5": "-",
      "ip_address6": "-"
    }, {
      "date": "18/11/2017",
      "ip_address1": "62.163.162.98",
      "ip_address2": "123.114.234.255",
      "ip_address3": "-",
      "ip_address4": "-",
      "ip_address5": "-",
      "ip_address6": "-"
    }, {
      "date": "23/6/2017",
      "ip_address1": "108.73.11.200",
      "ip_address2": "27.58.9.207",
      "ip_address3": "218.146.183.163",
      "ip_address4": "255.130.237.196",
      "ip_address5": "115.133.149.22",
      "ip_address6": "232.118.161.75"
    }, {
      "date": "21/11/2017",
      "ip_address1": "136.242.167.134",
      "ip_address2": "24.67.119.215",
      "ip_address3": "223.3.101.171",
      "ip_address4": "-",
      "ip_address5": "-",
      "ip_address6": "-"
    }, {
      "date": "8/9/2017",
      "ip_address1": "218.226.156.165",
      "ip_address2": "236.5.175.139",
      "ip_address3": "-",
      "ip_address4": "-",
      "ip_address5": "-",
      "ip_address6": "-"
    }
  ]

  constructor(private router: Router,
              private sessionSt: SessionStorageService,
              private services: UserService,
              private fb: FormBuilder, 
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
                this.toastr.setRootViewContainerRef(vcr);
                this.rForm = this.fb.group({
                  check_in: ["", Validators.required],
                  check_out: [""]
                });
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
  }

  ngOnInit() {
    this.nameUser = this.sessionSt.retrieve('name');
    this.emailUser = this.sessionSt.retrieve('email');
    this.imageUser = this.sessionSt.retrieve('image');
    console.log(this.ip_address);
  }

  backToAccess() {
    this.router.navigate(['access']);
  }


}
