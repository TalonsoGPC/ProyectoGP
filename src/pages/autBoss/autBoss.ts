import {  Component } from "@angular/core"
import { NavController, ActionSheetController, AlertController, NavParams } from "ionic-angular";
import { Usuarios }  from '../../services/usuarios';
import { ConstructorService }  from '../../services/serviciosConstructor';
import { RequisicionesPage } from "../requisiciones/requisiciones";
import { MensajesUsuario } from "../../services/mensajesusuario";
import { Proyectos }  from '../../services/proyectos';
import { Temas }  from '../../services/temas';
import { Estatus }  from '../../services/estatus';
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { AlertasPage } from "../alertas/alertas";
import { Tareas }  from '../../services/tareas';
import { DatosAPP } from "../../services/datosApp";
import {NotificacionesPage} from "../notificaciones/notificaciones";


@Component({
    selector: "autboss-page",
    templateUrl: "autBoss.html"
})

export class AutBossPage{
   listaTemas: Temas[];
   listaProyectos: Proyectos[];
   listaEstatus: Estatus[];
   ListaMensajes: any[]=[];
   listaUsuarios: Usuarios[];
   tituloConstructor: string;
   listaTareas: Tareas[];
   db: string;
   asset: string
   DatosUsuario: DatosAPP;

   ionViewWillEnter() {
        this.cargarMensajes();
    }
    constructor(public navCtlr: NavController, private servicio: ConstructorService, 
                private actionSheet: ActionSheetController, private alertController: AlertController, private navparams: NavParams){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.asset = this.DatosUsuario.asset;
        
        this.cargarProyectos();
        this.cargarTemas();
        this.cargarEstatus();
        this.cargarUsuarios();
        this.cargarTareas();
        this.cargarMensajes();
        this.tituloConstructor = "";
       
    }

    cargarTareas(){
         this.servicio.getDatos("tareas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaTareas = rs,          
            er => console.log(er)
        )
    }

    navTema(objeto: any){
        this.navCtlr.push(RequisicionesPage, {
            mensaje: objeto,
            estatus: 2,
            tema: objeto.tema,
            DatosUsuario: this.DatosUsuario
        });
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

    cargarEstatus(){
        this.servicio.getDatos("estatus/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaEstatus = rs,          
            er => console.log(er)
        )
    }

    cargarMensajes(){
        let peticion = "mensajes/estatusPorUsuario/"+this.db+"/2/"+this.DatosUsuario.usuario+"/";

        this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => {this.ListaMensajes = rs;
                        },
                    er=>console.log(er)
                );
    }
    
    cargarUsuarios(){
        this.servicio.getDatos("usuarios/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaUsuarios = rs,          
            er => console.log(er)
        )
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
                text: "Estatus",
                handler: ()=>{
                        this.verOpcionFiltro(3);
                }
            },
            {
                text: "Todo",
                handler: ()=>{
                    this.tituloConstructor = "";
                    this.cargarMensajes();
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

    verOpcionFiltro(param: number){
        let peticion;
        let alert = this.alertController.create();
        
        if(param==1){
            this.tituloConstructor = "Filtro: Proyecto";
            peticion = "mensajes/proyectoPorUsuario/";
            alert.setTitle("Proyectos");
            this.listaProyectos.forEach(element => {
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.numproy.toString()
                });
            });    
        }else if(param==2){
             peticion = "mensajes/temaPorUsuario/";
            this.tituloConstructor = "Filtro: Tema";
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
        }else if(param==3){
             peticion = "mensajes/estatusPorUsuario/";
            this.tituloConstructor = "Filtro: Estatus";
            alert.setTitle("Estatus");
            this.listaEstatus.forEach(element => {
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.id.toString()
                });
            })
        }

        alert.addButton("Cancelar");
        alert.addButton({
            text: "OK",
            handler: data=> {
                let id = parseInt(data);
                peticion = peticion + this.db + "/" + id.toString()+"/"+this.DatosUsuario.usuario+"/";
                this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => this.ListaMensajes = rs,
                    er=>console.log(er)
                    );
                /*this.servicio.filtroMensajes2(2, zparam, id, peticion).subscribe(
                    rs => this.ListaMensajes = rs,
                    er=>console.log(er)
                );*/
            }
        })

        alert.present();
    }

    menuBoss(){
        this.navCtlr.push(MenuBossPage, { DatosUsuario: this.DatosUsuario});
    }


    irAlertas(){
        this.navCtlr.push(AlertasPage, { DatosUsuario: this.DatosUsuario});
    }

    navConfigurador(){}

    OcultarPorModulo(item: MensajesUsuario){
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

    returnPathFile(link, file){
        //return link+"/"+this.asset+"/"+file;
        return this.DatosUsuario.url+this.asset+"/"+file;
    }


    irNotificaciones()
    {
        this.navCtlr.push(NotificacionesPage, {DatosUsuario: this.DatosUsuario});
    }

}
