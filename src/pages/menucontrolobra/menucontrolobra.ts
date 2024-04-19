import { Component } from "@angular/core";
import {NavController, ToastController, NavParams } from "ionic-angular";
import { ConstructorPage } from "../constructor/constructor";
import { ConfiguracionPage } from "../configuracion/configuracion";
import { ResumenDeProyectosPage } from "../resumenDeProyectos/resumenDeProyectos";
import { MenuBossPage } from "../menuBoss/menuBoss";
import {NotificacionesPage} from "../notificaciones/notificaciones";

import { Temas }  from '../../services/temas';
import { ConstructorService }  from '../../services/serviciosConstructor';

import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "menucontrolobra-page",
    templateUrl: "menucontrolobra.html"
})

export class MenuControlObraPage{
    listaTemas: Temas[];
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navparams: NavParams, public navCtrl: NavController, private servicio: ConstructorService, public toastCtlr: ToastController){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");

        this.db = this.DatosUsuario.db;
        this.cargarTemas();
       
    }
     
    cargarTemas(){
        this.servicio.getDatos("temas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaTemas = rs,          
            er => this.presentToast(er),
        )
    }

    private presentToast(text){
        let toast = this.toastCtlr.create({
            message: text,
            duration: 3000,
            position: "top"
        });
        toast.present();
    }

    getFiltro(item: number){
        this.navCtrl.push(ConstructorPage, {
            tema: item,
            DatosUsuario: this.DatosUsuario
        });
    }

    navConfigurador(){
        this.navCtrl.push(ConfiguracionPage, {DatosUsuario: this.DatosUsuario});
    }

    irAResumenDeProyectos(){
        this.navCtrl.push(ResumenDeProyectosPage, {DatosUsuario: this.DatosUsuario});
    }

    menuBoss(){
        this.navCtrl.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

    irNotificaciones()
    {
        this.navCtrl.push(NotificacionesPage, {DatosUsuario: this.DatosUsuario});
    }
}