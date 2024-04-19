import { Component, ViewChild } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { ModalController, NavController, AlertController, ActionSheetController, ToastController, Platform, LoadingController, Loading, NavParams }  from "ionic-angular";
import { DomSanitizer } from "@angular/platform-browser";

/*Constructor Objetos y Paginas*/
import { ConstructorService }  from '../../services/serviciosConstructor';
import { Proyectos }  from '../../services/proyectos';
import { Temas }  from '../../services/temas';
import { Proveedores }  from '../../services/proveedores';
import { Responsables }  from '../../services/responsables';
import { Estatus }  from '../../services/estatus';
import { Usuarios }  from '../../services/usuarios';
import { ArchivosMensajes } from "../../services/archivosmensajes";
import { Tareas }  from '../../services/tareas';
import { AutBossPage } from "../autBoss/autBoss";
import { FileBrowserPage } from "../fileBrowser/fileBrowser";
import { AlertasPage } from "../alertas/alertas";
import { AlertasDetallePage } from "../alertasdetalle/alertasdetalle";
import { Alertas }  from '../../services/alertas';
import { TiposEmpresa }  from '../../services/tiposempresa';
import { DocumentosProyectosPage } from "../documentosProyectos/documentosProyectos";
import { TiposReportesBossPage } from "../tiposReportesBoss/tiposReportesBoss";
import { Moneda } from "../../services/moneda";
import { MenuBossPage } from "../menuBoss/menuBoss";
import { ReportesProyectosPage }  from "../reportesProyectos/reportesProyectos";
import { BibliotecaDocumentosPage } from "../bibliotecaDocumentos/bibliotecaDocumentos";
import { DatosAPP } from "../../services/datosApp";
import { Notificaciones } from "../../services/notificaciones";

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



@Component({
    selector: "requisiciones-page",
    templateUrl: "requisiciones.html"
})

export class RequisicionesPage{
    idUsuarioActual: number;
    nombreUsuarioActual: string;
    retorno: any;
    listaArchivosMensajes: ArchivosMensajes[];
    filename: any;
    loading: Loading;
    mensaje: any;
    tema: number;
    estatus: number;
    form: FormGroup;
    listaTareas: Tareas[];
    listaProyectos: Proyectos[];
    listaTemas: Temas[];
    listaProveedores: Proveedores[];
    listaResponsables: Responsables[];
    listaEstatus: Estatus[];
    listaUsuarios: Usuarios[];
    titulo: string;
    razonSocial: string;
    color: string;
    color2 =  "#488aff";
    opcionBoton: string;
    opcionBoton2: string;
    accionBoton: string;
    fechaActual =  new Date();
    id: number;
    ls_return: boolean;
    cameraOptions: CameraOptions = {
        targetWidth: 500,
        targetHeight: 500,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    }
    ultimoProyecto: number;
    ultimoDocumento: number;
    usuarioDefault: number;
    autorizador: number;
    ultimoBeneficiario: number;
    tituloAut =  "Por autorizar";
    tituloFechaEstatus = "Fecha Autorización";
    descripcionTema: string;
    archivo: any;
    listaTiposEmpresa: TiposEmpresa[];
    campo_monto: number;
    campo_razonsocial: number;
    campo_semana:number
    campo_moneda: number;
    estatusMensaje: number;
    colorEstatus: string;
    tempImageList: any[]=[];
    tempVideoList: any[]=[];
    tempAudioList: any[]=[];
    listaMonedas: Moneda[];
    so: string;
    db: string;
    asset: string;
    DatosUsuario: DatosAPP;
    gp: boolean = false;
    optionsVideo: CaptureVideoOptions = {};
    optionAudio: CaptureAudioOptions = {};
    documentOption: DocumentViewerOptions;
    @ViewChild('myvideo') myvideo: any;
    deshabilitar: boolean = false;
    nuevo: boolean = true;

    constructor(private fb: FormBuilder, private servicio: ConstructorService, 
                private alertController: AlertController, private navparams:NavParams,
                private camera: Camera, public domSanitizer: DomSanitizer,
                public actionSheetCtlr: ActionSheetController, public toastCtlr: ToastController, public platform: Platform, 
                public transfer: FileTransfer, public loadingCtlr: LoadingController, public file: File,
                public navCtlr: NavController, private photoViewer: PhotoViewer,
                private modalController: ModalController, 
                private mediaCapture: MediaCapture, private documentViewer: DocumentViewer, private fileOpener: FileOpener, 
                private socialSharing: SocialSharing, private filePicker: IOSFilePicker, private fileChooser: FileChooser){
        
       this.DatosUsuario = this.navparams.get("DatosUsuario");
       this.db = this.DatosUsuario.db;
       this.asset = this.DatosUsuario.asset;
       this.so = "";
       this.idUsuarioActual = 0;
       this.nombreUsuarioActual = "";
       this.estatus = navparams.get("estatus");
       this.tema = navparams.get("tema");
       this.mensaje = navparams.get("mensaje");
       this.usuarioDefault = 2;
       this.autorizador = 2;
       this.campo_monto = 0;
       this.campo_razonsocial = 0;
       this.campo_semana = 0;
       this.campo_moneda = 1;
        
       this.cargarTareas();
       this.cargarMonedas();
       this.cargarTiposEmpresa();
       this.cargarProyectosUsuario();
       this.cargarProveedores();
       this.cargarResponsables();
       this.cargarEstatus();
       this.cargarUsuarios();
       this.cargarTemas();
       this.crearNuevo();

       this.estatusMensaje = 0;
             
        if(this.estatus == 1 || this.estatus == 2){
                this.opcionBoton =  "Editar";
                this.opcionBoton2 =  "Borrar";
                this.obtenerArchivos(this.mensaje.id);                
         }
         else if(this.estatus == 0){
                this.opcionBoton =  "Guardar"
                this.opcionBoton2 =  "Cancelar";
                this.campo_monto = 0;
                this.campo_razonsocial = 0;
                this.campo_semana = 0;
                this.obtenerUltimoProyecto();
                this.obtenerUltimoDocumento();
        }

        if(this.mensaje!=undefined && this.mensaje!=null){
                 this.deshabilitar = true;
                 if (this.mensaje.gp == 1){
                     this.gp = true;
                 } 

                if(this.mensaje.estatus==2){
                        this.estatusMensaje = 2;
                        this.tituloAut = "Por autorizar";
                }
                else if(this.mensaje.estatus==3){
                        this.estatusMensaje = 3;
                        this.tituloAut = "Autorizado por";
                        this.tituloFechaEstatus = "Fecha autorización";
                }else if(this.mensaje.estatus==4){
                        this.estatusMensaje = 4;
                        this.tituloAut = "Rechazado por";
                        this.tituloFechaEstatus = "Fecha rechazo";
                }
        }
    }

    cargarMonedas(){
         this.servicio.getDatos("monedas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto
        ).subscribe((rs)=>{
                this.listaMonedas = rs;
        },er=>console.log(er))
    }
    cargarTiposEmpresa(){
        this.servicio.getDatos("tiposempresa/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto
    ).subscribe((rs)=>{
                this.listaTiposEmpresa = rs;
        },er=>console.log(er))
    }

    crearNuevo(){
        if(this.estatus == 1 || this.estatus == 2){

            this.form = this.fb.group({
            id: [this.mensaje.id],
            tarea: [this.mensaje.tarea],
            numproy: [this.mensaje.numproy, Validators.required],
            tema: [this.mensaje.tema],
            numdocumento: [this.mensaje.numdocumento], //Validators.required, ValidarNoMensaje.valorUnico(this.servicio, this.mensaje.numproy, this.mensaje.tema)
            cliente: [this.mensaje.cliente],
            soporte: [this.mensaje.soporte],
            semana: [this.mensaje.semana],
            fecha_elab: [this.mensaje.fecha_elab],
            responsable: [this.mensaje.responsable],
            moneda: [this.mensaje.moneda],
            monto: [this.mensaje.monto],
            estatus: [this.mensaje.estatus],
            autorizado_por: [this.mensaje.autorizado_por],
            fecha_aut:[this.mensaje.fecha_aut],
            nota:[this.mensaje.nota],
            archivos: [this.mensaje.archivos]
        });
        this.nuevo = false;
        //this.form.disable();
        this.deshabilitar = false;
        this.tema = this.mensaje.tema;
        /*if(this.mensaje.estatus == 3){
                     this.tituloAut = "Autorizado por";
        }else  if(this.mensaje.estatus == 4){
                     this.tituloAut = "Rechazado por";
                     this.tituloFechaEstatus = "Fecha rechazo";
        }else{
             this.tituloAut = "Por autorizar";
        }*/
        //this.form.controls["numproy"].disable;
    }else{
        var temaId = 0
        if(this.tema == 0){
            temaId = null;
        }else{
            temaId = this.tema;
        }
        
        let fecha = this.fechaActualCadena();

        this.form = this.fb.group({
            tarea: [null],
            numproy: [null, Validators.required],
            tema: [temaId, Validators.required],
            numdocumento: [null, Validators.required], //, ValidarNoMensaje.valorUnico(this.servicio, this.form.controls["numproy"].value, this.form.controls["tema"].value)
            cliente: [null],
            soporte: [null],
            semana: [1],
            fecha_elab: [fecha],
            responsable: [this.DatosUsuario.id_usuario],
            moneda: ["MXN"],
            monto: [0],
            estatus: [1],
            autorizado_por: [null],
            fecha_aut:[null],
            nota:[""],
            archivos: [null]
        });

        this.nuevo = true;

        /*if(this.estatus == 2){
           this.tituloAut = "Autorizado por";
        } else{
           this.tituloAut = "Por autorizar"; 
        }*/
    }

    }

    cargarProyectos(){
        this.servicio.getDatos("proyectos/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto
    )
        .subscribe(  
            rs=>this.listaProyectos = rs,          
            er => console.log(er)
        )
    }

    cargarProyectosUsuario(){
        this.servicio.getDatos("proyectosUsuario/"+this.db+"/"+this.DatosUsuario.usuario, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto
    )
        .subscribe(  
            rs=>this.listaProyectos = rs,          
            er => console.log(er)
        )
    }

    cargarTemas(){
        this.servicio.getDatos("temas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto
    )
        .subscribe(  
            rs=>this.listaTemas = rs,          
            er => console.log(er),
            () => this.cambiarTitulo()
        )
    }

    cargarProveedores(){
        this.servicio.getDatos("proveedores/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto
    )
        .subscribe(  
            rs=>this.listaProveedores = rs,          
            er => console.log(er)
        )
    }

    cargarProveedoresTipo(tipo: number){

        if(tipo!=null && tipo!=undefined){
            this.servicio.getDatos("proveedoresTipo/"+this.db+"/"+tipo.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto
        )
            .subscribe(  
                rs=>{
                    this.listaProveedores = rs
                },          
                er => console.log(er)
            )
        }
        
    }

    cargarResponsables(){
        this.servicio.getDatos("usuarios/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto
    )
        .subscribe(  
            rs=>this.listaResponsables = rs,          
            er => console.log(er)
        )
    }
    
    cargarEstatus(){
        this.servicio.getDatos("estatus/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto
    )
        .subscribe(  
            rs=>{
                this.listaEstatus = rs,
                this.listaEstatus.forEach((element)=>{
                    if((this.mensaje!=undefined && this.mensaje!=null)){
                        if(this.mensaje.estatus == element.id){
                            this.colorEstatus = element.color;
                        }
                    }
                });
            
        },          
            er => console.log(er)
        )
    }

    cargarUsuarios(){
        this.servicio.getDatos("usuarios/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto
    )
        .subscribe(  
            rs=>this.listaUsuarios = rs,          
            er => console.log(er)
        )
    }


    cargarTareas(){
         this.servicio.filtroMensajes(this.tema, "tareas/tema/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto
        )
        .subscribe(  
            rs=>{
                this.listaTareas = rs;
                if(this.mensaje!=undefined && this.mensaje!=null){
                    this.listaTareas.forEach((element)=>{
                        if(element.tema==this.tema && element.id==this.mensaje.tarea){
                            this.campo_monto = element.campo_monto;
                            this.campo_razonsocial = element.campo_razonsocial;
                            this.campo_semana = element.campo_semana;
                            this.habiltarDatosTarea(this.mensaje.tarea);        
                        }
                    });
                }
                
            },          
            er => console.log(er)
        )
    }

    guardarMensaje(){
        
        if(this.estatus==0){
            if(this.mensaje != null) {
                
                if(this.mensaje.id != null && this.mensaje.id>0){
                    this.modificarMensaje();
                }else{
                        let fecha_elab = this.form.controls["fecha_elab"].value.toString().slice(0,10);    
                        this.form.controls["fecha_elab"].patchValue(fecha_elab);
                        this.form.controls["responsable"].patchValue(this.idUsuarioActual);

                        if(this.form.controls["fecha_aut"].value != null){
                            let fecha_aut = this.form.controls["fecha_aut"].value.toString().slice(0,10);
                            this.form.controls["fecha_aut"].patchValue(fecha_aut); 
                        }
                    
                    this.servicio.addRegistro("mensajes/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                    .subscribe(  
                    rs=>{
                        this.id = rs.insertId;

                        this.showAlert();
                        this.opcionBoton = "Editar";
                        this.estatus = 1;
                        this.opcionBoton2 =  "Borrar";
                        this.actualizarForm(this.id);

                        if(rs.insertId>0){

                            var notificacion : any = {}

                            notificacion.tipo = 4;
                            notificacion.id_proceso = rs.insertId;
                            notificacion.tema = this.form.controls["tema"].value;
                            notificacion.tarea = this.form.controls["tarea"].value;
                            notificacion.proyecto = this.form.controls["numproy"].value;
                            notificacion.monto = this.form.controls["monto"].value;
                            notificacion.responsable = this.DatosUsuario.nombre;
                            notificacion.responsableId = this.DatosUsuario.id_usuario;
                            notificacion.vendedor = 0;
                            notificacion.estatus = this.form.controls["estatus"].value;

                            if (this.listaArchivosMensajes != undefined){
                                if(this.listaArchivosMensajes.length > 0){
                                    notificacion.archivo = 1;
                                }else{
                                    notificacion.archivo = 0;
                                }
                            }else{
                                notificacion.archivo = 0; 
                            }
                            
                            
                            notificacion.notificado = 1;
                            notificacion.gp = 0;
                            notificacion.fecha = Notificaciones.obtenerFechaActual();

                            this.servicio.addRegistro("notificaciones/"+this.DatosUsuario.db+"/", notificacion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                            .subscribe(rs=>{
                                //console.log(rs);
                            }, err=>console.log(err))
                        }

                        /**++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
                        let aleatorio = Math.floor((Math.random()*1000) + 1);
                        

                        let nombreImagen = this.id.toString() + this.form.controls["tema"].value.toString() + 
                                           this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                                           aleatorio.toString();

                        for (var key in this.tempImageList) {
                            if (this.tempImageList.hasOwnProperty(key)) {
                                this.uploadImage(this.tempImageList[key].ruta, nombreImagen+"."+this.tempImageList[key].formato, nombreImagen+"."+this.tempImageList[key].formato, this.tempImageList[key].formato);
                                
                                aleatorio = Math.floor((Math.random()*1000) + 1);
                                nombreImagen = this.id.toString() + this.form.controls["tema"].value.toString() + 
                                               this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                                               aleatorio.toString();
                            }
                        }

                        this.tempImageList = [];

                        for( var key2 in this.tempVideoList){
                            if(this.tempVideoList.hasOwnProperty(key2)){
                                
                                this.uploadImage(this.tempVideoList[key2].ruta, nombreImagen+"."+this.tempVideoList[key2].formato, nombreImagen+"."+this.tempVideoList[key2].formato, this.tempVideoList[key2].formato);
                                
                                aleatorio = Math.floor((Math.random()*1000) + 1);
                                nombreImagen = this.id.toString() + this.form.controls["tema"].value.toString() + 
                                               this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                                               aleatorio.toString();    
                            }
                        }
                        
                        this.tempVideoList = [];

                        for( var key3 in this.tempAudioList){
                            if(this.tempAudioList.hasOwnProperty(key3)){
                                
                                this.uploadImage(this.tempAudioList[key3].ruta, nombreImagen+"."+this.tempAudioList[key3].formato, nombreImagen+"."+this.tempAudioList[key3].formato, this.tempAudioList[key3].formato);
                                
                                aleatorio = Math.floor((Math.random()*1000) + 1);
                                nombreImagen = this.id.toString() + this.form.controls["tema"].value.toString() + 
                                               this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                                               aleatorio.toString();    
                            }
                        }
                        
                        this.tempAudioList = [];
                    },          
                    er => console.log(er)
                    )
                    
                }
            }else{
                    
                    if(this.form.controls["fecha_elab"].value != null){
                         let fecha_elab = this.form.controls["fecha_elab"].value.toString().slice(0,10);    
                         this.form.controls["fecha_elab"].patchValue(fecha_elab);
                    }
                   
                    
                    if(this.form.controls["fecha_aut"].value != null){
                        let fecha_aut = this.form.controls["fecha_aut"].value.toString().slice(0,10);
                        this.form.controls["fecha_aut"].patchValue(fecha_aut); 
                    }
                this.servicio.addRegistro("mensajes/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                    .subscribe(  
                    rs=>{
                        this.id = rs.insertId;
                        this.showAlert();
                        this.opcionBoton = "Editar";
                        this.estatus = 1;
                        this.opcionBoton2 =  "Borrar";

                        this.actualizarForm(this.id);

                        if(rs.insertId>0){

                            var notificacion : any = {}

                            notificacion.tipo = 4;
                            notificacion.id_proceso = rs.insertId;
                            notificacion.tema = this.form.controls["tema"].value;
                            notificacion.tarea = this.form.controls["tarea"].value;
                            notificacion.proyecto = this.form.controls["numproy"].value;
                            notificacion.monto = this.form.controls["monto"].value;
                            notificacion.responsable = this.DatosUsuario.nombre;
                            notificacion.responsableId = this.DatosUsuario.id_usuario;
                            notificacion.vendedor = 0;
                            notificacion.estatus = this.form.controls["estatus"].value;

                            if(this.listaArchivosMensajes!=undefined){
                                if(this.listaArchivosMensajes.length > 0){
                                    notificacion.archivo = 1;
                                }else{
                                    notificacion.archivo = 0;
                                }
                            }else{
                                notificacion.archivo = 0;
                            }

                            
                            notificacion.notificado = 1;
                            notificacion.gp = 0;
                            notificacion.fecha = Notificaciones.obtenerFechaActual();

                            this.servicio.addRegistro("notificaciones/"+this.DatosUsuario.db+"/", notificacion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                            .subscribe(rs=>{
                                //console.log(rs);
                            }, err=>console.log(err))
                        }
                        /**++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
                        let aleatorio = Math.floor((Math.random()*1000) + 1);
                        

                        let nombreImagen = this.id.toString() + this.form.controls["tema"].value.toString() + 
                                           this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                                           aleatorio.toString();
                        
                        for (var key in this.tempImageList) {
                            if (this.tempImageList.hasOwnProperty(key)) {
                                this.uploadImage(this.tempImageList[key].ruta, nombreImagen+"."+this.tempImageList[key].formato, nombreImagen+"."+this.tempImageList[key].formato, this.tempImageList[key].formato);  
                                aleatorio = Math.floor((Math.random()*1000) + 1);
                                nombreImagen = this.id.toString() + this.form.controls["tema"].value.toString() + 
                                           this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                                           aleatorio.toString();
                            }
                        }

                        this.tempImageList = [];

                        for( var key2 in this.tempVideoList){
                            if(this.tempVideoList.hasOwnProperty(key2)){
                                this.uploadImage(this.tempVideoList[key2].ruta, nombreImagen+"."+this.tempVideoList[key2].formato, nombreImagen+"."+this.tempVideoList[key2].formato, this.tempVideoList[key2].formato);
                                
                                aleatorio = Math.floor((Math.random()*1000) + 1);
                                nombreImagen = this.id.toString() + this.form.controls["tema"].value.toString() + 
                                           this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                                           aleatorio.toString();    
                            }
                        }
                        
                        this.tempVideoList = [];

                        for( var key3 in this.tempAudioList){
                            if(this.tempAudioList.hasOwnProperty(key3)){
                                
                                this.uploadImage(this.tempAudioList[key3].ruta, nombreImagen+"."+this.tempAudioList[key3].formato, nombreImagen+"."+this.tempAudioList[key3].formato, this.tempAudioList[key3].formato);
                                
                                aleatorio = Math.floor((Math.random()*1000) + 1);
                                nombreImagen = this.id.toString() + this.form.controls["tema"].value.toString() + 
                                               this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                                               aleatorio.toString();    
                            }
                        }
                        
                        this.tempAudioList = [];

                    },          
                    er => console.log(er)
                    )
            }
         
        }else if(this.estatus==1){
            //this.form.enable();
            this.deshabilitar = false;
            
            
            if(this.mensaje!=undefined && this.mensaje!=null){
                if(this.mensaje.gp == 1){
                    //this.form.disable();
                    this.deshabilitar = true;
                }
            }

            this.opcionBoton = "Guardar";
            this.estatus = 0;
            this.opcionBoton2 =  "Cancelar";
        }
        
    }

    guardarArchivo(archivo: any){
        
        if(this.form.controls["fecha_elab"].value!=null){
            let fecha_elab = this.form.controls["fecha_elab"].value.toString().slice(0,10);    
            this.form.controls["fecha_elab"].patchValue(fecha_elab);
        }

        if(this.form.controls["fecha_aut"].value != null){
            let fecha_aut = this.form.controls["fecha_aut"].value.toString().slice(0,10);
            this.form.controls["fecha_aut"].patchValue(fecha_aut); 
        }
         this.servicio.addRegistro("mensajes/archivos/agregar/"+this.db+"/", archivo, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
            rs=>{
                this.obtenerArchivos(this.form.controls["id"].value);

                this.form.controls["archivos"].patchValue(1);
                this.servicio.putRegistro("mensajes/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                    .subscribe(  
                    rs=>{
                        this.presentToast("Se subio el archivo")

                        if(this.form.controls["id"].value > 0 && !this.nuevo){

                            var notificacion : any = {}

                            notificacion.tipo = 4;
                            notificacion.id_proceso = this.form.controls["id"].value;
                            notificacion.tema = this.form.controls["tema"].value;
                            notificacion.tarea = this.form.controls["tarea"].value;
                            notificacion.proyecto = this.form.controls["numproy"].value;
                            notificacion.monto = this.form.controls["monto"].value;
                            notificacion.responsable = this.DatosUsuario.nombre;
                            notificacion.responsableId = this.DatosUsuario.id_usuario;
                            notificacion.vendedor = 0;
                            notificacion.estatus = this.form.controls["estatus"].value;

                            if(this.listaArchivosMensajes!=undefined){
                                if(this.listaArchivosMensajes.length > 0){
                                    notificacion.archivo = 1;
                                }else{
                                    notificacion.archivo = 0;
                                }
                            }else{
                                notificacion.archivo = 0;
                            }
                            
                            notificacion.notificado = 1;
                            notificacion.gp = 0;
                            notificacion.fecha = Notificaciones.obtenerFechaActual();

                            this.servicio.addRegistro("notificaciones/"+this.DatosUsuario.db+"/", notificacion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                            .subscribe(rs=>{
                                //console.log(rs);
                            }, err=>console.log(err));
                        }
                       },          
                    er => console.log(er)
                    )
            },          
            er => console.log(er)
            )
    }

    obtenerArchivos(mensaje: number){
        let peticion = "mensajes/archivos/"+this.db+"/"
        this.servicio.filtroMensajes(mensaje, peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => {
                        this.listaArchivosMensajes = rs
                    },
                    er=>console.log(er)
        );
    }


    showAlert(){
        let alert = this.alertController.create({
            title: "",
            subTitle: "Los datos se guadaron correctamente",
            buttons: ["Ok"]
        });

        alert.present();
    }

    showAlertAut(opcion: number){
        let subTitulo = "Autorizado";

        if(opcion==1){
            subTitulo = "Autorizado";
        }else if(opcion==2){
            subTitulo = "No autorizado";
        }

        let alert = this.alertController.create({
            subTitle: subTitulo,
            buttons: ["Ok"]
        });

        alert.present();
    }

    cambiarTitulo(){
        if((this.tema > 0 || (this.estatus == 1 || this.estatus == 2) && this.mensaje.id > 0 )){
            for(var key in this.listaTemas){
                if((this.listaTemas[key].id == this.tema) || (this.mensaje!=null && this.listaTemas[key].id == this.mensaje.tema)){
                    this.titulo = this.listaTemas[key].nombre.toString();
                    this.color = this.listaTemas[key].color.toString();
                    this.descripcionTema = this.listaTemas[key].descripcion.toString();
                    
                    if(this.tema == 1 || this.tema == 2 || this.tema == 3 ){
                        this.razonSocial = "Proveedor";
                    }else if(this.tema == 4 || this.tema == 5 ){
                        this.razonSocial = "Contratistas";
                    }else if(this.tema == 6){
                        this.razonSocial = "Cliente";
                    }else{
                        this.razonSocial = "Razón Social";
                    }

                }
                
            }

        }else{
                this.titulo = "Control de Obra";
                this.razonSocial = "Razón Social";
                this.color = "#f53d3d";
        }
            
        this.listaTemas.forEach((element)=>{
            if(element.id == this.tema){
                this.listaTiposEmpresa.forEach((element2)=>{
                    if(element2.tipo==element.tipoempresa){
                        this.razonSocial = element2.descripcion;
                    }
                });
            }
        });
    }

    generarNuevo(){

        this.tempImageList.splice(0, this.tempImageList.length);
        this.tempVideoList.splice(0, this.tempVideoList.length);
        this.tempAudioList.splice(0, this.tempAudioList.length);

        if(this.listaArchivosMensajes != undefined){
            this.listaArchivosMensajes.splice(0, this.listaArchivosMensajes.length)
        }

        this.form.reset({onlySelf: true, emitEvent: true});
        //this.form.enable();
        this.deshabilitar = false;
       this.form.controls["numdocumento"].enable({onlySelf: true});
       this.form.controls["monto"].enable({onlySelf: true});

        if(this.mensaje!=undefined && this.mensaje!=null){
            this.mensaje.gp = 0;
            if(this.mensaje.gp == 1){
                //this.form.disable();
                this.deshabilitar = true;
            }
        }

        this.opcionBoton = "Guardar";
        this.estatus = 0;
        this.opcionBoton2 =  "Cancelar";
        this.tituloAut = "Por autorizar";
    }

    fechaActualCadena(){
        let fecha;

        fecha = this.fechaActual.getFullYear().toString();

        if((this.fechaActual.getMonth() + 1).toString().length<2){
            fecha = fecha + "-0"+ (this.fechaActual.getMonth() + 1).toString()
        }else{
            fecha = fecha + "-"+ (this.fechaActual.getMonth() + 1).toString()
        }

        if(this.fechaActual.getDate().toString().length<2){
            fecha = fecha + "-0"+ this.fechaActual.getDate().toString()
        }else{
            fecha = fecha + "-"+ this.fechaActual.getDate().toString()
        }
        return fecha;
    }

    modificarMensaje(){

        let fecha_elab = this.form.controls["fecha_elab"].value.toString().slice(0,10);    
        this.form.controls["fecha_elab"].patchValue(fecha_elab);
        

        if(this.form.controls["fecha_aut"].value != null){
            let fecha_aut = this.form.controls["fecha_aut"].value.toString().slice(0,10);
            this.form.controls["fecha_aut"].patchValue(fecha_aut); 
        }

        this.servicio.putRegistro("mensajes/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
            rs=>{
                this.showAlert()
                
                if(this.form.controls["id"].value > 0 && !this.nuevo){

                    var notificacion : any = {}

                    notificacion.tipo = 4;
                    notificacion.id_proceso = this.form.controls["id"].value;
                    notificacion.tema = this.form.controls["tema"].value;
                    notificacion.tarea = this.form.controls["tarea"].value;
                    notificacion.proyecto = this.form.controls["numproy"].value;
                    notificacion.monto = this.form.controls["monto"].value;
                    notificacion.responsable = this.DatosUsuario.nombre;
                    notificacion.responsableId = this.DatosUsuario.id_usuario;
                    notificacion.vendedor = 0;
                    notificacion.estatus = this.form.controls["estatus"].value;

                    if(this.listaArchivosMensajes!=undefined){
                        if(this.listaArchivosMensajes.length > 0){
                            notificacion.archivo = 1;
                        }else{
                            notificacion.archivo = 0;
                        }
                    }else{
                        notificacion.archivo = 0;
                    }
                    
                    notificacion.notificado = 1;
                    notificacion.gp = 0;
                    notificacion.fecha = Notificaciones.obtenerFechaActual();

                    this.servicio.addRegistro("notificaciones/"+this.DatosUsuario.db+"/", notificacion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                    .subscribe(rs=>{
                        //console.log(rs);
                    }, err=>console.log(err));
                }
            },          
            er => console.log(er)
            )
    }

    mandarAutorizar(){

        let alert = this.alertController.create();
        alert.setTitle("Solicitar Autorización");
        this.listaUsuarios.forEach(element => {
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.id.toString()+"-"+element.nombre
                });
            }); 
        
        alert.addButton("Cancelar");
        alert.addButton({
            text: "OK",
            handler: data => {

                var li_pos = data.indexOf("-");

                let id = parseInt(data.substring(0, li_pos));
                let nombre = data.substring(li_pos + 1);

                let fecha_elab = this.form.controls["fecha_elab"].value.toString().slice(0,10);    
                this.form.controls["fecha_elab"].patchValue(fecha_elab);
                this.form.controls["autorizado_por"].patchValue(id); 



                if(this.form.controls["fecha_aut"].value != null){
                    let fecha_aut = this.form.controls["fecha_aut"].value.toString().slice(0,10);
                    this.form.controls["fecha_aut"].patchValue(fecha_aut); 
                }

                this.form.controls["estatus"].patchValue(2);

                this.servicio.putRegistro("mensajes/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                    .subscribe(  
                    rs=>{
                        this.showAlert();

                        if(this.form.controls["id"].value > 0){

                            var notificacion : any = {}

                            notificacion.tipo = 2;
                            notificacion.id_proceso = this.form.controls["id"].value;
                            notificacion.tema = this.form.controls["tema"].value;
                            notificacion.tarea = this.form.controls["tarea"].value;
                            notificacion.proyecto = this.form.controls["numproy"].value;
                            notificacion.monto = this.form.controls["monto"].value;
                            notificacion.enviadoAId = this.form.controls["autorizado_por"].value;
                            notificacion.enviadoA = nombre;
                            notificacion.responsable = this.DatosUsuario.nombre;
                            notificacion.responsableId = this.DatosUsuario.id_usuario;
                            notificacion.vendedor = 0;
                            notificacion.estatus = this.form.controls["estatus"].value;

                            if(this.listaArchivosMensajes!=undefined){
                                if(this.listaArchivosMensajes.length > 0){
                                    notificacion.archivo = 1;
                                }else{
                                    notificacion.archivo = 0;
                                }
                            }else{
                                notificacion.archivo = 0;
                            }
                            
                            notificacion.notificado = 1;
                            notificacion.gp = 0;
                            notificacion.fecha = Notificaciones.obtenerFechaActual();

                            this.servicio.addRegistro("notificaciones/"+this.DatosUsuario.db+"/", notificacion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                            .subscribe(rs=>{
                                //console.log(rs);
                            }, err=>console.log(err));
                        }
                    },          
                    er => console.log(er)
                    )     
            }
        })

        alert.present();
    }

    autorizar(opcion: number){
        
        let fecha = this.fechaActualCadena();
        let fecha_elab = this.form.controls["fecha_elab"].value.toString();
        fecha_elab = fecha_elab.slice(0, 10);
        this.form.controls["fecha_elab"].patchValue(fecha);       

        if(opcion==1){
            this.form.controls["estatus"].patchValue("3");
        }else if(opcion==2){
            this.form.controls["estatus"].patchValue("4");
        }

        //this.form.controls["autorizado_por"].patchValue(1);
        this.form.controls["fecha_aut"].patchValue(fecha);
        this.servicio.putRegistro("mensajes/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
            rs=>{
                this.showAlertAut(opcion)
                
                if(this.form.controls["id"].value > 0){

                    var notificacion : any = {}

                    notificacion.tipo = 2;
                    notificacion.id_proceso = this.form.controls["id"].value;
                    notificacion.tema = this.form.controls["tema"].value;
                    notificacion.tarea = this.form.controls["tarea"].value;
                    notificacion.proyecto = this.form.controls["numproy"].value;
                    notificacion.monto = this.form.controls["monto"].value;
                    notificacion.responsable = this.DatosUsuario.nombre;
                    notificacion.responsableId = this.DatosUsuario.id_usuario;
                    notificacion.enviadoAId = this.form.controls["autorizado_por"].value;
                    notificacion.vendedor = 0;
                    notificacion.estatus = this.form.controls["estatus"].value;

                    if(this.listaArchivosMensajes!=undefined){
                        if(this.listaArchivosMensajes.length > 0){
                            notificacion.archivo = 1;
                        }else{
                            notificacion.archivo = 0;
                        }
                    }else{
                        notificacion.archivo = 0;
                    }
                    
                    notificacion.notificado = 1;
                    notificacion.gp = 0;
                    notificacion.fecha = Notificaciones.obtenerFechaActual();

                    this.servicio.addRegistro("notificaciones/"+this.DatosUsuario.db+"/", notificacion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                    .subscribe(rs=>{
                        //console.log(rs);
                    }, err=>console.log(err))
                }
            },          
            er => console.log(er))
    }
    //Cargar Imagenes
    public presentActionSheetCamara(){

        let actionSheet = this.actionSheetCtlr.create({
            title: "Seleccionar Imagen",
            buttons: [{
                text: "Desde la libreria",
                handler: ()=>{
                    if(this.mensaje!=undefined && this.mensaje!=null){
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }else{
                        this.takePicture2(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                    
                }
            },
            {
                text: 'Usar Camara',
                handler: ()=>{
                    if(this.mensaje!=undefined && this.mensaje!=null){
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }else{
                        this.takePicture2(this.camera.PictureSourceType.CAMERA);
                    }
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

     public presentActionSheetOpciones(){

        let actionSheet = this.actionSheetCtlr.create({
            title: "",
            cssClass: "action-sheets-basic-pages",
            buttons: [{
                text: 'Video',
                icon: "ios-videocam-outline",
                handler: ()=>{
                    if(this.mensaje!=undefined && this.mensaje!=null){
                        this.tomarVideo();
                    }else{
                        this.tomarVideoTemp();
                    }
                    
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

    public takePicture(sourceType){
        let aleatorio = Math.floor((Math.random()*100) + 1);

        var options = {
            sourceType: sourceType,
            destinationType: this.camera.DestinationType.FILE_URI,
            quality: 100,
            savetoPhotoAlbum: false,
            correctOrientation: true,
            encodingType: this.camera.EncodingType.JPEG
        };

        this.camera.getPicture(options).then((imageData)=>{
        
        if (imageData.length>0){
            let nombreImagen = this.form.controls["id"].value + this.form.controls["tema"].value.toString() + 
            this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                 aleatorio.toString() + ".jpg"
            this.uploadImage(imageData, nombreImagen, nombreImagen, "jpg");
        }    
           
        }, (err)=>{
            console.log("Error al seleccionar el archivo.");
        }); 
    }

    private presentToast(text){
        let toast = this.toastCtlr.create({
            message: text,
            duration: 3000,
            position: "middle"
        });
        toast.present();
    }

    public uploadImage(imagenRuta: string, imagenNombre: string, imagenNombreOriginal: string, formato: string){

        //var url = "http://142.4.197.18:8000/fileUpload/"+this.asset+"/";
        var url = this.DatosUsuario.url + "fileUpload/"+this.asset+"/";

        var options: FileUploadOptions = {
                fileKey: "file",
                fileName: imagenNombre
            }
        
        const fileTransfer: FileTransferObject = this.transfer.create();
        
        this.loading = this.loadingCtlr.create({
            content: "Subiendo  Archivo...",
        }); 

        this.loading.present();

        setTimeout(()=>{


        }, 60000)

        fileTransfer.upload(imagenRuta, url, options).then(data=>{
                this.loading.dismissAll();
                //this.presentToast("Se subio la imagen.");
               
                this.guardarArchivo({
                    mensaje: this.form.controls["id"].value,
                    nombre: imagenNombre,
                    nombreOriginal: imagenNombreOriginal,
                    formato: formato             
                 });
        },err=>{
                this.loading.dismissAll();
                this.presentToast("Error al subir el archivo.");
                
        });
       
    }

    public downloadFile(archivo: any){
        var directorio = "";

        if(this.DatosUsuario.so == "ios"){
            directorio = this.file.tempDirectory;
        }else if(this.DatosUsuario.so == "android"){
            directorio = this.file.externalDataDirectory;
        }else{
            directorio = this.file.tempDirectory;
        }
        
        //let url: string = "http://142.4.197.18:8000/" + this.asset + "/" + archivo.nombre 
        let url: string = this.DatosUsuario.url + this.asset + "/" + archivo.nombre 

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
                this.presentToast("Error al descargar el archivo");
            });
    }

    public compartirArchivo(archivo: any){
        var directorio = "";

        if(this.so == "ios"){
            directorio = this.file.tempDirectory;
        }else if(this.so == "android"){
            directorio = this.file.externalCacheDirectory;
        }else{
            directorio = this.file.cacheDirectory;
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

    abrirArchivo(rutaArchivo: string, formato: string){

        
        if(this.DatosUsuario.so == "android"){
            formato = 'application/'+formato;
        }

        this.fileOpener.open(rutaArchivo, formato)
        .then(() => console.log('File is opened'))
        .catch(e => this.presentToast("Formato no soportado:"+e.tostring()));

    }

    verRutaArchivos(){
        
        this.presentToast(this.file.applicationDirectory);
        this.file.listDir(this.file.documentsDirectory, "/")
        .then((files) => {
            this.retorno = files.toString();
        })
        .catch(e=>this.presentToast("error" + e))
    }

    borrarMensaje(){
        if(this.estatus!=0){
                let id = this.form.controls["id"].value.toString();
                let borrarAlert = this.alertController.create({
                    title: "Borrar Registro",
                    buttons: [{
                        text: "Cancelar",
                        handler: () =>{

                        }
                    }, {
                        text: "Borrar",
                        handler: ()=>{
                            if(id > 0) {
                                        this.servicio.delRegistro(id, "mensajes/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                                        rs=>{
                                            this.presentToast("Se elimino");
                                            this.deshabilitar = false;
                                            this.form.reset({onlySelf: true, emitEvent: true});
                                            //this.form.enable();
                                            if(this.mensaje!=undefined && this.mensaje!=null){
                                                if(this.mensaje.gp == 1){
                                                    //this.form.disable();
                                                    this.deshabilitar = true;
                                                }
                                            }
                                            this.opcionBoton = "Guardar";
                                            this.estatus = 0;
                                            this.opcionBoton2 =  "Cancelar";
                                            },
                                        er=>{
                                            this.presentToast("Error al borrar");
                                        } 
                                        )
                                    }
                        }
                    }]
                });
                borrarAlert.present();
        }else{
            //this.form.reset();
        }
    }

    verPorAut(){
         this.navCtlr.push(AutBossPage, {DatosUsuario: this.DatosUsuario});
    }

    validarDocumento(data):void{
        this.valDocto(data, this.form.controls["numproy"].value, this.form.controls["tema"].value)
    }

    valDocto(id: number, proyecto: number, tema: number){
        var peticion = "mensajes/documento/"+this.db+"/"+id.toString()+"/"+proyecto.toString()+"/"+tema.toString()+"/"
        let longitud: number;
        this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                longitud = rs.length;     
        }
        , 
        err=> console.log(err),
        ()=>{
            if(longitud>0){
                this.ls_return = true;
                this.presentToast("Ya existe No. Documento");
                this.form.controls["numdocumento"].patchValue(null);
            }else{
                this.ls_return = false;
            }
        })
    }

    actualizarForm(id: number){
        let peticion = "mensajes/id/"+this.db+"/"+id.toString()+"/";
        this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            this.mensaje = rs[0];
            //this.form.addControl("id", this.fb.control(1));
            //this.form.controls["id"].patchValue(this.mensaje[0].id);
        },
        err=>console.log(err));

        if(id>0){
            this.form.addControl("id", this.fb.control(1));
            this.form.controls["id"].patchValue(id);
        }
    }

    obtenerUltimoProyecto(){
        this.servicio.getDatos("ultimo/proyecto/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
            rs=>{

                if (rs.length>0){
                    this.ultimoProyecto = rs[0].numproy;
                        if(this.ultimoProyecto == null || this.ultimoProyecto == undefined){
                                this.ultimoProyecto = this.listaProyectos[0].numproy;
                                this.form.controls["numproy"].patchValue(this.ultimoProyecto);
                        }
                }

            },
            err=>console.log(err)
            );
    }

    obtenerUltimoDocumento(){
        let url = "ultimo/documento/"+this.db+"/"+this.form.controls["tema"].value+"/"+this.form.controls["numproy"].value+"/";
        this.servicio.getDatos(url, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            this.ultimoDocumento  = rs[0].documento;

            if(this.ultimoDocumento == null || this.ultimoDocumento == undefined){
                this.ultimoDocumento = 1;
            }

            this.form.controls["numdocumento"].patchValue(this.ultimoDocumento);
        }, 
        err=>console.log(err))
    }
    
   obtenerUltimoBeneficiario(){
        let url = "ultimo/beneficiario/"+this.db+"/"+this.form.controls["tema"].value+"/";
        this.servicio.getDatos(url, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            this.ultimoBeneficiario  = rs[0].cliente;
           
            if(this.ultimoBeneficiario == null || this.ultimoBeneficiario == undefined){
                this.ultimoBeneficiario = this.listaProveedores[0].id;
            }

            this.form.controls["cliente"].patchValue(this.ultimoBeneficiario);
        }, 
        err=>console.log(err))
    }
    
    imprimirParametro(parametro){
        this.obtenerUltimoDocumento();
    }


    borrarArchivo(archivo: ArchivosMensajes){

        let alerta = this.alertController.create({
            title: "¿Desea borrar el archivo?",
            buttons:[
                {
                  text: "Cancelar"
                },
                {
                    text: "Borrar",
                    handler: ()=>{
                            let url   = "mensaje/borrarArchivo/"+this.db+"/"+archivo.nombre.substring(0, archivo.nombre.lastIndexOf(".")) +"/"
                            this.servicio.delRegistro(archivo.mensaje, url, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                                this.presentToast("Se elimino el archivo");
                                this.obtenerArchivos(this.mensaje.id);
                                
                            },
                            err=>console.log(err))
                    }
                }
            ]
        })

        alerta.present();
        
    }

    imageFullSize(url, image){
        //var urlImage = url + this.asset + "/"+ image.nombre;
        var urlImage = this.DatosUsuario.url + this.asset + "/"+ image.nombre;
        this.photoViewer.show(urlImage, image.nombre, {share: true});
    }

    getFileBrowser(){
            //this.presentToast("En construcción");
            var formato  = ""
            let posicion: number;
            let buscadorArchivos = this.modalController.create(FileBrowserPage);
            buscadorArchivos.onDidDismiss((data)=>{
                if(data!=null){
                    this.archivo = data;
                    posicion = this.archivo.nombre.lastIndexOf(".");
                    formato = this.archivo.nombre.substring(posicion + 1);

                    this.uploadImage(this.archivo.nativeUrl, this.archivo.nombre, this.archivo.nombre, formato);
                }
                
            });
            buscadorArchivos.present();
    }

    irAlertas(){
        this.navCtlr.push(AlertasPage, {DatosUsuario: this.DatosUsuario});
    }

    generarAlerta(responsableId: number, responsableNombre: string){
        let alerta: Alertas;

        alerta = {
            id: null,
            mensaje: this.form.controls["id"].value,
            tema: this.tema,
            tipo: null,
            proyecto: this.form.controls["numproy"].value,
            asunto: null,
            fecha_alerta: null,
            monto: null,
            dias: null,
            fecha_documento: this.form.controls["fecha_elab"].value.slice(1,10),
            moneda: null,
            enviadoA: responsableNombre,
            enviadoAId: responsableId,
            enviadoPor: this.nombreUsuarioActual,
            enviadoPorId: this.DatosUsuario.id_usuario,
            numdocumento: this.form.controls["numdocumento"].value,
            nota: null,
            alerta: null,
            archivo: null,
            notificado: null,
            fecha: null,
            gp: null
        }
        
        
        if(this.mensaje == null || this.mensaje == undefined){

        let peticion = "mensajes/id/"+this.db+"/"+this.id.toString()+"/";
                this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                    this.mensaje = rs[0];
                            this.navCtlr.push(AlertasDetallePage, {
                                alerta: alerta,
                                nuevo: true,
                                documento: this.mensaje,
                                DatosUsuario: this.DatosUsuario
                            });
                },
                err=>console.log(err));
        }else{
               this.navCtlr.push(AlertasDetallePage, {
                                alerta: alerta,
                                nuevo: true,
                                documento: this.mensaje,
                                DatosUsuario: this.DatosUsuario
                            });
        }

        //Enviar Alerta Mensaje
         /*let generarAlerta = this.modalController.create(AlertasDetallePage, {
            alerta: alerta,
            nuevo: true,
            documento: this.mensaje
        });
         generarAlerta.present();*/
        
    }

      mandarAlerta(){

        let alert = this.alertController.create();
        alert.setTitle("Mandar Alerta");
        this.listaResponsables.forEach(element => {
                alert.addInput({
                    type: "radio",
                    label: element.nombre,
                    value: element.id.toString()
                });
            }); 
        
        alert.addButton("Cancelar");
        alert.addButton({
            text: "OK",
            handler: data=> {
                let nombre: string;
                let idUsuario: number;

                idUsuario = parseInt(data);

                this.servicio.getDatos("usuarios/"+this.db+"/"+idUsuario.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                    if(rs.length){
                        this.generarAlerta(idUsuario, rs[0].nombre);
                    }
                }, err=>console.log(err));

                /*this.listaResponsables.forEach((element)=>{
                    if(data == element.id.toString()){
                        nombre = element.nombre;
                    }
                });*/
                
                
            }
        })

        alert.present();
    }

    habiltarDatosTarea(tarea){
        this.listaTareas.forEach((element)=>{
            
            if(element.tema==this.tema && element.id==tarea){
                this.campo_monto = element.campo_monto;
                this.campo_razonsocial = element.campo_razonsocial;
                this.campo_semana = element.campo_semana;

                if(element.tipo_empresa!=null && element.tipo_empresa!= undefined){
                    this.cargarProveedoresTipo(element.tipo_empresa);
                
                    this.servicio.getDatos("tiposempresa/"+this.db+"/"+element.tipo_empresa.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                        if(rs.length >0){
                            this.razonSocial =  rs[0].descripcion;
                        }
                    }, err=>console.log(err));
                }
                
                
            }
        });

        
    }

    actualizarEstatus(parametro){
                let confirmar = this.alertController.create({
                    title: "¿Desea cambiar el estatus?",
                    message: "",
                    buttons:[
                        {
                            text: "Si",
                            handler: ()=>{
                                this.form.controls["estatus"].patchValue(event);
                                this.servicio.putRegistro("mensajes/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                                    .subscribe(  
                                    rs=>this.showAlertAut(1),          
                                    er => console.log(er)
                                    );
                            }
                        },{
                            text: "No"
                        }
                    ]
                });
        confirmar.present(); 
    }


    
    irDocumentos(){
        this.navCtlr.push(DocumentosProyectosPage, {DatosUsuario: this.DatosUsuario});
    }

    menuBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

    irReportesBoss(){
        this.navCtlr.push(ReportesProyectosPage, {DatosUsuario: this.DatosUsuario});
    }

    tomarVideo(){
        let aleatorio = Math.floor((Math.random()*100) + 1);
        let nombreImagen = this.form.controls["id"].value + this.form.controls["tema"].value.toString() + 
                           this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                           aleatorio.toString();

        this.mediaCapture.captureVideo(this.optionsVideo).then((data: MediaFile[])=>{
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                
                this.uploadImage(data[key].fullPath, nombreImagen+".mp4", nombreImagen+".mp4", "mp4");
                
            }
        }

       }, (err: CaptureError)=>console.log(err))
    }

    capturarAudio(){
        let aleatorio = Math.floor((Math.random()*100) + 1);
        let nombreImagen = this.form.controls["id"].value + this.form.controls["tema"].value.toString() + 
                           this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                           aleatorio.toString();
    
       
       this.mediaCapture.captureAudio(this.optionAudio).then((data: MediaFile[])=>{
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                
                this.uploadImage(data[key].fullPath, nombreImagen+".3gp", nombreImagen+".3gp", "3gp");
                
            }
        }

       }, (err: CaptureError)=>console.log(err))
    }

    tomarVideoTemp(){
        let aleatorio = Math.floor((Math.random()*1000) + 1);
        let nombreImagen = this.form.controls["tema"].value.toString() + 
                           this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                           aleatorio.toString()

       this.mediaCapture.captureVideo(this.optionsVideo).then((data: MediaFile[])=>{
           
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                this.tempVideoList.push({
                    ruta: data[key].fullPath,
                    nombre:  nombreImagen+".mp4",
                    formato: "mp4"
                });
                //this.uploadImage(data[key].fullPath, nombreImagen+".mp4", nombreImagen+".mp4", "mp4"); 
            }
        }

       }, (err: CaptureError)=>console.log(err))
    }

    tomarAudioTemp(){
        let aleatorio = Math.floor((Math.random()*1000) + 1);
        let nombreImagen = this.form.controls["tema"].value.toString() + 
                           this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                           aleatorio.toString()

       this.mediaCapture.captureAudio(this.optionsVideo).then((data: MediaFile[])=>{
           
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                this.tempAudioList.push({
                    ruta: data[key].fullPath,
                    nombre:  nombreImagen+".mp3",
                    formato: "mp3"
                });
                //this.uploadImage(data[key].fullPath, nombreImagen+".mp4", nombreImagen+".mp4", "mp4"); 
            }
        }

       }, (err: CaptureError)=>console.log(err))
    }

    selectvideo(){
        let video = this.myvideo.nativeElement;
        var options = {
            sourceType: 2,
            mediaType: 1
        }

        this.camera.getPicture(options).then((data)=>{
            video.src = data;
            video.play();
        })
    }

    public takePicture2(sourceType){

        let aleatorio = Math.floor((Math.random()*1000) + 1);

        var options = {
            sourceType: sourceType,
            destinationType: this.camera.DestinationType.FILE_URI,
            quality: 100,
            savetoPhotoAlbum: false,
            correctOrientation: true,
            encodingType: this.camera.EncodingType.JPEG
        };

        this.camera.getPicture(options).then((imageData)=>{
                
               if(imageData.length>0){
                    this.tempImageList.push({
                        ruta: imageData,
                        nombre:  aleatorio.toString() + ".jpg",
                        formato: "jpg"
                    });
                }
            }, (err)=>{
            this.presentToast("Error al seleccionar el archivo.");
        }); 
    }

    actualizarTema(param){
        this.servicio.filtroMensajes(param, "tareas/tema/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>{
                this.listaTareas = rs;
            },          
            er => console.log(er)
        )
    }

    subirVideos(){
        if(this.mensaje!=undefined && this.mensaje!=null){
            this.tomarVideo();
        }else{
            this.tomarVideoTemp();
        }
    }

    subirAudio(){
        if(this.mensaje!=undefined && this.mensaje!=null){
            this.capturarAudio();
        }else{
            this.tomarAudioTemp();
        }
    }

  obtenerIdUsuario(){
    this.idUsuarioActual = this.DatosUsuario.id_usuario;
    this.servicio.getDatos("usuarios/"+this.db+"/"+this.idUsuarioActual.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
        if(rs.length>0){
            this.nombreUsuarioActual = rs[0].nombre;
            this.form.controls["responsable"].patchValue(this.idUsuarioActual);
        }
    }, err=>console.log(err));
    }

    obtenerSO(){
        this.so = this.DatosUsuario.so;
    }

    soloLectura(){
        
        var retorno = true;
        return retorno;
    }

    returnPathFile(link, file){
            //return link+"/"+this.asset+"/"+file;
            return this.DatosUsuario.url + this.asset+"/"+file;
    }

    ligarDocumento(){

        if(this.form.controls["id"] == undefined){
             this.presentToast("Falta guardar el registro");
            return;
        }

        let numproy = this.form.controls["numproy"].value.toString();
        let tema  = this.form.controls["tema"].value.toString()
        let mensaje = this.form.controls["id"].value.toString()
        
        let documentos = this.modalController.create(BibliotecaDocumentosPage, {proyecto: numproy, tema: tema, mensaje: mensaje, DatosUsuario: this.DatosUsuario}  );
        documentos.onDidDismiss((data)=>{
                    if(data!=null){
                            let documentos: Documentos[] = [];
                            documentos = data;

                            if (documentos.length > 0 ){
                                documentos.forEach(element => {
                                    
                                     this.guardarArchivo({
                                            mensaje: this.form.controls["id"].value,
                                            nombre: element.nombre,
                                            nombreOriginal: element.nombre,
                                            formato: element.formato             
                                    })
                                });

                              this.obtenerArchivos(this.form.controls["id"].value);  
                            }
                        
                    }
                    
                });
                
        documentos.present();
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

    subirArchivo(){

        var tipo = "";
        var archivo = "";
        
       if (this.DatosUsuario.so == "ios"){
            this.filePicker.pickFile().then(uri=>{
                
                if(uri.length>0){
                    tipo = this.obtenerCadenaPorPosicionCaracter(".", uri);
                    archivo = this.obtenerCadenaPorPosicionCaracter("/", uri);
                    this.uploadImage(uri, archivo, archivo, tipo);
                }

            }).catch(err=>console.log(err))
        }else if (this.DatosUsuario.so == "android")
        {
            this.fileChooser.open().then(uri=>{
                if(uri.length>0){
                    tipo = this.obtenerCadenaPorPosicionCaracter(".", uri);
                    archivo = this.obtenerCadenaPorPosicionCaracter("/", uri);
                    this.uploadImage(uri, archivo, archivo, tipo);
                }
            })
            .catch(err=>console.log(err))
        }

    }

    obtenerCadenaPorPosicionCaracter(caracter: string, cadena: string){

        var posicion = cadena.indexOf(caracter);
        var posicion2 = 0;

        posicion2 = posicion;
            
        while (posicion>=0){
            posicion = cadena.indexOf(caracter, posicion2 + 1);
            
            if (posicion>0){
                posicion2 = posicion;
            }
        }

        return cadena.substring(posicion2+1);
        
    }

    irNotificaciones()
    {
        this.navCtlr.push(NotificacionesPage, {DatosUsuario: this.DatosUsuario});
    }

    crearNotificacion(notificacion: Notificaciones ){
        this.servicio.addRegistro("notificaciones/"+this.DatosUsuario.db + "/", notificacion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(rs=>{
            console.log(rs);
        }, err=>console.log(err));
    }

    deshabiltarCampo(parametro){
        return this.deshabilitar;
    }
}
