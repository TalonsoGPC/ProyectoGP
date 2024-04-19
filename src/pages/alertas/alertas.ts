import  { Component } from "@angular/core";
import { NavController, ActionSheetController, AlertController, NavParams } from "ionic-angular";
import { Alertas } from "../../services/alertas";
import { TiposAlertas } from "../../services/tiposalertas";
import { Proyectos } from "../../services/proyectos";
import { Temas } from "../../services/temas";
import { Usuarios } from "../../services/usuarios";
import { ConstructorService } from "../../services/serviciosConstructor";
import { AlertasDetallePage } from "../alertasdetalle/alertasdetalle";
import { MenuControlObraPage  } from "../menucontrolobra/menucontrolobra";
import { MenuVentasPage  } from "../menuVentas/menuVentas";
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";
import {NotificacionesPage} from "../notificaciones/notificaciones";

@Component({
    selector: "alertas-page",
    templateUrl: "alertas.html"
})

export class AlertasPage {
    listaTemas: Temas[];
    listaProyectos: Proyectos[];
    ListaAlertas: any[]=[];
    listasTiposAlertas: TiposAlertas[];
    listaUsuarios: Usuarios[];
    tituloConstructor: string;
    tema: number;   
    opcionFiltro: number;
    db: string;
    asset: string;
    DatosUsuario: DatosAPP;

    ionViewWillEnter() {
        this.cargarAlertasUsuario();
    }

    
    constructor(public navCtlr: NavController, public navparams:NavParams, private servicio: ConstructorService,
                private actionSheet: ActionSheetController, private alertController: AlertController, ){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.asset = this.DatosUsuario.asset;
        this.opcionFiltro = 0;
        this.tituloConstructor = "";
        this.cargarProyectos();
        this.cargarTemas();
        this.cargarTiposAlertas();
        //this.cargarAlertas();
        this.cargarAlertasUsuario()
   
    }

    cargarAlertas(){
        this.servicio.getDatos("alertas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.ListaAlertas = rs;
        }, (er)=>{
            console.log(er);
        })
    }

    cargarAlertasUsuario(){
        this.servicio.getDatos("alertasPorUsuario/"+this.db+"/"+this.DatosUsuario.usuario+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.ListaAlertas = rs;
        }, (er)=>{
            console.log(er);
        })
    }

    cargarProyectos(){
        this.servicio.getDatos("proyectos/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaProyectos = rs,          
            er => console.log(er)
        )
    }

    cargarTemas(){
        this.servicio.getDatos("temas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaTemas = rs,          
            er => console.log(er)
        )
    }

    cargarTiposAlertas(){
        this.servicio.getDatos("tiposalertas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listasTiposAlertas = rs;
        }, (er)=>{
            console.log(er);
        })
    }

    navAlerta(item){
        this.navCtlr.push(AlertasDetallePage,{
            alerta: item,
            DatosUsuario: this.DatosUsuario
        })
    }

     getFiltro(){
                    let hojaFiltro = this.actionSheet.create({
                    title: "Filtros",
                    buttons: [{
                        text: "Proyectos",
                        handler: ()=>{
                                this.verOpcionFiltro(1);
                        }
                    },
                    { 
                        text: "Temas",
                        handler: ()=>{
                                this.verOpcionFiltro(2);
                        }
                    },
                    {
                        text: "Tipo Alerta",
                        handler: ()=>{
                            this.verOpcionFiltro2();
                        }
                    },
                    {
                        text: "Todo",
                        handler: ()=>{
                            this.tituloConstructor = "";
                            this.cargarAlertasUsuario();
                        }
                    },
                    {
                        text: "Cancelar",
                        role: "cancel"
                    }
                    ]
                });

                hojaFiltro.present();
       
    }

    filtroPorTema(id: number){
        let peticion = "alertas/tema/"+this.db+"/"+id.toString()+"/"+this.DatosUsuario.usuario+"/";
        this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => this.ListaAlertas = rs,
                    er=>console.log(er)
                );
    }

     verOpcionFiltro2(){
        
        let peticion;
        let alert = this.alertController.create();
        peticion = "alertas/tipoalertas/";
        
            alert.setTitle("Tema - Tipo Alerta");

            this.listaTemas.forEach(element => {
                if(element.ocultar == 1){
                        alert.addInput({
                        type: "radio",
                        label: element.nombre,
                        value: element.id.toString()
                    });
                }
                
            });    


        alert.addButton("Cancelar");
        alert.addButton({
            text: "OK",
            handler: data=> {
                this.tituloConstructor = "Filtro: Tipo Alerta";
                let id = parseInt(data);
                let alert2 = this.alertController.create();
                alert2.setTitle("Tipo Alerta");
                this.listasTiposAlertas.forEach(element => {

                    if(element.tema == id){
                        alert2.addInput({
                        type: "radio",
                        label: element.descripcion,
                        value: element.tipo.toString()
                        });
                    }
                   
                });
                alert2.addButton("Cancelar");
                alert2.addButton({
                    text: "OK",
                    handler: data2=>{
                        let tipo = parseInt(data2);
                        this.servicio.getDatos(peticion+this.db+"/"+id.toString()+"/"+tipo.toString()+"/"+this.DatosUsuario.usuario+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                        rs => this.ListaAlertas = rs,
                        er=>console.log(er)
                );
                    }
                })
                alert2.present();    
                /*this.servicio.filtroMensajes2(this.tema, id, param, peticion).subscribe(
                    rs => this.ListaAlertas = rs,
                    er=>console.log(er)
                );*/
            }
        })

        alert.present();
    }

    verOpcionFiltro(param: number){
        
        let peticion;
        let alert = this.alertController.create();
        
        if(param==1){
            this.tituloConstructor = "Filtro: Proyecto";
            peticion = "alertas/proyecto/";
            alert.setTitle("Proyectos");

            this.listaProyectos.forEach(element => {
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.numproy.toString()
                });
            });    
        }else if(param==2){
            this.tituloConstructor = "Filtro: Tema";
            peticion = "alertas/tema/";
            alert.setTitle("Temas");
            this.listaTemas.forEach(element => {
                if(element.ocultar == 1){
                     alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.id.toString()
                });
                }
               
            })
        }

        alert.addButton("Cancelar");
        alert.addButton({
            text: "OK",
            handler: data=> {
                let id = parseInt(data);
                this.servicio.getDatos(peticion+this.db+"/"+id.toString()+"/"+this.DatosUsuario.usuario+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => this.ListaAlertas = rs,
                    er=>console.log(er)
                );
            }
        })

        alert.present().then(()=>{

        });
    }

    generarNuevo(){
        this.navCtlr.push(AlertasDetallePage, {
            alerta: null,
            DatosUsuario: this.DatosUsuario
        })
    }

    navConfigurador(){
        
    }

    irControlObra(){
        this.navCtlr.push(MenuControlObraPage, {DatosUsuario: this.DatosUsuario});
    }

    irVentas(){
        this.navCtlr.push(MenuVentasPage, {DatosUsuario: this.DatosUsuario});
    }

    OcultarPorModulo(item: Alertas){
        var retorno = true;

        this.listaTemas.forEach((element)=>{
            if(element.id==item.tema){
                if(element.ocultar == 1){
                    retorno = true;
                }else{
                    retorno = false;
                }
            }
        }); 

        return retorno;
    }

    menuBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

    returnPathFile(link, file){
            return "http://"+this.DatosUsuario.direccion_remota+":"+this.DatosUsuario.puerto+"/"+this.asset+"/"+file;
    }

    irNotificaciones()
    {
        this.navCtlr.push(NotificacionesPage, {DatosUsuario: this.DatosUsuario});
    }
}