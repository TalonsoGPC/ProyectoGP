/* Ionic */
import { Component } from "@angular/core"; 
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";
import {  NavController, AlertController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading }  from "ionic-angular";
import { DomSanitizer } from "@angular/platform-browser";

/* Constructor */
import {NotificacionesPage} from "../notificaciones/notificaciones";
import { ConstructorService } from "../../services/serviciosConstructor";
import { TemasVentas }  from '../../services/temasVentas';
import { Proyectos } from "../../services/proyectos";
import { Usuarios } from "../../services/usuarios";
import { VeCliente } from "../../services/veCliente";
import { VeEstatus } from "../../services/veEstatus";
import { VeEstatusVentas } from "../../services/veEstatusVentas";
import { VeFormaPago } from "../../services/veFormaPago";
import { VeNotario } from "../../services/veNotario";
import { VePropiedad } from "../../services/vePropiedad";
import { VeTipoCredito } from "../../services/veTipoCredito";
import { VeTipoOperacion } from "../../services/veTipoOperacion";
import { VeTipoPropiedad } from "../../services/veTipoPropiedad";
import { VeVendedores } from "../../services/veVendedores";
import { VeArchivosMensajes } from "../../services/veArchivosMensajes";
import { MenuBossPage } from "../menuBoss/menuBoss";
import { Notificaciones } from "../../services/notificaciones"
/* Native */
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer";
import { File }  from "@ionic-native/file";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {  MediaCapture, MediaFile, CaptureError, CaptureVideoOptions, CaptureAudioOptions } from '@ionic-native/media-capture';
import { DatosAPP } from "../../services/datosApp";
import { FileOpener } from '@ionic-native/file-opener';
import { SocialSharing } from '@ionic-native/social-sharing';
import {IOSFilePicker} from '@ionic-native/file-picker';
import {FileChooser} from '@ionic-native/file-chooser';

@Component({
    selector: "veMensajesUsuarios-page",
    templateUrl: "veMensajesUsuarios.html"
})


export class VeMensajesUsuariosPage{
    cameraOptions: CameraOptions = {
        targetWidth: 500,
        targetHeight: 500,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    }
    fechaActual =  new Date();;
    titulo: string;
    tema: any;
    temaParametro: number;
    colorLabel: "#488aff";
    tituloMensajesUsuario: string;
    nuevoRegistro: boolean;
    ultimoProyecto: number;
    mensaje: any;
    form: FormGroup;
    textoBotonGuardar: string;
    textoBotonBorrar: string;
    listaTemas: TemasVentas[];
    listaProyectos: Proyectos[];
    listaVendedores: VeVendedores[];
    listaClientes: VeCliente[];
    listaTipoPropiedad: VeTipoPropiedad[];
    listaTipoOperacion: VeTipoOperacion[];
    listaTiposCredito: VeTipoCredito[];
    listaFormasPago: VeFormaPago[];
    listaNotarios: VeNotario[];
    listaPropiedades: VePropiedad[];
    listaEstatus: VeEstatus[];
    listaEstatusVentas: VeEstatusVentas[];
    listaUsuarios: Usuarios[];
    listaArchivosMensajes: VeArchivosMensajes[];
    loading: Loading;
    proyectosAlert: AlertController;
    formaPago: number;
    tempImageList: any[]=[];
    tempVideoList: any[]=[];
    tempAudioList: any[]=[];
    mssError: string;
    listaPropiedadesProyecto: any[]=[];
    //filtroGeneral: number;
    mostrarCamposVacios: boolean;
    temaSecundario: number; 
    so: string;
    db: string;
    asset: string;
    DatosUsuario: DatosAPP;
    optionsVideo: CaptureVideoOptions = {};
    optionsAudio: CaptureAudioOptions = {};
    parametro: number;
    gp: boolean = false;
    nuevo: boolean = true;

    constructor(private navCtlr: NavController, private navparams: NavParams, private servicio: ConstructorService, private fb: FormBuilder, 
                private alertController: AlertController, private camera: Camera, public domSanitizer: DomSanitizer,
                public actionSheetCtlr: ActionSheetController, public toastCtlr: ToastController, public platform: Platform, 
                public transfer: FileTransfer, public loadingCtlr: LoadingController, public file: File,
                private photoViewer: PhotoViewer, private mediaCapture: MediaCapture,
                private fileOpener: FileOpener, private socialSharing: SocialSharing, private filePicker: IOSFilePicker, private fileChooser: FileChooser){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.asset = this.DatosUsuario.asset;
        this.parametro = this.navparams.get("parametro");
                    
        this.so = "";
        this.obtenerSO();
        this.mostrarCamposVacios = false;
        this.mssError = "";
        this.colorLabel = "#488aff";
        this.tema = this.navparams.get("tema");
        this.temaParametro = this.navparams.get("temaParametro");
        this.mensaje = this.navparams.get("mensaje");

        this.temaSecundario = this.navparams.get("temaSecundario");
        
        //this.filtroGeneral = this.navparams.get("filtroGeneral");

        this.ultimoProyecto = 0;
        this.formaPago = 0;
        
        if(this.tema!=null && this.tema!=undefined){
            this.titulo = this.tema.descripcion;
        }else{
            this.titulo = "Ventas"
        }

        /* Valido si es nuevo el registro o es uno ya existente */
        if(this.mensaje!=null && this.mensaje!=undefined){
            this.gp = this.mensaje.gp;
            this.nuevoRegistro = false;
            this.textoBotonGuardar = "Editar";
            this.textoBotonBorrar = "Borrar";
            this.formaPago = this.mensaje.forma_pago;
            this.obtenerListaPropiedades(this.mensaje.proyecto);
            this.mostrarCamposVacios = false;
        }else{
            this.mostrarCamposVacios = true;
            this.nuevoRegistro = true;
            this.textoBotonGuardar = "Guardar";
            this.textoBotonBorrar = "Cancelar";
        }
        
        /* Carga de Catalogos */
        this.cargarTemasVentas();
        this.cargarProyecto();
        this.cargarVendedores();
        this.cargarCliente();
        this.cargarTipoPropiedad();
        this.cargarTipoOperacion();
        this.cargarTipoCredito();
        this.cargarFormaPago();
        this.cargarNotario();
        this.cargarPropiedad();
        this.cargarEstatus();
        this.cargarEstatusVentas();
        this.cargarUsuarios();
        this.cargarArchivosMensaje();
        this.crearForma();
                        
        if(this.mensaje!=null && this.mensaje!=undefined){
            if(this.mensaje.proyecto!=null && this.mensaje.proyecto!=undefined){
                    this.obtenerTipoModeloProyecto(this.mensaje.proyecto);
            }
        }

        
    }

    cargarTemasVentas(){
        this.servicio.getDatos("temasVentas/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTemas = rs;
        }, (er)=>console.log(er))
    }

    cargarProyecto(){
        this.servicio.getDatos("proyectos/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaProyectos = rs;
         }, (er)=>console.log(er))
    }

    cargarVendedores(){
        this.servicio.getDatos("veVendedores/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaVendedores = rs;
        }, (er)=>console.log(er))
    }

    cargarCliente(){
        this.servicio.getDatos("veClientes/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaClientes = rs;
        }, (er)=>console.log(er))
    }

    cargarTipoPropiedad(){
        this.servicio.getDatos("veTipoPropiedad/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTipoPropiedad = rs;
        }, (er)=>console.log(er))
    }
    
    cargarTipoOperacion(){
        this.servicio.getDatos("veTipoOperacion/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTipoOperacion = rs;
        }, (er)=>console.log(er))
    }

    cargarTipoCredito(){
        this.servicio.getDatos("veTipoCredito/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTiposCredito = rs;
        }, (er)=>console.log(er))
    }

    cargarFormaPago(){
        this.servicio.getDatos("veFormaPago/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaFormasPago = rs;
        }, (er)=>console.log(er))
    }

    cargarNotario(){
        this.servicio.getDatos("veNotario/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaNotarios = rs;
        }, (er)=>console.log(er))
    }

    cargarPropiedad(){
        this.servicio.getDatos("vePropiedad/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaPropiedades = rs;
        }, (er)=>console.log(er))
    }

    cargarEstatus(){
        this.servicio.getDatos("ventasEstatus/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaEstatus = rs;
        }, (er)=>console.log(er))
    }

    cargarEstatusVentas(){
        this.servicio.getDatos("veEstatusVentas/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaEstatusVentas = rs;
        }, (er)=>console.log(er))
    }

    cargarUsuarios(){
        this.servicio.getDatos("usuarios/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaUsuarios = rs;
        }, (er)=>console.log(er))
    }

    cargarArchivosMensaje(){
        if(this.mensaje!=null && this.mensaje!=null){
            this.obtenerArchivos(this.mensaje.id)
        }
    }
    
    crearForma(){
        /*Creo la estructura del form o del mensaje*/
        if(this.nuevoRegistro){
            this.form = this.fb.group({
                                tema: [this.tema.id],
                                no_transaccion: [null],
                                fecha_registro:  [this.fechaActualCadena()],
                                semana:  [null],
                                vendedor: [null],
                                proyecto: [null, Validators.required],
                                cliente: [null],
                                telefono: [null],
                                email: [null],
                                no_ine: [null],
                                no_imss: [null],
                                no_infonavit: [null],
                                no_foviste: [null],
                                tipo_propiedad: [null],
                                tipo_operacion: [null],
                                tipo_credito: [null],
                                forma_pago: [null],
                                institucion_credito: [null],
                                notario: [null],
                                propiedad: [null],
                                modelo_propiedad: [null, Validators.required],
                                ubicacion_propiedad: [null],
                                especificaciones_propiedad: [null],
                                precio: [null],
                                avance_construccion: [null],
                                monto_anticipo: [null],
                                monto_cobrado: [null],
                                fecha_entrega: [null],
                                meses_garantia: [null],
                                costo_mtto: [null],
                                estatus: [null],
                                estatus_ventas: [null],
                                meses_contrato: [null],
                                dias_pago: [null],
                                no_pago: [null],
                                nota: [null],
                                autorizado_por: [null],
                                fecha_autorizacion: [null],
                                responsable: [this.DatosUsuario.id_usuario],
                                archivos: [null],
                                gp: [null]
                        });
                        this.nuevo = true;
                        this.nuevoRegistro = true;
                        this.textoBotonGuardar = "Guardar";
                        this.textoBotonBorrar = "Cancelar";   
            }else{
                        this.form = this.fb.group({
                                id:[this.mensaje.id], 
                                tema: [this.mensaje.tema],
                                no_transaccion: [this.mensaje.no_transaccion],
                                fecha_registro:  [this.mensaje.fecha_registro],
                                semana:  [this.mensaje.semana],
                                vendedor: [this.mensaje.vendedor],
                                proyecto: [this.mensaje.proyecto],
                                cliente: [this.mensaje.cliente],
                                telefono: [this.mensaje.telefono],
                                email: [this.mensaje.email],
                                no_ine: [this.mensaje.no_ine],
                                no_imss: [this.mensaje.no_imss],
                                no_infonavit: [this.mensaje.no_infonavit],
                                no_foviste: [this.mensaje.no_foviste],
                                tipo_propiedad: [this.mensaje.tipo_propiedad],
                                tipo_operacion: [this.mensaje.tipo_operacion],
                                tipo_credito: [this.mensaje.tipo_credito],
                                forma_pago: [this.mensaje.forma_pago],
                                institucion_credito: [this.mensaje.institucion_credito],
                                notario: [this.mensaje.notario],
                                propiedad: [this.mensaje.propiedad, Validators.required],
                                modelo_propiedad: [this.mensaje.modelo_propiedad],
                                ubicacion_propiedad: [this.mensaje.ubicacion_propiedad],
                                especificaciones_propiedad: [this.mensaje.especificaciones_propiedad],
                                precio: [this.mensaje.precio],
                                avance_construccion: [this.mensaje.avance_construccion],
                                monto_anticipo: [this.mensaje.monto_anticipo],
                                monto_cobrado: [this.mensaje.monto_cobrado],
                                fecha_entrega: [this.mensaje.fecha_entrega],
                                meses_garantia: [this.mensaje.meses_garantia],
                                costo_mtto: [this.mensaje.costo_mtto],
                                estatus: [this.mensaje.estatus],
                                estatus_ventas: [this.mensaje.estatus_ventas],
                                meses_contrato: [this.mensaje.meses_contrato],
                                dias_pago: [this.mensaje.dias_pago],
                                no_pago: [this.mensaje.no_pago],
                                nota: [this.mensaje.nota],
                                autorizado_por: [this.mensaje.autorizado_por],
                                fecha_autorizacion: [this.mensaje.fecha_autorizacion],
                                responsable: [this.mensaje.responsable],
                                archivos: [this.mensaje.archivos],
                                gp: [this.mensaje.gp]
                        });
                        this.nuevo = false;
                        this.form.disable();
                        this.nuevoRegistro = false;
                        this.textoBotonGuardar = "Editar";
                        this.textoBotonBorrar = "Borrar";  
            }

            if(this.mensaje!=undefined && this.mensaje!=null){
                if(this.mensaje.gp == 1){
                    this.gp = true
                    this.form.disable();
                }else{
                    this.gp = false
                }
            }
    }

    actualizarMensajes(){
        if(this.nuevoRegistro){
            this.servicio.addRegistro("ventasMensajes/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                
                //this.form.reset();
                this.presentToast("Los datos se guadaron correctamente");
                this.form.addControl("id", this.fb.control(1));
                this.form.controls["id"].patchValue(rs.insertId);

                if(rs.insertId > 0){

                    var notificacion : any = {}

                    if (this.parametro == 2 ){
                        notificacion.tipo = 6;
                    } else{
                        notificacion.tipo = 5;
                    }

                    
                    notificacion.id_proceso = this.form.controls["id"].value;
                    notificacion.tema = this.form.controls["tema"].value;
                    notificacion.tarea = 0;
                    notificacion.proyecto = this.form.controls["proyecto"].value;
                    notificacion.monto = this.form.controls["precio"].value;
                    
                    if (this.form.controls["tema"].value!= 1 || this.form.controls["tema"].value!= 2){

                        if( notificacion.monto = this.form.controls["monto_anticipo"].value>0)
                        {
                            notificacion.monto = this.form.controls["monto_anticipo"].value;
    
                        }else if( notificacion.monto = this.form.controls["monto_cobrado"].value>0)
                        {
                            notificacion.monto = this.form.controls["monto_cobrado"].value;
    
                        }else if( notificacion.monto = this.form.controls["costo_mtto"].value>0)
                        {
                            notificacion.monto = this.form.controls["costo_mtto"].value;
                        }
                    }

                    notificacion.responsable = this.DatosUsuario.nombre;
                    notificacion.responsableId = this.DatosUsuario.id_usuario;
                    notificacion.enviadoAId = this.form.controls["autorizado_por"].value;
                    notificacion.vendedor = this.form.controls["vendedor"].value;
                    


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


                this.nuevoRegistro = false;
                this.textoBotonGuardar = "Guardar";
                this.textoBotonBorrar = "Cancelar"; 
                
                /**++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
                let aleatorio = Math.floor((Math.random()*1000) + 1);
                let nombreImagen = rs.insertId.toString() + this.form.controls["tema"].value.toString() + 
                                   this.form.controls["proyecto"].value.toString()  + aleatorio.toString();
                
                for (var key in this.tempImageList) {
                    if (this.tempImageList.hasOwnProperty(key)) {
                            this.uploadImage(this.tempImageList[key].ruta, nombreImagen+"."+this.tempImageList[key].formato, this.tempImageList[key].formato); 
                            aleatorio = Math.floor((Math.random()*1000) + 1);
                            nombreImagen = rs.insertId.toString() + this.form.controls["tema"].value.toString() + 
                                           this.form.controls["proyecto"].value.toString()  + aleatorio.toString();                     
                    }
                }

                this.tempImageList = [];

                for (var key2 in this.tempVideoList) {
                    if (this.tempVideoList.hasOwnProperty(key2)) {
                            this.uploadImage(this.tempVideoList[key2].ruta, nombreImagen+"."+this.tempVideoList[key2].formato, this.tempVideoList[key2].formato); 
                            aleatorio = Math.floor((Math.random()*1000) + 1);
                            nombreImagen = rs.insertId.toString() + this.form.controls["tema"].value.toString() + 
                                           this.form.controls["proyecto"].value.toString()  + aleatorio.toString();                     
                    }
                }

                this.tempVideoList = [];

                for (var key3 in this.tempAudioList) {
                    if (this.tempAudioList.hasOwnProperty(key3)) {
                            this.uploadImage(this.tempAudioList[key3].ruta, nombreImagen+"."+this.tempAudioList[key3].formato, this.tempAudioList[key3].formato); 
                            aleatorio = Math.floor((Math.random()*1000) + 1);
                            nombreImagen = rs.insertId.toString() + this.form.controls["tema"].value.toString() + 
                                           this.form.controls["proyecto"].value.toString()  + aleatorio.toString();                     
                    }
                }

                this.tempAudioList = [];

            }, (err)=>console.log(err))
        }else if(this.textoBotonGuardar == "Guardar" && !this.nuevoRegistro){
            let fecha_elab: any;
            if(this.form.controls["fecha_registro"].value != null){
                fecha_elab = this.form.controls["fecha_registro"].value.toString().slice(0,10);    
                this.form.controls["fecha_registro"].patchValue(fecha_elab);
            }

            if(this.form.controls["fecha_entrega"].value != null){
                fecha_elab = this.form.controls["fecha_entrega"].value.toString().slice(0,10);    
                this.form.controls["fecha_entrega"].patchValue(fecha_elab);
            }

            if(this.form.controls["fecha_autorizacion"].value != null){
                fecha_elab = this.form.controls["fecha_autorizacion"].value.toString().slice(0,10);    
                this.form.controls["fecha_autorizacion"].patchValue(fecha_elab);
            }

            this.servicio.putRegistro("ventasMensajes/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                    this.presentToast("Los datos se guadaron correctamente");
                    this.nuevoRegistro = false;
                    this.form.disable();
                    this.mostrarCamposVacios = false;
                    this.textoBotonGuardar = "Editar";
                    this.textoBotonBorrar = "Borrar";
                    
                    if(this.form.controls["id"].value > 0 && !this.nuevo){

                        var notificacion : any = {}
    
                        if (this.parametro == 2 ){
                            notificacion.tipo = 6;
                        } else{
                            notificacion.tipo = 5;
                        }
    
                        
                        notificacion.id_proceso = this.form.controls["id"].value;
                        notificacion.tema = this.form.controls["tema"].value;
                        notificacion.tarea = 0;
                        notificacion.proyecto = this.form.controls["proyecto"].value;


                        notificacion.monto = this.form.controls["precio"].value;

                        if (this.form.controls["tema"].value!= 1 || this.form.controls["tema"].value!= 2){
                            
                            if( notificacion.monto = this.form.controls["monto_anticipo"].value>0)
                            {
                                notificacion.monto = this.form.controls["monto_anticipo"].value;

                            }else if( notificacion.monto = this.form.controls["monto_cobrado"].value>0)
                            {
                                notificacion.monto = this.form.controls["monto_cobrado"].value;

                            }else if( notificacion.monto = this.form.controls["costo_mtto"].value>0)
                            {
                                notificacion.monto = this.form.controls["costo_mtto"].value;
                            }
                        
                        }


                        notificacion.responsable = this.DatosUsuario.nombre;
                        notificacion.responsableId = this.DatosUsuario.id_usuario;
                        notificacion.enviadoAId = this.form.controls["autorizado_por"].value;
                        notificacion.vendedor = this.form.controls["vendedor"].value;;
                        
    
    
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
            }, (err)=>console.log(err))
        }else{
            this.nuevoRegistro = false;
            this.form.enable();
            this.mostrarCamposVacios = true;
            this.textoBotonGuardar = "Guardar";
            this.textoBotonBorrar = "Cancelar";   
        }
    }

    borrarMensaje(archivo){
         if(this.textoBotonBorrar == "Borrar"){
                      this.servicio.delRegistro(this.form.controls["id"].value, "ventasMensajes/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
              this.presentToast("Se borro el documento");
            }, (err)=>console.log(err))
         }else{
            this.form.disable();
            this.textoBotonGuardar = "Editar";
            this.textoBotonBorrar = "Borrar"; 
        }
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

     //Cargar Imagenes
    public presentActionSheetCamara(){

        let actionSheet = this.actionSheetCtlr.create({
            title: "Seleccionar Imagen",
            buttons: [{
                text: "Desde la libreria",
                handler: ()=>{
                    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
            {
                text: 'Usar Camara',
                handler: ()=>{
                    this.takePicture(this.camera.PictureSourceType.CAMERA);
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
            
            if(this.mensaje!=undefined && this.mensaje!=null){
                 let nombreImagen = this.form.controls["id"].value + this.form.controls["tema"].value.toString() + 
                               this.form.controls["proyecto"].value.toString()  + aleatorio.toString() + ".jpg"
                 this.uploadImage(imageData, nombreImagen, "jpg");
            }else{
                    this.tempImageList.push({
                        ruta: imageData,
                        nombre:  aleatorio.toString() + ".jpg",
                        formato: "jpg"
                    });
            }
           
           
        }, (err)=>{
            this.presentToast("Error al seleccionar imagen.");
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

    public uploadImage(imagenRuta: string, imagenNombre: string, formato: string){

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

        fileTransfer.upload(imagenRuta, url, options).then(data=>{
                this.loading.dismissAll();
                this.presentToast("Se subio la imagen.");
               
                this.guardarArchivo({
                    mensaje: this.form.controls["id"].value,
                    nombre: imagenNombre,
                    formato: formato             
                 });
        },err=>{
                this.loading.dismissAll()
                this.presentToast("Error al subir la imagen.");
        });
       
    }

    guardarArchivo(archivo: any){
        
        if(this.form.controls["fecha_registro"].value != null){
            let fecha_elab = this.form.controls["fecha_registro"].value.toString().slice(0,10);    
            this.form.controls["fecha_registro"].patchValue(fecha_elab);
        }
        
        this.servicio.addRegistro("mensajesVentas/archivos/agregar/"+this.db+"/", archivo, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
            rs=>{
                this.obtenerArchivos(this.form.controls["id"].value)
                this.form.controls["archivos"].patchValue(1);
                this.servicio.putRegistro("ventasMensajes/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                    .subscribe(  
                    rs=>{
                        this.presentToast("Se subio el archivo")
                    
                        if(this.form.controls["id"].value > 0 && !this.nuevo){

                            var notificacion : any = {}
        
                            if (this.parametro == 2 ){
                                notificacion.tipo = 6;
                            } else{
                                notificacion.tipo = 5;
                            }
        
                            
                            notificacion.id_proceso = this.form.controls["id"].value;
                            notificacion.tema = this.form.controls["tema"].value;
                            notificacion.tarea = 0;
                            notificacion.proyecto = this.form.controls["proyecto"].value;


                            notificacion.monto = this.form.controls["precio"].value;

                            if (this.form.controls["tema"].value!= 1 || this.form.controls["tema"].value!= 2){
                                
                                if( notificacion.monto = this.form.controls["monto_anticipo"].value>0)
                                {
                                    notificacion.monto = this.form.controls["monto_anticipo"].value;
    
                                }else if( notificacion.monto = this.form.controls["monto_cobrado"].value>0)
                                {
                                    notificacion.monto = this.form.controls["monto_cobrado"].value;
    
                                }else if( notificacion.monto = this.form.controls["costo_mtto"].value>0)
                                {
                                    notificacion.monto = this.form.controls["costo_mtto"].value;
                                }
                            
                            }


                            notificacion.responsable = this.DatosUsuario.nombre;
                            notificacion.responsableId = this.DatosUsuario.id_usuario;
                            notificacion.enviadoAId = this.form.controls["autorizado_por"].value;
                            notificacion.vendedor = this.form.controls["vendedor"].value;;
                            
        
        
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
                    er => console.log(er)
                    )
            },          
            er => console.log(er)
            )
    }

    obtenerArchivos(mensaje: number){
        let peticion = "mensajesVentas/archivos/"+this.db+"/"
        this.servicio.filtroMensajes(mensaje, peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs => {
                        this.listaArchivosMensajes = rs
                    },
                    er=>console.log(er)
        );
    }

    borrarArchivo(archivo: VeArchivosMensajes){

        let alerta = this.alertController.create({
            title: "¿Desea borrar la imagen?",
            buttons:[
                {
                  text: "Cancelar"
                },
                {
                    text: "Borrar",
                    handler: ()=>{
                            let url   = "mensajesVentas/borrarArchivo/"+this.db+"/"+archivo.nombre +"/"
                            this.servicio.delRegistro(archivo.mensaje, url, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                                this.presentToast("Se elimino la imagen");
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
        //var urlImage = url + this.asset + "/" + image.nombre;
        var urlImage = this.DatosUsuario.url + this.asset + "/" + image.nombre;
        
        this.photoViewer.show(urlImage, image.nombre);
    }

    obtenerTipoModeloProyecto(proyecto){
        
        this.servicio.getDatos("vePropiedadProyecto/"+this.db+"/"+proyecto.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
        this.listaPropiedades = rs;
        }, (er)=>{console.log(er)})
    }

    obtenerFormaDePago(formaPago){
        this.formaPago = formaPago;
    }

  tomarVideo(){
        let aleatorio = Math.floor((Math.random()*1000) + 1);
        let nombreImagen = this.form.controls["id"].value + this.form.controls["tema"].value.toString() + 
                           this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                           aleatorio.toString();

       this.mediaCapture.captureVideo(this.optionsVideo).then((data: MediaFile[])=>{
           
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                
                this.uploadImage(data[key].fullPath, nombreImagen+".mp4", "mp4");
                
            }
        }

       }, (err: CaptureError)=>console.log(err))
    }

    tomarVideoTemp(){
        let aleatorio = Math.floor((Math.random()*1000) + 1);
        let nombreImagen = aleatorio.toString();

       this.mediaCapture.captureVideo(this.optionsVideo).then((data: MediaFile[])=>{
           
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                this.tempVideoList.push({
                    path: data[key].fullPath,
                    nombre:  nombreImagen+".mp4",
                    formato: "mp4"
                });    
            }
        }

       }, (err: CaptureError)=>console.log(err))
    }

    capturarAudio(){

        let aleatorio = Math.floor((Math.random()*100) + 1);
        let nombreImagen = this.form.controls["id"].value + this.form.controls["tema"].value.toString() + 
                           this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                           aleatorio.toString();
    
       
       this.mediaCapture.captureAudio(this.optionsAudio).then((data: MediaFile[])=>{
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                
                this.uploadImage(data[key].fullPath, nombreImagen+".3gp", "3gp");
                
            }
        }

       }, (err: CaptureError)=>console.log(err))
    }

    tomarAudioTemp(){
        let aleatorio = Math.floor((Math.random()*1000) + 1);
        let nombreImagen = this.form.controls["id"].value + this.form.controls["tema"].value.toString() + 
                           this.form.controls["numproy"].value.toString() + this.form.controls["numdocumento"].value.toString() +
                           aleatorio.toString();

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

    public presentActionSheetOpciones(){

        let actionSheet = this.actionSheetCtlr.create({
            title: "",
            cssClass: "action-sheets-basic-pages",
            buttons: [{
                text: 'Video',
                icon: "ios-videocam-outline",
                handler: ()=>{
                    if(this.mensaje!=null && this.mensaje!=undefined){
                        this.tomarVideo();
                    }else{
                        this.tomarVideoTemp();
                    }
                }
            },
            /*{
                text: 'Imprimir',
                icon: "ios-print-outline",
                handler: ()=>{
                    this.ofImprimir();
                }
            },*/
            {
                text: 'Whatsapp',
                icon: "logo-whatsapp",
                
            },
            {
                text: "Cancel",
                role: "Cancel"
            }
            ]
        });

        actionSheet.present();
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
                //this.presentToast("Se descargar el archivo " + entry.toURL());
                this.abrirArchivo(directorio + archivo.nombre, archivo.formato)
            }, (error) => {
                this.loading.dismissAll()
                this.presentToast("Error al abrir el archivo");
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

    /******************************************** SEMBRADO ************************************************/

    validarExistenciaPropiedad(){
        if(this.tema.id == 1){
            var propiedad = this.form.controls["modelo_propiedad"].value;
            var proyecto = this.form.controls["proyecto"].value;
            this.servicio.getDatos("propiedadProyecto/"+this.db+"/"+proyecto.toString()+"/"+propiedad.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                rs=>{
                    if(rs.length>0){
                        this.mssError = "Ya exite la propiedad"
                        this.form.controls["modelo_propiedad"].patchValue("");
                    }else{
                        this.mssError = ""
                    }
                },err=>{console.log(err)}
            );
        }
    }

    obtenerListaPropiedades(proyecto){
        
        if(this.tema.id != 1 && this.tema.id != 5){
                this.servicio.getDatos("propiedadesProyectoTema/"+this.db+"/"+proyecto.toString()+"/"+this.tema.id.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                    rs=>{
                        this.listaPropiedadesProyecto = rs;
                    },err=>{console.log(err)}
                );
        }else if (this.tema.id == 5){
            this.servicio.getDatos("propiedadesProyectoCancelacion/"+this.db+"/"+proyecto.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                rs=>{
                    this.listaPropiedadesProyecto = rs;
                },err=>{console.log(err)}
            );
        }
    }

    obtenerDatosExistentes(propiedad){
         if(this.tema.id != 1){
            var proyecto = this.form.controls["proyecto"].value;
            this.servicio.getDatos("propiedadProyectoIdMensaje/"+this.db+"/"+proyecto.toString()+"/"+propiedad.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                rs=>{
                    var id = rs[0].id;

                    if(id>0){
                        this.servicio.getDatos("ventasMensajes/"+this.db+"/"+id.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                                rs=>{
                                    this.mensaje = rs[0];
                                    if(this.mensaje != undefined && this.mensaje != null){
                                        if(this.mensaje.id>0){
                                            this.mensaje.tema = this.tema.id;
                                            //this.form.controls["id"].patchValue(id);
                                            this.nuevoRegistro = false;
                                            this.form = null;
                                            this.crearForma();
                                            this.form.controls["fecha_registro"].patchValue(this.fechaActualCadena());
                                            this.textoBotonGuardar = "Guardar";
                                            this.textoBotonBorrar = "Cancelar";  
                                        }
                                    }

                                },err=>{console.log(err)});
                    }

                },err=>{console.log(err)}
            );
        }
    }

    soloLectura(parametro){
        
        var retorno = false;

        if(parametro == 2){
            retorno = true
        }

        return retorno;
    }

    obtenerSO(){
        this.so = this.DatosUsuario.so;
    }

    returnPathFile(link, file){
            //return link+"/"+this.asset+"/"+file;
            return this.DatosUsuario.url+this.asset+"/"+file;
    }

    generarNuevo(){
        this.tempImageList.splice(0, this.tempImageList.length);
        this.tempVideoList.splice(0, this.tempVideoList.length);
        this.tempAudioList.splice(0, this.tempAudioList.length);
        this.listaArchivosMensajes.splice(0, this.listaArchivosMensajes.length);
        this.form.reset();
        this.form.enable();
        
        if(this.mensaje!=undefined && this.mensaje!=null){
            if(this.mensaje.gp == 1){
                this.gp = true;
                this.form.disable();
            }else{
                this.gp = false;
            }
        }
        
        this.nuevoRegistro = true;
        this.textoBotonGuardar = "Guardar";
        this.textoBotonBorrar = "Cancelar";   
    }

    subirArchivo(){
        
        var tipo = "";
        var archivo = "";
        
       if (this.DatosUsuario.so == "ios"){
            this.filePicker.pickFile().then(uri=>{
                
                if(uri.length>0){
                    tipo = this.obtenerCadenaPorPosicionCaracter(".", uri);
                    archivo = this.obtenerCadenaPorPosicionCaracter("/", uri);
                    this.uploadImage(uri, archivo, tipo);
                }

            }).catch(err=>console.log(err))
        }else if (this.DatosUsuario.so == "android")
        {
            this.fileChooser.open().then(uri=>{
                if(uri.length>0){
                    tipo = this.obtenerCadenaPorPosicionCaracter(".", uri);
                    archivo = this.obtenerCadenaPorPosicionCaracter("/", uri);
                    this.uploadImage(uri, archivo, tipo);
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

    
}