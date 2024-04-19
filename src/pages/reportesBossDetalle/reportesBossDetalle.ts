import { Component } from "@angular/core";
import { NavParams, NavController, ToastController, LoadingController, Loading, ActionSheetController } from "ionic-angular";
import { ConstructorService  }  from "../../services/serviciosConstructor";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import { MenuBossPage } from "../menuBoss/menuBoss";
import { ReportesBoss } from "../../services/reportesBoss";
import {NotificacionesPage} from "../notificaciones/notificaciones";

import { File }  from "@ionic-native/file";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { DatosAPP } from "../../services/datosApp";
import { FileOpener } from '@ionic-native/file-opener';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
    selector: "reportesBossDetalle-page",
    templateUrl: "reportesBossDetalle.html"
})

export class ReportesBossDetallePage{
    listaArchivos: ReportesBoss[];
    proyecto: number;
    tipoReporte: number;
    loading: Loading;
    so: string;
    db: string;
    asset: string;
    DatosUsuario: DatosAPP;
    

    constructor(private navCtlr: NavController,  private navparams: NavParams, private servicio: ConstructorService, private photoViewer: PhotoViewer,
                public loadingCtlr: LoadingController, public file: File,
                public toastCtlr: ToastController, public transfer: FileTransfer, 
                private fileOpener: FileOpener, private socialSharing: SocialSharing, public actionSheetCtlr: ActionSheetController){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.asset = this.DatosUsuario.asset;
            
        this.so = "";
        this.obtenerSO();
        this.tipoReporte = null;
        this.proyecto =  this.navparams.get("proyecto");
        this.cargarArchivos();
        //this.tipoReporte = this.navparams.get("tipoReporte");
    }

    cargarArchivos(){
        if((this.proyecto!=null && this.proyecto!=undefined) && (this.tipoReporte!=null && this.tipoReporte!=undefined)){
            this.servicio.getDatos("reportesPorProyectosTipo/"+this.db+"/"+this.proyecto.toString()+"/"+this.tipoReporte.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaArchivos = rs;
        }, (er)=>console.log(er))
        }else if((this.proyecto==null && this.proyecto==undefined) && (this.tipoReporte!=null || this.tipoReporte!=undefined)){
            this.servicio.getDatos("reportesPorTipo/"+this.db+"/"+this.tipoReporte+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaArchivos = rs;
        }, (er)=>console.log(er))
        }else if((this.proyecto!=null && this.proyecto!=undefined) && (this.tipoReporte==null || this.tipoReporte==undefined)){
            this.servicio.getDatos("reportesPorProyecto/"+this.db+"/"+this.proyecto+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaArchivos = rs;
        }, (er)=>console.log(er))
        }else{
             this.servicio.getDatos("todosLosReportes/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaArchivos = rs;
            }, (er)=>console.log(er))
        }
        
    }
    
    ampliarImagen(url, image){
        //var urlImage = url + this.asset + "/" + image.nombre;
        var urlImage = this.DatosUsuario.url + this.asset + "/" + image.nombre;
        this.photoViewer.show(urlImage, image.nombre);
    }

    public downloadFile(archivo: any){
        var directorio = "";

        if(this.so == "ios"){
            directorio = this.file.tempDirectory;
        }else if(this.so == "android"){
            directorio = this.file.externalCacheDirectory;
        }else{
            directorio = this.file.tempDirectory;
        }

        //var url = "http://142.4.197.18:8000/" + this.asset + "/" + archivo.nombre 
        var url = this.DatosUsuario.url + this.asset + "/" + archivo.nombre

        const fileTransfer: FileTransferObject = this.transfer.create();

        this.loading = this.loadingCtlr.create({
            content: "Abriendo archivo...",
        }); 

        this.loading.present();
        
         fileTransfer.download(url, directorio + archivo.nombre).then((entry) => {
                this.loading.dismissAll()
               
                this.presentToast("Abriendo el archivo... " + entry.toURL());
                this.abrirArchivo(directorio + archivo.nombre, archivo.formato)
            }, (error) => {
                this.loading.dismissAll()
                this.presentToast("Error al abrir el archivo. ");
            });
    }

    public compartirArchivo(archivo: any){
        var directorio = "";

        if(this.so == "ios"){
            directorio = this.file.tempDirectory;
        }else if(this.so == "android"){
            directorio = this.file.externalCacheDirectory;
        }else{
            directorio = this.file.tempDirectory;
        }
        
        //var url = "http://142.4.197.18:8000/" + this.asset + "/" + archivo.nombre 
        var url = this.DatosUsuario.url + this.asset + "/" + archivo.nombre
        const fileTransfer: FileTransferObject = this.transfer.create();

        this.loading = this.loadingCtlr.create({
            content: "Compartiendo archivo...",
        }); 

        this.loading.present();

         fileTransfer.download(url, directorio + archivo.nombre).then((entry) => {
                this.loading.dismissAll()
                this.socialSharing.share("", "", directorio + archivo.nombre)
            }, (error) => {
                this.loading.dismissAll()
                this.presentToast("Error al compartir");
            });
    }

 public accionArchivos(archivo: any){

        let actionSheet = this.actionSheetCtlr.create({
            title: archivo.nombre,
            buttons: [{
                icon: "ios-folder-open-outline",
                text: "Abrir archivo",
                handler: ()=>{
                    this.downloadFile(archivo);
                }
            },
            {
                icon: "ios-share-outline",
                text: 'Compartir archivo',
                handler: ()=>{
                    this.compartirArchivo(archivo);
                }
            },
            {
                text: "Cancel",
                role: "Cancel"
            }
            ]
        });

        actionSheet.present();
    }
    
    abrirArchivo(rutaArchivo: string, formato: string){
        
        if(this.DatosUsuario.so == "android"){
            formato = 'application/'+formato;
        }

        this.fileOpener.open(rutaArchivo, formato)
        .then(() => console.log('File is opened'))
        .catch(e => this.presentToast("Formato no soportado"));

    }

    menuBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

    presentToast(text){
        let toast = this.toastCtlr.create({
            message: text,
            duration: 3000,
            position: "middle"
        });
        toast.present();
    }

    obtenerSO(){
        this.so = this.DatosUsuario.so;
    }

    returnPathFile(link, file){
            //return link+"/"+this.asset+"/"+file;
            return this.DatosUsuario.url + this.asset+"/"+file;
    }

    irNotificaciones()
    {
        this.navCtlr.push(NotificacionesPage, {DatosUsuario: this.DatosUsuario});
    }
}