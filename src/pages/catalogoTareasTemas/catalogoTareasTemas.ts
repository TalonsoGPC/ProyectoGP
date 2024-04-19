import  { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Temas } from "../../services/temas";
import { ConstructorService } from "../../services/serviciosConstructor";
import { CatalogoTareasPage } from "../catalogoTareas/catalogoTareas";
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";
        
@Component({
    selector: "catalogoTareasTemas-page",
    templateUrl: "catalogoTareasTemas.html"
})

export class CatalogoTareasTemaPage{
    listaTemas: Temas[];
    listaCheck: any[]=[];
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private servicio: ConstructorService, private navparams: NavParams){
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

    verTarea(tema){
        this.navCtlr.push(CatalogoTareasPage, {
            tema: tema,
            DatosUsuario: this.DatosUsuario
        });
    }


    irBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

}