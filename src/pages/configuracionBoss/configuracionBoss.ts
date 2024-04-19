import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { ConfigTemaAlertaPage } from "../configTemaAlerta/configTemaAlerta";
import { ConfigTiposAlertaPage } from "../configTiposAlerta/configTiposAlerta";
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "configuracionBoss-page",
    templateUrl: "configuracionBoss.html"
}) 

export class ConfiguracionBossPage{
    items = [];
    DatosUsuario: DatosAPP;

    constructor(private navparams: NavParams, public navController:NavController){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.items = [
        {
            'title': 'Temas',
            'icon': 'ios-warning-outline',
            'color': '#fe9a2e'
        },
        {
            'title': 'Tipos Alertas',
            'icon': 'ios-alert-outline',
            'color': '#f53d3d'
        },
        ]
  }

  listaObjectos(item){
    if(item.title == "Temas"){
         this.navController.push(ConfigTemaAlertaPage,{DatosUsuario: this.DatosUsuario});
    }else if(item.title == "Tipos Alertas"){
        this.navController.push(ConfigTiposAlertaPage,{DatosUsuario: this.DatosUsuario});
    }


  }
    
}