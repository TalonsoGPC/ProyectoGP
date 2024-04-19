import { Component } from "@angular/core";
import { DatosAPP } from "../../services/datosApp";
import { ConstructorService }  from '../../services/serviciosConstructor';    
import { Documentos } from "../../services/documentos";
import { NavParams, ToastController, LoadingController, Loading, ViewController, ActionSheetController } from "ionic-angular"
import {PhotoViewer} from "@ionic-native/photo-viewer";
import { File }  from "@ionic-native/file";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { FileOpener } from '@ionic-native/file-opener';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
    selector: "bibliotecaDocumentos-page",
    templateUrl: "bibliotecaDocumentos.html"
})


export class BibliotecaDocumentosPage{
    db: string;
    asset: string
    listaArchivos: Documentos[];
    numproy: number;
    tema: number;
    so: string;
    loading: Loading;
    selecion: boolean;
    listaSeleccionados: Documentos[] = [];
    DatosUsuario: DatosAPP;
    mensaje: number;

    constructor(private servicio: ConstructorService, private navparams: NavParams,
                private photoViewer: PhotoViewer, public loadingCtlr: LoadingController, public file: File,
                public toastCtlr: ToastController, public transfer: FileTransfer, private vctlr: ViewController,
                private fileOpener: FileOpener, private socialSharing: SocialSharing, public actionSheetCtlr: ActionSheetController){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.asset = this.DatosUsuario.asset;

        this.so = "";
        this.obtenerSO();
        this.numproy = this.navparams.get("proyecto");
        this.tema = this.navparams.get("tema");
        this.mensaje = this.navparams.get("mensaje");
        this.cargarArchivosProyectoMensaje();
        
    }

    cargarArchivos(){
        this.servicio.getDatos("documentosGPFiltro/"+this.db+"/"+this.numproy.toString()+"/"+this.tema.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaArchivos = rs;
        }, (er)=>console.log(er));
        
    }

    cargarArchivosProyecto(){
        this.servicio.getDatos("obtenerDocumentosGPProyecto/"+this.db+"/"+this.numproy.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaArchivos = rs;
        }, (er)=>console.log(er));
        
    }

    cargarArchivosProyectoMensaje(){
        this.servicio.getDatos("documentosGPFiltroMensaje/"+this.db+"/"+this.numproy.toString()+"/"+this.mensaje.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaArchivos = rs;
        }, (er)=>console.log(er));
        
    }

    returnPathFile(link, file){
            //return link+"/"+this.asset+"/"+file;
            return this.DatosUsuario.url+this.asset+"/"+file;
    }

    ampliarImagen(url, image){
        //var urlImage = url + this.asset + "/" + image.nombre;
        var urlImage = this.DatosUsuario.url + this.asset + "/" + image.nombre;
        this.photoViewer.show(urlImage, image.nombre);
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

    aceptar(documento){
        this.vctlr.dismiss(this.listaSeleccionados);
    }

    cancelar(){
        let data = {archivo: null}
        this.vctlr.dismiss(data);
    }

    seleccionDocto(docto: Documentos, seleccion){
        let lb_agregar: boolean;

        lb_agregar = true;

            for (var index = 0; index < this.listaSeleccionados.length; index++) {
                if (this.listaSeleccionados[index].nombre == docto.nombre){
                    this.listaSeleccionados.splice(index, 1)
                    lb_agregar = false
                    break;
                }
            }
            
            if (lb_agregar){
                this.listaSeleccionados.push(docto);
            }
        //console.log(this.listaSeleccionados)

    }
}