import  { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Temas } from "../../services/temas";
import { ConstructorService } from "../../services/serviciosConstructor";
import { DocumentacionDetallePage }from "../documentacionDetalle/documentacionDetalle";
import { DatosAPP } from "../../services/datosApp";
import { MenuBossPage } from "../menuBoss/menuBoss";
import {NotificacionesPage} from "../notificaciones/notificaciones";

@Component({
    selector: "documentacionProyectosTema-page",
    templateUrl: "documentacionProyectoTema.html"
})

export class DocumentosProyectoTemaPage{
    listaTemas: Temas[];
    proyecto: number;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private servicio: ConstructorService, private navparams: NavParams){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
                    
        this.proyecto = this.navparams.get("proyecto");
        this.cargarProyectos();

    }

    cargarProyectos(){
        this.servicio.getDatos("documentacion/proyectos/tema/"+this.db+"/"+this.proyecto.toString(), this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTemas = rs;
        }, (er)=>console.log(er))
    }

    verDocumentos(tema){
         this.navCtlr.push(DocumentacionDetallePage, {
            proyecto: this.proyecto,
            tema: tema.id,
            DatosUsuario: this.DatosUsuario
        });
    }
    
    getFiltro(){
        this.navCtlr.push(DocumentacionDetallePage, {
            proyecto: this.proyecto,
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