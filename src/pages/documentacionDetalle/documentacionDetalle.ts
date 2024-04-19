import { Component } from "@angular/core";
import { NavParams, NavController, ToastController, LoadingController, Loading , ActionSheetController } from "ionic-angular";
import { ArchivosMensajes  }  from "../../services/archivosmensajes";
import { ConstructorService  }  from "../../services/serviciosConstructor";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import { MenuConstructorPage } from "../menuConstructor/menuConstructor";
import { MenuBossPage } from "../menuBoss/menuBoss";
import { File }  from "@ionic-native/file";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { DatosAPP } from "../../services/datosApp";
import { FileOpener } from '@ionic-native/file-opener';
import { SocialSharing } from '@ionic-native/social-sharing';
import {NotificacionesPage} from "../notificaciones/notificaciones";


@Component({
    selector: "documentacionDetalle-page",
    templateUrl: "documentacionDetalle.html"
})

export class DocumentacionDetallePage{
    listaArchivos: ArchivosMensajes[];
    tipoArchivo: string;
    proyecto: number;
    tema: number;
    loading: Loading;
    so: string;
    db: string;
    asset: string;
    DatosUsuario: DatosAPP;
    

    constructor(private navCtlr: NavController,  private navparams: NavParams, private servicio: ConstructorService, private photoViewer: PhotoViewer,
                public loadingCtlr: LoadingController, public file: File,
                public toastCtlr: ToastController, public transfer: FileTransfer, private fileOpener: FileOpener,
                private socialSharing: SocialSharing, public actionSheetCtlr: ActionSheetController){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.asset = this.DatosUsuario.asset;
        this.so = "";
        this.obtenerSO();
        this.proyecto =  this.navparams.get("proyecto");
        this.tema =  this.navparams.get("tema");
        this.tipoArchivo =  this.navparams.get("tipoArchivo");

        this.cargarArchivos();
    }

    cargarArchivos(){
        if((this.proyecto!=null && this.proyecto!=undefined) && (this.tema!=null && this.tema!=undefined)){
            this.servicio.getDatos("documentacionProyectoTema/"+this.db+"/"+this.proyecto.toString()+"/"+this.tema.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaArchivos = rs;
        }, (er)=>console.log(er))
        }else if((this.proyecto!=null && this.proyecto!=undefined) && (this.tema==null || this.tema==undefined)){
            this.servicio.getDatos("documentacionProyecto/"+this.db+"/"+this.proyecto.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaArchivos = rs;
        }, (er)=>console.log(er))
        }else{
             this.servicio.getDatos("documentacion/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaArchivos = rs;
            }, (er)=>console.log(er))
        }
        
    }
    
    ampliarImagen(url, image){
        //var urlImage = url + this.asset + "/" + image.nombre;
        var urlImage = this.DatosUsuario.url + this.asset + "/" + image.nombre;
        this.photoViewer.show(urlImage, image.nombre);
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

    public downloadFile(archivo: any){

        var directorio = "";

        if(this.so == "ios"){
            directorio = this.file.tempDirectory;
        }else if(this.so == "android"){
            directorio = this.file.externalCacheDirectory;
        }else{
            directorio = this.file.tempDirectory;
        }

        //var url = "http://142.4.197.18:8000/"+this.asset+"/" + archivo.nombre 
        var url = this.DatosUsuario.url + this.asset+"/" + archivo.nombre 

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

    obtenerSO(){
        this.so = this.DatosUsuario.so;
    }

    returnPathFile(link, file){
            return this.DatosUsuario.url+this.asset+"/"+file;
    }

    irNotificaciones()
    {
        this.navCtlr.push(NotificacionesPage, {DatosUsuario: this.DatosUsuario});
    }

}