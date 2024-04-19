import { Component } from "@angular/core";
import { ConstructorService } from "../../services/serviciosConstructor";
import { VeVendedores } from "../../services/veVendedores";
import { NavController, NavParams, ActionSheetController, AlertController, } from "ionic-angular";
import { VeCatalogoVendedoresDetallePage } from "../veCatalogoVendedoresDetalle/veCatalogoVendedoresDetalle";
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";


@Component({
    selector: "veCatalogoVendedores-page",
    templateUrl: "veCatalogoVendedores.html"
})

export class VeCatalogoVendedoresPage{
    listaVendedores: VeVendedores[];
    db: string;
    tituloFiltro: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private servicio: ConstructorService, private navparams: NavParams,
    private actionSheet: ActionSheetController, private alertController: AlertController){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.cargarVendedores();     
    }

    ionViewWillEnter() {
        this.cargarVendedores();
    }

    cargarVendedores(){
        this.servicio.getDatos("veVendedores/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaVendedores = rs;
        }, (er)=>{
            console.log(er);
        });
    }
    
   nuevoVendedor(){
        this.navCtlr.push(VeCatalogoVendedoresDetallePage,{DatosUsuario: this.DatosUsuario});
    }

    verVendedor(vendedor){
        this.navCtlr.push(VeCatalogoVendedoresDetallePage, {
            vendedor: vendedor,
            DatosUsuario: this.DatosUsuario
        });
    }

    irBoss(){
        this.navCtlr.push(MenuBossPage,{DatosUsuario: this.DatosUsuario});
    }
}