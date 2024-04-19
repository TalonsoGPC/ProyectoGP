import {Component} from "@angular/core";
import {NavController, ActionSheetController, AlertController, NavParams} from "ionic-angular";
import { Usuarios }  from '../../services/usuarios';
import { AutBossPage } from "../autBoss/autBoss";
import { AlertasPage } from "../alertas/alertas";
import { ConstructorService }  from '../../services/serviciosConstructor';
import { MenuBossPage } from "../menuBoss/menuBoss";
import { TiposReportesBossPage } from "../tiposReportesBoss/tiposReportesBoss";
import { DocumentosProyectosPage } from "../documentosProyectos/documentosProyectos";
import { ReportesProyectosPage }  from "../reportesProyectos/reportesProyectos";
import { DatosAPP } from "../../services/datosApp";
import { AlRecepcionesPage } from "../ALRecepciones/ALRecepciones";

@Component({
    selector: "listaRecepciones-page",
    templateUrl: "listaRecepciones.html"
})

export class ListaRecepciones{
    listado: any[] = [];
    db: string;
    asset: string
    DatosUsuario: DatosAPP;

    public constructor(public navCtlr: NavController, private servicio: ConstructorService, 
        private actionSheet: ActionSheetController, private alertController: AlertController,
        private navparams: NavParams){

            this.DatosUsuario = this.navparams.get("DatosUsuario");
            this.db = this.DatosUsuario.db;
            this.asset = this.DatosUsuario.asset;
            this.cargarListado();

        }

        cargarListado(){
            this.servicio.getDatos("almacen/listaRecepciones/"+this.db+"/"+this.DatosUsuario.usuario+"/Todos/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
           .subscribe(  
               rs=>this.listado = rs,          
               er => console.log(er)
           )
       }

       
    menuControlObra(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario}); 
     }
 
     irDocumentos(){
         this.navCtlr.push(DocumentosProyectosPage, {DatosUsuario: this.DatosUsuario});
     }
 
         
     irReportesBoss(){
         this.navCtlr.push(ReportesProyectosPage, {DatosUsuario: this.DatosUsuario});
     }

     verAlertas(){
        this.navCtlr.push(AlertasPage, {DatosUsuario: this.DatosUsuario});
    }

    returnPathFile(link, file){
        return this.DatosUsuario.url + this.asset+"/INSUMOS/"+file;
    }

    generarNuevo(){
        this.navCtlr.push(ListaRecepciones, {DatosUsuario: this.DatosUsuario, Nuevo: 1});

    }

    navRecepcion(recep:any){
        this.navCtlr.push(ListaRecepciones, {DatosUsuario: this.DatosUsuario, Nuevo: 0, Recep:recep});
    }
}