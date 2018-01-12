import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { CheckInService } from '../providers/check-in.service';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent implements OnInit {
  myOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy'
  };
  responsiveName: string[] = [];
  employees: any = [{
    "name": "Langsdon Foort Filyakov",
    "email": "langsdon.foort@edosoft.es",
    "ip1": "213.99.185.120",
    "ip2": "70.181.131.84",
    "ip3": "95.23.182.137",
    "ip4": "65.53.205.195",
    "ip5": "131.231.41.229",
    "ip6": "114.60.141.81"
  }, {
    "name": "Sandie Filyakov Foort",
    "email": "sandie.filyakov@edosoft.es",
    "ip1": "130.139.214.186",
    "ip2": "193.185.43.13",
    "ip3": "238.222.207.4",
    "ip4": "169.221.155.38",
    "ip5": "143.114.185.165",
    "ip6": "191.35.7.23"
  }, {
    "name": "Murielle Chesswas Filyakov",
    "email": "murielle.chesswas@edosoft.es",
    "ip1": "7.188.5.177",
    "ip2": "150.74.107.250",
    "ip3": "-",
    "ip4": "-",
    "ip5": "-",
    "ip6": "-"
  }, {
    "name": "Christean Deakins Filyakov",
    "email": "christean.deakins@edosoft.es",
    "ip1": "126.81.103.25",
    "ip2": "22.169.68.64",
    "ip3": "162.206.194.135",
    "ip4": "14.173.205.205",
    "ip5": "83.243.18.98",
    "ip6": "68.229.175.4"
  }, {
    "name": "Saudra Lanfear Filyakov",
    "email": "saudra.lanfear@edosoft.es",
    "ip1": "249.149.63.111",
    "ip2": "215.143.173.206",
    "ip3": "-",
    "ip4": "-",
    "ip5": "-",
    "ip6": "-"
  }, {
    "name": "Emmeline Bamforth Filyakov",
    "email": "emmeline.bamforth@edosoft.es",
    "ip1": "227.177.208.117",
    "ip2": "186.27.186.170",
    "ip3": "253.157.227.197",
    "ip4": "221.158.119.47",
    "ip5": "92.60.225.91",
    "ip6": "75.139.114.144"
  }, {
    "name": "Dav Peggram Filyakov",
    "email": "dav.peggram@edosoft.es",
    "ip1": "228.121.242.97",
    "ip2": "174.143.83.133",
    "ip3": "123.128.5.122",
    "ip4": "166.48.238.209",
    "ip5": "85.113.203.143",
    "ip6": "50.183.0.120"
  }, {
    "name": "Dalila Killen Filyakov",
    "email": "dalila.killen@edosoft.es",
    "ip1": "77.201.40.36",
    "ip2": "122.185.159.195",
    "ip3": "38.133.151.230",
    "ip4": "122.203.177.122",
    "ip5": "-",
    "ip6": "-"
  }, {
    "name": "Collen Axell Filyakov",
    "email": "collen.axell@edosoft.es",
    "ip1": "172.181.104.246",
    "ip2": "28.213.64.150",
    "ip3": "212.245.155.153",
    "ip4": "253.19.17.152",
    "ip5": "-",
    "ip6": "-"
  }, {
    "name": "Brittney Matoshin Filyakov",
    "email": "brittney.matoshin@edosoft.es",
    "ip1": "244.85.167.81",
    "ip2": "-",
    "ip3": "-",
    "ip4": "-",
    "ip5": "-",
    "ip6": "-"
  }];
  

  constructor(private router: Router, 
    private sessionSt: SessionStorageService, 
    private services: CheckInService) { }

  ngOnInit() {
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
    this.setResponsiveName(this.employees);
  }

  onDateChanged(event: IMyDateModel): void {
    console.log(event.formatted);
    
    //realizar llamada al metodo del servicio
    // this.services.getDailyIpReport(event.formatted).subscribe((data) => {
    //   if (data.response_list != undefined){   
    //     this.employees = data.response_list;
    //     this.setResponsiveName(this.employees);
    //   }else{
    //     this.employees = [];
    //   }     
    // });
  }

  goToPersonalIps(email){
    this.router.navigate(['/userIP', email]);
  }

  setResponsiveName(employees){
    for (var i = 0; i < employees.length; i++) {
      let separate = employees[i].name.split(" ");
      if(separate.length>3){
        this.responsiveName[i] = separate[0]+" "+separate[2];
      }else{
        this.responsiveName[i] = separate[0]+" "+separate[1];
      }
    }
  }
}
