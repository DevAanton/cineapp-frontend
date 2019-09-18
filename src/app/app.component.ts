import { Menu } from './_model/menu';
import { LoginService } from './_service/login.service';
import { Component } from '@angular/core';
import { MenuService } from './_service/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  menus: Menu[];

  constructor(public loginService: LoginService, private menuService: MenuService) {

  }

  ngOnInit() {
    this.menuService.menuCambio.subscribe(data => {
      this.menus = data;
    });
  }
}
