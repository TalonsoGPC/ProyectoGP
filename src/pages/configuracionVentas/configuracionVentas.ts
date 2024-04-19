import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { CatalogoTemasVentasPage } from "../catalogoTemasVentas/catalogoTemasVentas";
import { VeCatalogoModelosPropiedadPage } from "../veCatalogoModelosPropiedad/veCatalogoModelosPropiedad";
import { VeCatalogoVendedoresPage } from "../veCatalogoVendedores/veCatalogoVendedores";
import { DatosAPP } from "../../services/datosApp";


@Component({
    selector: "configuracionVentas-page",
    templateUrl: "configuracionVentas.html"
}) 

export class ConfiguracionVentasPage{
    items = [];
    DatosUsuario: DatosAPP;

    constructor(private navparams: NavParams, public navController:NavController){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.items = [
        {
            'title':'Temas',
            'icon':'ios-apps-outline',
            'color':'#fe9a2e'
        },
        {
            'title':'Modelos',
            'icon':'ios-home-outline',
            'color':'#fe9a2e'
        },
        {
            'title':'Vendedores',
            'icon':'ios-contact-outline',
            'color':'#fe9a2e'
        }
        ]
  }

  listaObjectos(item){
    if(item.title == "Temas"){
        this.navController.push(CatalogoTemasVentasPage,{
            objeto: item,
            DatosUsuario: this.DatosUsuario
        });
    }
    if(item.title == "Modelos"){
        this.navController.push(VeCatalogoModelosPropiedadPage,{
            objeto: item,
            DatosUsuario: this.DatosUsuario
        });
    }
    if(item.title == "Vendedores"){
        this.navController.push(VeCatalogoVendedoresPage,{
            objeto: item,
            DatosUsuario: this.DatosUsuario
        });
    }
  }
    
}

