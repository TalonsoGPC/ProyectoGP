import { Component } from "@angular/core";
import { ConstructorService } from "../../services/serviciosConstructor";
import { Moneda } from "../../services/moneda";
import { NavController, NavParams, ActionSheetController, AlertController, } from "ionic-angular";
import { CatalogoMonedasDetallePage } from "../catalogoMonedasDetalle/catalogoMonedasDetalle";
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";
        

@Component({
    selector: "catalogoMonedas-page",
    templateUrl: "catalogoMonedas.html"
})

export class CatalogoMonedasPage{
    listaMonedas: Moneda[];
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private servicio: ConstructorService, private navparams: NavParams,
                private actionSheet: ActionSheetController, private alertController: AlertController, ){
            this.DatosUsuario = this.navparams.get("DatosUsuario");
            this.db = this.DatosUsuario.db;
            this.cargarMonedas();

        
    }

    ionViewWillEnter() {
         this.cargarMonedas();
    }

    cargarMonedas(){
        this.servicio.getDatos("monedas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaMonedas = rs;
        }, (er)=>{
            console.log(er);
        });
        
    }
    

    modificarMoneda(moneda){
        this.navCtlr.push(CatalogoMonedasDetallePage,{
            moneda:moneda,
            DatosUsuario: this.DatosUsuario
        });
    }

    
   nuevaMoneda(){
        this.navCtlr.push(CatalogoMonedasDetallePage, {DatosUsuario: this.DatosUsuario});
    }

    verMoneda(moneda){
        this.navCtlr.push(CatalogoMonedasDetallePage, {
            moneda: moneda,
            DatosUsuario: this.DatosUsuario
        });
    }

    irBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }


}