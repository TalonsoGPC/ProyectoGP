import { Component } from "@angular/core";
import { NavController, NavParams} from "ionic-angular";
import { MenuControlObraPage } from "../menucontrolobra/menucontrolobra";
import { MenuBossPage } from "../menuBoss/menuBoss";
import { MenuVentasPage } from "../menuVentas/menuVentas";
import { DatosAPP } from "../../services/datosApp";
        

@Component({
    selector: "menuconstructor-page",
    templateUrl: "menuConstructor.html"
})

export class MenuConstructorPage{
    db: string;
    DatosUsuario: DatosAPP;

    constructor(public navCtrl: NavController, private navparams: NavParams){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
    }

    onMenu(menu: number){
        if(menu==1){
            this.navCtrl.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
        }
        else if(menu==2){
            this.navCtrl.push(MenuControlObraPage,{DatosUsuario: this.DatosUsuario});
        }else if(menu==3){
            this.navCtrl.push(MenuVentasPage, {DatosUsuario: this.DatosUsuario});
        }
    }
}