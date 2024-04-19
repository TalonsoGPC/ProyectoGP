import { Component, ViewChild } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { ModalController, NavController, AlertController, ActionSheetController, ToastController, Platform, LoadingController, Loading, NavParams }  from "ionic-angular";
import { DomSanitizer } from "@angular/platform-browser";

/*Objetos nativos para ionic*/
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer";
import { File }  from "@ionic-native/file";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {  MediaCapture, MediaFile, CaptureError, CaptureVideoOptions, CaptureAudioOptions } from '@ionic-native/media-capture';
import { Documentos } from "../../services/documentos";
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { SocialSharing } from '@ionic-native/social-sharing';
import {IOSFilePicker} from '@ionic-native/file-picker';
import {FileChooser} from '@ionic-native/file-chooser';
import {NotificacionesPage} from "../notificaciones/notificaciones";

//Obejtos Generales
import { DatosAPP } from "../../services/datosApp";
import {wbs} from "../../services/wbs";
import {Proyectos} from "../../services/proyectos";
import {OrdenCompraPorRecibir}from "../../services/OrdenComprasPorRecibir";
import {InsumosPorRecibir} from "../../services/InsumosPorRecibir";
import { ConstructorService }  from '../../services/serviciosConstructor';
import { al_recepcion }  from '../../services/al_recepcion';
import { al_det_recepcion }  from '../../services/al_det_recepcion';

@Component({
    selector: "alrecepciones-page",
    templateUrl: "AlRecepciones.html"
})

export class AlRecepcionesPage{
    
    so: string;
    db: string;
    asset: string;
    DatosUsuario: DatosAPP;
    formEnc: FormGroup;
    formDet: FormGroup[] = [];
    listaProyectos: Proyectos[];
    Nuevo : number;
    id: number;
    recepcion: al_recepcion[] = [];
    detalle: al_det_recepcion[] = [];

    constructor(private fb: FormBuilder, private servicioGP:ConstructorService, private navparams:NavParams ){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.Nuevo = this.navparams.get("Nuevo");
        this.db = this.DatosUsuario.db;

        if(this.Nuevo == 1){

        }else{
            this.obtenerRecepcion();
            this.obtenerRecepcionDetalle();
        }

        this.cargarProyectos();
        this.crearModelo();

    }

    obtenerRecepcion(){
        this.servicioGP.getDatos("almacen/recepcion/"+this.db+"/"+this.id.toString(), this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.recepcion = rs,          
            er => console.log(er)
        )
    }

    obtenerRecepcionDetalle(){
        this.servicioGP.getDatos("almacen/detRecepcion/"+this.db+"/"+this.id.toString(), this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.detalle = rs,          
            er => console.log(er)
        )
    }

    crearModelo(){

        let li_contador: number;
        li_contador = 1;

        if(this.Nuevo==1){
            this.formEnc = this.fb.group({
                id: [],
                proyecto: [],
                wbs: [],
                numorden: [],
                monto: [],
                fecha:[]
            })
    
            this.formDet[1] = this.fb.group({
                id: [],
                cveinsumo: [],
                unidad: [],
                descripcion: [],
                cantidad: [],
                precio: []
            })
        }else{

            this.formEnc = this.fb.group({
                id: [this.recepcion[1].id],
                proyecto: [this.recepcion[1].proyecto],
                wbs: [this.recepcion[1].numproy],
                numorden: [this.recepcion[1].numorden],
                monto: [this.recepcion[1].monto],
                fecha:[this.recepcion[1].fecha_recepcion]
            });
            
            this.detalle.forEach(element => {
                this.formDet[li_contador] = this.fb.group({
                    id_recepcion: [element.id_recepcion],
                    numrequisicion: [element.numrequisicion],
                    numorden: [element.numorden],
                    numproy: [element.numproy],
                    cveinsumo: [element.cveinsumo],
                    nombre: [element.nombre],
                    unidad: [element.unidad],
                    cantidad: [element.cantidad],
                    precio: [element.precio],
                    descuento: [element.descuento],
                    imagen: [element.imagen]
                })
                li_contador++;
            });

        
        }

       

    }

    obtenerOrdenesCompra(){}
    obtenerInsumos(){}
    obtenerWbs(){}

    cargarProyectos(){
        this.servicioGP.getDatos("proyectos/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaProyectos = rs,          
            er => console.log(er)
        )
    }

    cargarWBS(){
        this.servicioGP.getDatos("wbs/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto
    )
        .subscribe(  
            rs=>this.listaProyectos = rs,          
            er => console.log(er)
        )
    }

    deshabiltarCampo(){

    }
}