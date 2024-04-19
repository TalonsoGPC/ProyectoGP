import { Component } from "@angular/core";
import { NavController, ToastController, NavParams } from "ionic-angular";
import { VentasConstructorPage } from "../ventasConstructor/ventasConstructor";
import { ConfiguracionVentasPage } from "../configuracionVentas/configuracionVentas";
import { ResumenDeVentasPage } from "../resumenDeVentas/resumenDeVentas";
import { MenuBossPage  } from "../menuBoss/menuBoss";

import { TemasVentas }  from '../../services/temasVentas';
import { ConstructorService }  from '../../services/serviciosConstructor';
import { DatosAPP } from "../../services/datosApp";

import {NotificacionesPage} from "../notificaciones/notificaciones";

@Component({
    selector: "menuVentas-page",
    templateUrl: "menuVentas.html"
})

export class MenuVentasPage{
    listaTemas: TemasVentas[];
    listaVentaInmuebles: TemasVentas[];
    listaRenta: TemasVentas[];
    listaMtto: TemasVentas[];
    parametro: number;
    tituloVivienda: string;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(public navCtrl: NavController, private servicio: ConstructorService, public toastCtlr: ToastController,
                public navparams: NavParams){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.tituloVivienda = "Vivienda";
        this.parametro = 0;
        this.parametro = this.navparams.get("parametro");

        if(this.parametro == 1){
            this.tituloVivienda = "Vivienda";
        }else if(this.parametro == 2){
            this.tituloVivienda = "Inmuebles";
        }
        this.cargarTemas();
        
    }
     
    cargarTemas(){
        if(this.parametro == 1){
            this.servicio.getDatos("temasVentasRango/"+this.db+"/"+"where id>=1 and id<=11", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                    .subscribe(  
                        rs=>{ 
                            this.listaTemas = rs;
                        },          
                        er => this.presentToast(er),
                    )
        }else if(this.parametro == 2){
            this.servicio.getDatos("temasVentasRango/"+this.db+"/"+"where id>=12 and id<=16", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                    .subscribe(  
                        rs=>{ 
                            this.listaTemas = rs;
                        },          
                        er => this.presentToast(er),
                    )

        }
       
    }

    private presentToast(text){
        let toast = this.toastCtlr.create({
            message: text,
            duration: 3000,
            position: "top"
        });
        toast.present();
    }

    getFiltro(tema){
        this.navCtrl.push(VentasConstructorPage, {
            tema: tema,
            parametro: this.parametro,
            DatosUsuario: this.DatosUsuario
        });
    }

    navConfigurador(){
        this.navCtrl.push(ConfiguracionVentasPage, {
            parametro: this.parametro,
            DatosUsuario: this.DatosUsuario
        });
    }

    irAResumenDeVentas(){
        this.navCtrl.push(ResumenDeVentasPage, {
            parametro: this.parametro,
            DatosUsuario: this.DatosUsuario
        });
    }

    menuBoss(){
        this.navCtrl.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

    irNotificaciones()
    {
        this.navCtrl.push(NotificacionesPage, {DatosUsuario: this.DatosUsuario});
    }
}