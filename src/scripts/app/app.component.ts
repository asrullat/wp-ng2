import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import 'rxjs/Rx';


@Component({
    selector: 'ng-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    constructor() {}

    ngOnInit () :void {
        console.log("AppComponent");
    }
}
