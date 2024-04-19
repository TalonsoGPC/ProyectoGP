import { Component } from '@angular/core';

import { ConstructorPage  } from "../constructor/constructor";
import { ConfiguracionPage  } from "../configuracion/configuracion";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabConstructor = ConstructorPage;
  tabConfiguracion = ConfiguracionPage

  constructor() {

  }
}
