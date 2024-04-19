import  { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Temas } from "../../services/temas";
import { ConstructorService } from "../../services/serviciosConstructor";
import { CatalogoTemasDetallePage } from "../catalogoTemasDetalle/catalogoTemasDetalle";
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "catalogoTemas-page",
    templateUrl: "catalogoTemas.html"
})

export class CatalogoTemasPage{
    listaTemas: Temas[];
    listaCheck: any[]=[];
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navparams: NavParams, private navCtlr: NavController, private servicio: ConstructorService, ){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.cargarTemas();
        
    }

    ionViewWillEnter() {
         
         this.cargarTemas();
    }

    cargarTemas(){
        this.servicio.getDatos("temas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTemas = rs;
        }, (er)=>console.log(er));
    }


    nuevoTema(){
        this.navCtlr.push(CatalogoTemasDetallePage, {DatosUsuario: this.DatosUsuario});
    }

    verTema(tema){
        this.navCtlr.push(CatalogoTemasDetallePage, {
            tema: tema,
            DatosUsuario: this.DatosUsuario
        });
    }

    habilitarTema(object, tema: Temas){
        if(tema.ocultar == null || tema.ocultar == 1){
            tema.ocultar = 0;
            
        }else{
            tema.ocultar = 1;
        }

        this.servicio.putRegistro("temas/"+this.db+"/", tema, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            //console.log(rs)
        }, (er)=>console.log(er));
    }


    irBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }


}