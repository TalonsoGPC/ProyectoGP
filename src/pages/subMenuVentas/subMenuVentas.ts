import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { AutBossPage } from "../autBoss/autBoss";
import { AlertasPage } from "../alertas/alertas";
import { ConfiguracionVentasPage } from "../configuracionVentas/configuracionVentas";
import { DocumentosProyectosPage } from "../documentosProyectos/documentosProyectos";
import { MenuControlObraPage } from "../menucontrolobra/menucontrolobra";
import { MenuVentasPage } from "../menuVentas/menuVentas";
import { ReportesProyectosPage }  from "../reportesProyectos/reportesProyectos";
import { VentasConstructorPage } from "../ventasConstructor/ventasConstructor";
import { ConstructorService } from "../../services/serviciosConstructor";
import { MenuBossPage } from "../menuBoss/menuBoss";
import { TemasVentas } from "../../services/temasVentas";
import { DatosAPP } from "../../services/datosApp";
import {NotificacionesPage} from "../notificaciones/notificaciones";

@Component({
    selector: 'subMenuVentas-page',
    templateUrl: 'subMenuVentas.html'
})

export class SubMenuVentasPage{

    listaMenuBoss: any[]=[];
    ventaInmueble: TemasVentas;
    ventaRenta: TemasVentas;
    ventaMantenimiento: TemasVentas;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(public navCtrl: NavController, private navparams: NavParams, private servicio: ConstructorService){

        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;

        this.listaMenuBoss.push({
            id: 1,
            nombre: "Vivienda",
            logo: "venta.png",
            descripcion: "",
            notificacion: 0
        });
        this.listaMenuBoss.push({
            id: 2,
            nombre: "Venta Inmuebles",
            logo: "venta_inmuebles.png",
            descripcion: "",
            notificacion: 0
        });
        this.listaMenuBoss.push({
            id: 3,
            nombre: "Renta",
            logo: "renta.png",
            descripcion: "",
            notificacion: 0
        });
        this.listaMenuBoss.push({
            id: 4,
            nombre: "Mantenimiento",
            logo: "mantenimiento.png",
            descripcion: "",
            notificacion: 0
        });
       
    }

    onMenu(param: number){
        if(param==1){
           this.navCtrl.push(MenuVentasPage, {DatosUsuario: this.DatosUsuario});
        }else if(param==2){
            this.servicio.getDatos("temasVentas/"+this.db+"/14/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                    this.navCtrl.push(VentasConstructorPage, {
                      tema: rs[0],
                      DatosUsuario: this.DatosUsuario
                    });
            }, err=>{console.log(err)})
        }else if(param==3){

            this.servicio.getDatos("temasVentas/"+this.db+"/13/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                    this.navCtrl.push(VentasConstructorPage, {
                      tema: rs[0],
                      DatosUsuario: this.DatosUsuario
                    });
            }, err=>{console.log(err)})


        }else if(param==4){
            this.servicio.getDatos("temasVentas/"+this.db+"/12/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                    this.navCtrl.push(VentasConstructorPage, {
                      tema: rs[0],
                      DatosUsuario: this.DatosUsuario
                    });
            }, err=>{console.log(err)})
        }
    }

    navConfigurador(){
        this.navCtrl.push(ConfiguracionVentasPage, {DatosUsuario: this.DatosUsuario});
    }
    
    menuBoss(){
        this.navCtrl.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

    permisosTemas(){
        this.servicio.getDatos("temasVentas/"+this.db+"/12/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            this.ventaMantenimiento = rs[0];
        }, err=>{console.log(err)})

        this.servicio.getDatos("temasVentas/"+this.db+"/13/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            this.ventaRenta = rs[0];
        }, err=>{console.log(err)})

        this.servicio.getDatos("temasVentas/"+this.db+"/14/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            this.ventaInmueble = rs[0];
        }, err=>{console.log(err)})

    }    

    irNotificaciones()
    {
        this.navCtrl.push(NotificacionesPage, {DatosUsuario: this.DatosUsuario});
    }
}