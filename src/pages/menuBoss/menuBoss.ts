import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { AutBossPage } from "../autBoss/autBoss";
import { AlertasPage } from "../alertas/alertas";
import { ConfiguracionPage } from "../configuracion/configuracion";
import { DocumentosProyectosPage } from "../documentosProyectos/documentosProyectos";
//import { TiposReportesBossPage }  from "../tiposReportesBoss/tiposReportesBoss";
import { MenuControlObraPage } from "../menucontrolobra/menucontrolobra";
import { MenuVentasPage } from "../menuVentas/menuVentas";
import { ReportesProyectosPage }  from "../reportesProyectos/reportesProyectos";
import { DatosAPP } from "../../services/datosApp";
import { ConstructorService } from "../../services/serviciosConstructor";
import {NotificacionesPage} from "../notificaciones/notificaciones"
import {menuControlGP} from "../menuControlGP/menuControlGP";


@Component({
    selector: 'menuBoss-page',
    templateUrl: 'menuBoss.html'
})

export class MenuBossPage{

    listaMenuBoss: any[]=[];
    menuProyectos: boolean;
    menuVentas: boolean;
    menuInmuebles: boolean;
    db: string;
    DatosUsuario: DatosAPP;
    alertasSinLeidas: number =  0;



    constructor(public navCtrl: NavController, private navparams: NavParams, public servicio: ConstructorService){
         
         this.DatosUsuario = this.navparams.get("DatosUsuario");
         this.db = this.DatosUsuario.db;
         this.menuProyectos = false;
         this.menuVentas = false;
         this.menuInmuebles = false;
         this.validarPermisosUsuario();
         this.alertasNoLeidas(); 
        
    }

    ionViewWillEnter() {
        this.autNoEjecutadas();
        this.alertasNoLeidas();
    }

    ionViewCanLeave(){
        this.autNoEjecutadas();
        this.alertasNoLeidas();
    }

    onMenu(param: number){
        if(param==1){
           this.navCtrl.push(AlertasPage, {DatosUsuario: this.DatosUsuario});
        }else if(param==2){
            this.navCtrl.push(AutBossPage, {DatosUsuario: this.DatosUsuario});
        }else if(param==3){
            
        }else if(param==4){
            this.navCtrl.push(ReportesProyectosPage, {DatosUsuario: this.DatosUsuario});
        }else if(param==5){
            this.navCtrl.push(DocumentosProyectosPage, {DatosUsuario: this.DatosUsuario});
        }else if(param==6){
            this.navCtrl.push(MenuControlObraPage,  {DatosUsuario: this.DatosUsuario});
        }else if(param==7){
            this.navCtrl.push(MenuVentasPage, {
                parametro: 1,
                DatosUsuario: this.DatosUsuario
            });
        }else if(param==8){
            this.navCtrl.push(MenuVentasPage,{
                parametro: 2,
                DatosUsuario: this.DatosUsuario
            });
        }else if(param==9){
            
            this.navCtrl.push(menuControlGP,  {DatosUsuario: this.DatosUsuario});
        }
       
    }

    navConfigurador(){
        this.navCtrl.push(ConfiguracionPage,{DatosUsuario: this.DatosUsuario});
    }

    validarPermisosUsuario(){
        var usuario = "";
        var id =  0;

        id = this.DatosUsuario.id_usuario;
        usuario = this.DatosUsuario.usuario;
        this.agregarPermisos(id, usuario);
    }

    agregarPermisos(id: number, usuario: string){
        if((id!=null && id>0) && (usuario != null && usuario != ""))
            
            this.servicio.getDatos("usuarios/permisos/"+this.db+"/"+id.toString()+"/"+usuario+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                    if(rs.length>0){
                        if(rs[0].boss == 1){
                            this.listaMenuBoss.push({
                                id: 1,
                                nombre: "Alertas",
                                logo: "alertas.png",
                                descripcion: "",
                                notificacion: this.alertasSinLeidas
                            });
                            this.listaMenuBoss.push({
                                id: 2,
                                nombre: "Autorizaciones",
                                logo: "autorizacion.png",
                                descripcion: "",
                                notificacion: 0
                            });

                            this.listaMenuBoss.push({
                                id: 4,
                                nombre: "Reportes",
                                logo: "reportes_ejecutivos.png",
                                descripcion: "",
                                notificacion: 0
                            });
                            this.listaMenuBoss.push({
                                id: 5,
                                nombre: "Documentos",
                                logo: "archivo.png",
                                descripcion: "",
                                notificacion: 0
                            });
                        }
                        
                        if(rs[0].proyectos == 1){
                            this.listaMenuBoss.push({
                                id: 6,
                                nombre: "Proyectos",
                                logo: "proyectos.png",
                                descripcion: "",
                                notificacion: 0
                            });
                        }

                        if(rs[0].ventas == 1){
                            this.listaMenuBoss.push({
                                        id: 7,
                                        nombre: "Vivienda",
                                        logo: "venta.png",
                                        descripcion: "",
                                        notificacion: 0
                            });
                        }

                        if(rs[0].inmuebles == 1){
                            this.listaMenuBoss.push({
                                id: 8,
                                nombre: "Inmuebles",
                                logo: "ciclo_completo.png",
                                descripcion: "",
                                notificacion: 0
                            });
                        }
                        // if(rs[0].proyectos == 1){
                        //     this.listaMenuBoss.push({
                        //         id: 9,
                        //         nombre: "Control Obra",
                        //         logo: "contratistas.png",
                        //         descripcion: "",
                        //         notificacion: 0
                        //     }); 
                        // }
                }
        }, err=>console.log(err));
    }

    alertasNoLeidas(){
        this.servicio.getDatos("alertasPorUsuario/noleidas/"+this.db+"/"+this.DatosUsuario.usuario+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
            rs=>{
               //this.alertasSinLeidas = rs[0].sinleer;
                if (rs.length>=0){
                    if (this.listaMenuBoss.length>0){
                        this.listaMenuBoss[0].notificacion = rs[0].sinleer;
                    }
                }
            }, err=>{
                console.log(err);
            }
        )
    }

    autNoEjecutadas(){
        this.servicio.getDatos("autorizacionSinEjecutar/"+this.db+"/2/"+this.DatosUsuario.usuario+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
            rs=>{
               //this.alertasSinLeidas = rs[0].sinleer;
                if (rs.length>=0){
                    if (this.listaMenuBoss.length>0){
                        this.listaMenuBoss[1].notificacion = rs[0].contador;
                    }
                }
            }, err=>{
                console.log(err);
            }
        )
    }

    irNotificaciones(){
        this.navCtrl.push(NotificacionesPage, {
            DatosUsuario: this.DatosUsuario
        });
    }
}