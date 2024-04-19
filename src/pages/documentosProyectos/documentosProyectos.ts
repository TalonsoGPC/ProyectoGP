import  { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import { Proyectos } from "../../services/proyectos";
import { ConstructorService } from "../../services/serviciosConstructor";
import { DocumentosProyectoTemaPage }from "../documentacionProyectoTema/documentacionProyectoTema";
import { DocumentacionDetallePage }from "../documentacionDetalle/documentacionDetalle";
import { MenuControlObraPage  } from "../menucontrolobra/menucontrolobra";
import { MenuVentasPage  } from "../menuVentas/menuVentas";
import { MenuBossPage } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";
import {NotificacionesPage} from "../notificaciones/notificaciones";

@Component({
    selector: "documentosProyectos-page",
    templateUrl: "documentosProyectos.html"
})

export class DocumentosProyectosPage{
    listaProyectos: Proyectos[];
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navparams: NavParams, private navCtlr: NavController, private servicio: ConstructorService){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.cargarProyectosUsuario();
        
    }

    cargarProyectos(){
        this.servicio.getDatos("documentacion/por/proyectos/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaProyectos = rs;
        }, (er)=>console.log(er))
    }

    cargarProyectosUsuario(){
        this.servicio.getDatos("documentacion/por/proyectosUsuario/"+this.db+"/"+this.DatosUsuario.usuario+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaProyectos = rs;
        }, (er)=>console.log(er))
    }

    verTemasDocumentos(proyecto: number){
        this.navCtlr.push(DocumentosProyectoTemaPage, {
            proyecto: proyecto,
            DatosUsuario: this.DatosUsuario
        });
    }

    getFiltro(){
        this.navCtlr.push(DocumentacionDetallePage, {DatosUsuario: this.DatosUsuario});
    }

    irControlObra(){
        this.navCtlr.push(MenuControlObraPage, {DatosUsuario: this.DatosUsuario});
    }

    irVentas(){
        this.navCtlr.push(MenuVentasPage, {DatosUsuario: this.DatosUsuario});
    }

    menuBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

    irNotificaciones()
    {
        this.navCtlr.push(NotificacionesPage, {DatosUsuario: this.DatosUsuario});
    }
}