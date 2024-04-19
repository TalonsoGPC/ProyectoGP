/* Ionic */
import {  Component } from "@angular/core"
import { NavController, ActionSheetController, AlertController, NavParams } from "ionic-angular";


/* Contructor */
import { Usuarios }  from '../../services/usuarios';
import { ConstructorService }  from '../../services/serviciosConstructor';
import { Proyectos }  from '../../services/proyectos';
import { TemasVentas }  from '../../services/temasVentas';
import { VeEstatus }  from '../../services/veEstatus';
import { VeMensajesUsuariosPage } from "../veMensajesUsuarios/veMensajesUsuarios";
import { VeVendedores }  from '../../services/veVendedores';
import { TiposReportesBossPage } from "../tiposReportesBoss/tiposReportesBoss";
import { DocumentosProyectosPage } from "../documentosProyectos/documentosProyectos";
import { MenuBossPage } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";
import {NotificacionesPage} from "../notificaciones/notificaciones";
        
@Component({
    selector: "ventasConstructor-page",
    templateUrl: "ventasConstructor.html"
})

export class VentasConstructorPage{

   tema: any;
   titulo: string;
   listaTemas: TemasVentas[];
   listaProyectos: Proyectos[];
   listaEstatus: VeEstatus[];
   listaUsuarios: Usuarios[];
   tituloConstructor: string;
   listaMensajesPorTema: any[]=[];
   listaVendedores: VeVendedores[];
   temaSecundario = 0;
   listaClientes: any[];
   parametro: number;
   db: string;
   asset: string;
   DatosUsuario: DatosAPP;

    constructor(public navCtlr: NavController, private servicio: ConstructorService, 
    private actionSheet: ActionSheetController, private alertController: AlertController,
    private navparams: NavParams){
    
    this.DatosUsuario = this.navparams.get("DatosUsuario");
    this.db = this.DatosUsuario.db;
    this.asset = this.DatosUsuario.asset;
    this.temaSecundario = 0;

    this.parametro = 0;
    this.parametro = this.navparams.get("parametro");
    this.tema = this.navparams.get("tema");

        if(this.tema==null || this.tema == undefined){
            this.tema = {
                id: 0,
                descripcion: "Ventas"
            }
        }
        this.tituloConstructor = "Ventas";
        this.cargarTemas();
        this.cargarEstatus();
        this.cargarProyectosUsuario();
        this.cargarVendedoreas();
        this.cargarClientes();
        this.cargarMensajesOptimizado();
        if(this.tema.id==11){
            this.temaSecundario = 11;
        }  

 
    }

    ionViewWillEnter() {
         this.cargarMensajesOptimizado();
    }
    
    verMensaje(item){

        var tema : any;
        var temaParametro: any;
        var filtroGeneral =  0;

        if(this.tema.id == 0 || this.tema.id == 11){

            if(this.tema.id = 11){
                this.temaSecundario = 11;
            }

            filtroGeneral =  1;
            this.listaTemas.forEach((element)=>{
                if(element.id == item.tema){
                    tema = element;
                }
            });


            /*tema = {
                id: item.tema,
                descripcion: item.descripcion_tema,
                color: item.color_tema,
            }*/

             temaParametro = item.tema;
        }else{
            temaParametro = this.tema.id;
            tema = this.tema;
        }

        this.navCtlr.push(VeMensajesUsuariosPage, {
            mensaje: item,
            tema: tema,
            temaParametro: temaParametro,
            filtroGeneral: filtroGeneral,
            temaSecundario: this.temaSecundario,
            parametro: this.parametro,
            DatosUsuario: this.DatosUsuario
        });
    }

    generarNuevo(){
        var temaParametro = this.tema.id;
        this.navCtlr.push(VeMensajesUsuariosPage, {
            tema: this.tema,
            temaParametro: temaParametro,
            DatosUsuario: this.DatosUsuario
        });
    }
    
    cargarClientes(){
        this.servicio.getDatos("veClientes/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaClientes = rs,          
            er => console.log(er)
        )
    }

    cargarProyectos(){
        this.servicio.getDatos("proyectos/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaProyectos = rs,          
            er => console.log(er)
        )
    }

    cargarProyectosUsuario(){
        this.servicio.getDatos("proyectosUsuario/"+this.db+"/"+this.DatosUsuario.usuario+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaProyectos = rs,          
            er => console.log(er)
        )
    }

    cargarTemas(){
        this.servicio.getDatos("temasVentas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>{
                this.listaTemas = rs;
                this.listaTemas.forEach((element)=>{
                    if(this.tema.id == element.id){
                        this.tituloConstructor = element.descripcion;
                    }
                })
            },          
            er => console.log(er)
        )
    }

    cargarEstatus(){
        this.servicio.getDatos("ventasEstatus/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaEstatus = rs,          
            er => console.log(er)
        )
    }
    
    cargarUsuarios(){
        this.servicio.getDatos("usuarios/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaUsuarios = rs,          
            er => console.log(er)
        )
    }

    cargarVendedoreas(){
        this.servicio.getDatos("veVendedores/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaVendedores = rs,          
            er => console.log(er)
        )
    }
    cargarMensajesOptimizado(){
        if(this.tema.id == 0 || this.tema.id == 11){
            let peticion = "ventasMensajes/"+this.db;

            if(this.parametro == 1){
                peticion = "ventasMensajesRangoUsuario/"+this.db+"/"+this.DatosUsuario.usuario+"/a.tema>=1 and a.tema<=11/";
            }else if(this.parametro == 2){
                peticion = "ventasMensajesRangoUsuario/"+this.db+"/"+this.DatosUsuario.usuario+"/a.tema>=12 and a.tema<=15/";
            }

            this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
            rs=>{
                this.listaMensajesPorTema = rs;
            },          
            er => console.log(er)
        )
        }else{
            this.servicio.getDatos("ventasMensajesTemaUsuario/"+this.db+"/"+this.DatosUsuario.usuario+"/"+this.tema.id.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
            rs=>{
                this.listaMensajesPorTema = rs;
            },          
            er => console.log(er))
        }
    }

    getFiltro(){
                if(this.tema.id == 0 || this.tema.id == 11){
                    let hojaFiltro = this.actionSheet.create({
                    title: "Filtros",
                    buttons: [{
                        text: "Proyectos",
                        handler: ()=>{
                            this.verOpcionFiltro(1);
                        }
                    },
                    { 
                        text: "Estatus",
                        handler: ()=>{
                             this.verOpcionFiltro(2);
                        }
                    },
                    {
                        text: "Vendedor",
                        handler: ()=>{
                            this.verOpcionFiltro(3);
                        }
                    },
                    {
                        text: "Cliente",
                        handler: ()=>{
                            this.verOpcionFiltro(4);
                        }
                    },
                    {
                        text: "Todo",
                        handler: ()=>{
                            this.tituloConstructor = "Constructor";
                            this.cargarMensajesOptimizado();
                        }
                    },
                    {
                        text: "Cancelar",
                        role: "cancel"
                    }
                    ]
                });

                hojaFiltro.present();
        }else{
            let hojaFiltro = this.actionSheet.create({
                    title: "Filtros",
                    buttons: [{
                        text: "Proyectos",
                        handler: ()=>{
                                this.verOpcionFiltro2(1);
                        }
                    },
                    /*{
                        text: "Estatus",
                        handler: ()=>{
                            this.verOpcionFiltro2(2);
                        }
                    },*/
                    {
                        text: "Todo",
                        handler: ()=>{
                            this.tituloConstructor = "Ventas";
                            this.filtroPorTema(this.tema.id);
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
       
    }

    verOpcionFiltro(param: number){
        
        let peticion;
        let alert = this.alertController.create();
        
        if(param==1){

            this.tituloConstructor = "Filtro: Proyecto";
            peticion = "mensajesVentasUsuario/proyecto/"+this.db+"/"+this.DatosUsuario.usuario+"/";
            alert.setTitle("Proyectos");

            this.listaProyectos.forEach(element => {
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.numproy.toString()
                });
            });    
        }else if(param==2){
            this.tituloConstructor = "Filtro: Estatus";
            peticion = "ventasMensajesTemaUsuario/"+this.db+"/"+this.DatosUsuario.usuario+"/";
            alert.setTitle("Temas");
            this.listaTemas.forEach(element => {
                if(element.ocultar==1){
                    alert.addInput({
                    type: "radio",
                    label: element.descripcion,
                    value: element.id.toString()
                    });
                }
                
            })
        }else if(param==3){
            this.tituloConstructor = "Filtro: Vendedor";
            peticion = "mensajesVentasUsuario/vendedor/"+this.db+"/"+this.DatosUsuario.usuario+"/";
            alert.setTitle("Vendedor");
            this.listaVendedores .forEach(element=>{
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.id.toString()
                });
            });
        }else if(param==4){
            this.tituloConstructor = "Filtro: Cliente";
            peticion = "ventasMensajesUsuario/cliente/"+this.db+"/"+this.DatosUsuario.usuario+"/";
            alert.setTitle("Cliente");
            this.listaClientes.forEach(element=>{
                alert.addInput({
                    type: "radio",
                    label: element.cliente,
                    value: element.cliente
                });
            });
        }

        alert.addButton("Cancelar");
        alert.addButton({
            text: "OK",
            handler: data=> {

                //let id = parseInt(data);
                peticion+=data+"/";
                this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => this.listaMensajesPorTema = rs,
                    er=>console.log(er)
                );
            }
        });

        alert.present();
    }

     verOpcionFiltro2(param: number){
        
        let peticion;
        let alert = this.alertController.create();
        
        if(param==1){
            
            if(this.temaSecundario = 11){
                 peticion = "ventasMensajesUsuario/proyecto/"+this.db+"/"+this.DatosUsuario.usuario+"/";
            }else{
                 peticion = "ventasMensajesUsuario/tema/proyecto/"+this.db+"/"+this.DatosUsuario.usuario+"/";
            }

            this.tituloConstructor = "Filtro: Proyecto";
            //this.cargarProyectos();
            alert.setTitle("Proyectos");

            this.listaProyectos.forEach(element => {
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.numproy.toString()
                });
            });    
        }else if(param==2){
            //this.cargarEstatus();
            peticion = "ventasMensajesUsuario/tema/estatus/"+this.db+"/"+this.DatosUsuario.usuario+"/";
            this.tituloConstructor = "Filtro: Estatus";
            alert.setTitle("Estatus");
            this.listaTemas.forEach(element=>{
                alert.addInput({
                    type: "radio",
                    label: element.descripcion,
                    value: element.id.toString()
                });
            })
        }

        alert.addButton("Cancelar");
        alert.addButton({
            text: "OK",
            handler: data=> {
                let id = parseInt(data);

                if(this.temaSecundario=11){
                     peticion+=id.toString()+"/"
                }else{
                    peticion+=this.tema.id.toString()+"/"+id.toString()+"/"
                }

                
                this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => this.listaMensajesPorTema = rs,
                    er=>console.log(er)
                );
            }
        })

        alert.present();
    }

    filtroPorTema(id: number){
        let peticion = "mensajesVentas/portema/"+this.db+"/";
        this.servicio.filtroMensajes(id, peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => this.listaMensajesPorTema = rs,
                    er=>console.log(er)
                );
    }

    irDocumentos(){
        this.navCtlr.push(DocumentosProyectosPage);
    }

        
    irReportesBoss(){
        this.navCtlr.push(TiposReportesBossPage, {DatosUsuario: this.DatosUsuario});
    }

    menuBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    } 

    returnPathFile(link, file){
            return this.DatosUsuario.url+this.asset+"/"+file;
    }

    irNotificaciones()
    {
        this.navCtlr.push(NotificacionesPage, {DatosUsuario: this.DatosUsuario});
    }
}