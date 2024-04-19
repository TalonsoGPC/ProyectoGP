import { Component } from "@angular/core";
import { ConstructorService }  from '../../services/serviciosConstructor';
import { Proyectos }  from '../../services/proyectos';
import { NavParams, NavController } from "ionic-angular";
import { ProyectosDetallePage } from "../proyectosdetalle/proyectosdetalle";
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "proyectos-page",
    templateUrl: "proyectos.html"
})

export class ProyectosPage{
    listaProyectos: Proyectos[];
    objeto = {};
    db: string;
    DatosUsuario: DatosAPP

    ionViewWillEnter() {
        this.cargarProyectos();
    }

    constructor(private navController: NavController, private navparams: NavParams, private servicio: ConstructorService){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.objeto = this.navparams.get("objeto");
        this.cargarProyectos();
    }

    cargarProyectos(){
       this.servicio.getDatos("proyectos/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
         .subscribe(  
           rs=>this.listaProyectos = rs,          
           er => console.log(er)
      )
    }

    nuevoProyecto(){
        this.navController.push(ProyectosDetallePage, {DatosUsuario: this.DatosUsuario});
    }

    verProyecto(proyecto){
        this.navController.push(ProyectosDetallePage, {
            proyecto: proyecto,
            DatosUsuario: this.DatosUsuario
        });
    }

        
    irBoss(){
        this.navController.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

}