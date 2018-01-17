import { ToastOptions } from "ng2-toastr";

export class CustomToastOption extends ToastOptions { 
    animate = 'flyRight';
    positionClass = 'toast-top-right';
    showCloseButton = true;
    toastLife = 20000;
    maxShown = 5;
}     