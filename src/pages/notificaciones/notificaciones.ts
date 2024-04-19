    import {Component} from "@angular/core";
import { NavController, NavParams, ToastController, LoadingController, Loading} from 'ionic-angular';

import { DatosAPP } from "../../services/datosApp";
import { ConstructorService } from "../../services/serviciosConstructor";
import { RequisicionesPage } from "../requisiciones/requisiciones";
import { AlertasDetallePage } from "../alertasdetalle/alertasdetalle";
import { VeMensajesUsuariosPage } from "../veMensajesUsuarios/veMensajesUsuarios";
import { MenuBossPage } from "../menuBoss/menuBoss";

import {PhotoViewer} from "@ionic-native/photo-viewer";
import { File }  from "@ionic-native/file";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { FileOpener } from '@ionic-native/file-opener';
import { ParametrosPage } from "../parametros/parametros";

@Component({
    selector: 'notificaciones-page',
    templateUrl: 'notificaciones.html'
})



export class NotificacionesPage {

    DatosUsuario: DatosAPP;
    Notificaciones: any[]=[];
    loading: Loading;


    ionViewDidLoad(){
        this.obtenerNotificaciones();
    }

    ionViewWillEnter() {
        //this.obtenerNotificaciones();
    }

    constructor(public navCtrl: NavController, private navparams: NavParams, public servicio: ConstructorService, private photoViewer: PhotoViewer,
                public file: File, public transfer: FileTransfer, private fileOpener: FileOpener, public loadingCtlr: LoadingController, public toastCtlr: ToastController,){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        //this.obtenerNotificaciones();
    }


    obtenerNotificaciones(){

        this.loading = this.loadingCtlr.create({
            content: "Cargando...",
        }); 

        this.loading.present();


        this.servicio.getDatos("notificaciones/filtro/"+this.DatosUsuario.db+"/"+this.DatosUsuario.usuario+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            this.Notificaciones = rs;
            this.loading.dismissAll();
        }, err=>{
            this.loading.dismissAll();
            console.log(err);
        });
    }


    irSeleccionado(dato: any){
        var aut = 0;

        if(dato.tipo == 2 || dato.tipo == 4)//Autorizaciones y Proyectos
        {
            
            if (dato.tipo == 2) 
            {
                aut = 2;
            }else{
                aut = 1;
            }

            this.servicio.getDatos("mensajesUsuario/id/"+this.DatosUsuario.db+"/"+dato.id_proceso+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
            rs=>{
                if(rs.length>0){
                    this.navCtrl.push(RequisicionesPage, {
                        mensaje: rs[0],
                        estatus: aut,
                        tema: dato.tema,
                        DatosUsuario: this.DatosUsuario
                    });
                }
            },          
            er => console.log(er))
        }else if(dato.tipo == 1)//Alertas
        {
            this.servicio.getDatos("alertasPorId/"+this.DatosUsuario.db+"/"+dato.id_proceso+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
            rs=>{
                if(rs.length>0){
                    this.navCtrl.push(AlertasDetallePage, {
                        alerta: rs[0],
                        DatosUsuario: this.DatosUsuario
                    });
                }
            },          
            er => console.log(er))
        }
        else if(dato.tipo == 3)//Reportes
        {
            this.servicio.getDatos("reporteId/"+this.DatosUsuario.db+"/"+dato.id_proceso+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
            rs=>{
                if(rs.length>0){
                    if (rs[0].formato == 'jpg'){
                        this.ampliarImagen(rs[0]);
                    }else{
                        this.accionArchivos(rs[0]);
                    }
                }
            },          
            er => console.log(er))
        }
        else if(dato.tipo == 5 || dato.tipo == 6)
        {
            this.servicio.getDatos("temasVentas/"+this.DatosUsuario.db+"/"+dato.tema+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
            rs=>{
                if(rs.length>0){

                    var tema : any;
                    var temaParametro: any;
                    var filtroGeneral =  0;

                    temaParametro = dato.tema;
                    tema = rs[0];

                    this.servicio.getDatos("ventasMensajes/"+this.DatosUsuario.db+"/"+dato.id_proceso+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                    .subscribe(rs2=>{
                        if(rs2.length>0)

                        this.navCtrl.push(VeMensajesUsuariosPage, {
                            mensaje: rs2[0],
                            tema: tema,
                            temaParametro: temaParametro,
                            filtroGeneral: filtroGeneral,
                            temaSecundario: 0,
                            DatosUsuario: this.DatosUsuario
                        });
                    }, err=>console.log(err))
                        }
                    },          
                    er => console.log(er))   
        }
    }

    menuBoss(){
        this.navCtrl.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

    returnPathFile(file){
        return this.DatosUsuario.url+this.DatosUsuario.asset+"/"+file;
    }

    ampliarImagen(imagen){
        var urlImage = this.DatosUsuario.url + this.DatosUsuario.asset + "/" + imagen.nombre;
        this.photoViewer.show(urlImage, imagen.nombre);
    }

    public accionArchivos(archivo: any){
        this.downloadFile(archivo);
    }

    public downloadFile(archivo: any){
        
        var directorio = "";

        if(this.DatosUsuario.so == "ios"){
            directorio = this.file.tempDirectory;
        }else if(this.DatosUsuario.so == "android"){
            directorio = this.file.externalCacheDirectory;
        }else{
            directorio = this.file.tempDirectory;
        }

        
        var url = this.DatosUsuario.url + this.DatosUsuario.asset + "/" + archivo.nombre

        const fileTransfer: FileTransferObject = this.transfer.create();

        this.loading = this.loadingCtlr.create({
            content: "Abriendo archivo...",
        }); 

        this.loading.present();
        
         fileTransfer.download(url, directorio + archivo.nombre).then((entry) => {
                this.loading.dismissAll()
                //this.presentToast("Abriendo el archivo... " + entry.toURL());
                this.abrirArchivo(directorio + archivo.nombre, archivo.formato)
            }, (error) => {
                this.loading.dismissAll()
                this.presentToast("Error al abrir el archivo. ");
            });
    }

    presentToast(text){
        let toast = this.toastCtlr.create({
            message: text,
            duration: 2000,
            position: "middle"
        });
        toast.present();
    }

    abrirArchivo(rutaArchivo: string, formato: string){
        
        if(this.DatosUsuario.so == "android"){
            formato = 'application/'+formato;
        }

        this.fileOpener.open(rutaArchivo, formato)
        .then(() => console.log('File is opened'))
        .catch(e => this.presentToast("Formato no soportado"));

    }

    refrescarDatos(event){
        this.obtenerNotificaciones();
        setTimeout(()=>{
            event.complete();
        }, 2000);
    }

    borrarNotificaciones(notificacion: any){
        this.servicio.delRegistro(notificacion.id, "notificaciones/"+this.DatosUsuario.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            this.obtenerNotificaciones();
        }, err=>{console.log("Error al borrar notificacion " + err)});
    }

    navParametros(){
        this.navCtrl.push(ParametrosPage, {
            DatosUsuario: this.DatosUsuario
        })
    }
}