import  { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import { Proyectos } from "../../services/proyectos";
import { ConstructorService } from "../../services/serviciosConstructor";
import { ReportesBossDetallePage }from "../reportesBossDetalle/reportesBossDetalle";
//import { FiltroDocumentosTiposPage }from "../filtroDocumentosTipo/filtroDocumentosTipo";
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";
import {NotificacionesPage} from "../notificaciones/notificaciones";

@Component({
    selector: "reportesProyectos-page",
    templateUrl: "reportesProyectos.html"
})

export class ReportesProyectosPage{
    listaProyectos: Proyectos[];
    tipoReporte: number;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navparams: NavParams, private navCtlr: NavController, 
                private servicio: ConstructorService){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.tipoReporte = 0;
        this.cargarProyectosUsuario();
        //this.tipoReporte = this.navparams.get("tipoReporte");

    }
    

    cargarProyectosUsuario(){
        this.servicio.getDatos("reportesProyectosUsuario/"+this.db+"/"+this.DatosUsuario.usuario+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaProyectos = rs;
        }, (er)=>console.log(er))
    }
    cargarProyectos(){
        /*this.servicio.getDatos("reportesProyectos/"+this.tipoReporte.toString()+"/").subscribe((rs)=>{
            this.listaProyectos = rs;
        }, (er)=>console.log(er))*/
        this.servicio.getDatos("reportesProyectosTodos/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaProyectos = rs;
        }, (er)=>console.log(er))
    }

    verReportes(proyecto: number){
        this.navCtlr.push(ReportesBossDetallePage, {
            proyecto: proyecto,
            tipoReporte: this.tipoReporte,
            DatosUsuario: this.DatosUsuario
        });
    }

    getFiltro(){
        this.navCtlr.push(ReportesBossDetallePage, {
            tipoReporte: this.tipoReporte,
            DatosUsuario: this.DatosUsuario
        });
    }

    menuBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

    irNotificaciones()
    {
        this.navCtlr.push(NotificacionesPage, {DatosUsuario: this.DatosUsuario});
    }
}