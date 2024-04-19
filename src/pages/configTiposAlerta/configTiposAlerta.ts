import { Component } from "@angular/core";
import { ConstructorService } from "../../services/serviciosConstructor";
import { TiposAlertas } from "../../services/tiposalertas";
import { NavController, NavParams, ActionSheetController, AlertController, } from "ionic-angular";
import { ConfigTiposAlertaDetallePage } from "../configTiposAlertaDetalle/configTiposAlertaDetalle";
import { Temas } from "../../services/temas";
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";
        

@Component({
    selector: "configTiposAlerta-page",
    templateUrl: "configTiposAlerta.html"
})

export class ConfigTiposAlertaPage{
    listaTemas: Temas[];
    listaTipos: TiposAlertas[];
    tema: any;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private servicio: ConstructorService, private navparams: NavParams,
                private actionSheet: ActionSheetController, private alertController: AlertController, ){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.cargarTiposAlerta();
        this.cargarTemas();

    }

    ionViewWillEnter() {
         this.cargarTiposAlerta();
    }

    cargarTiposAlerta(){
        this.servicio.getDatos("tiposalertas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTipos = rs;
        }, (er)=>{
            console.log(er);
        });
        
    }

    cargarTemas(){
        this.servicio.getDatos("temas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTemas = rs;
        },err=>console.log(err))
    }
    

    modificarTipo(tipo){
        this.navCtlr.push(ConfigTiposAlertaDetallePage,{
            alerta:tipo,
            DatosUsuario: this.DatosUsuario
        });
    }


   nuevoTipo(){
        this.navCtlr.push(ConfigTiposAlertaDetallePage, {DatosUsuario: this.DatosUsuario});
    }

    verTipo(tipo){
        this.navCtlr.push(ConfigTiposAlertaDetallePage, {
            tipoalerta: tipo,
            DatosUsuario: this.DatosUsuario
        });
    }

    habilitarTarea(object, tipo: TiposAlertas){
        if(tipo.ocultar == null || tipo.ocultar == 1){
            tipo.ocultar = 0;
            
        }else{
            tipo.ocultar = 1;
        }

        this.servicio.putRegistro("tiposalertas/"+this.db+"/", tipo, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            //console.log(rs)
        }, (er)=>console.log(er));
    }

    irBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

}