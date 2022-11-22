import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
   public userRole: string;

  constructor(private authService: AuthService){}

  ngOnInit() {

   // this.userRole = localStorage.getItem("userRole");
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userRole = this.authService.getUserRole()
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;

    });

  }


  onLogout()
  {
    this.authService.logout()
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
