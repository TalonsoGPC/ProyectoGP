import { Component }  from "@angular/core";
import { NavController, AlertController, ViewController, NavParams, ActionSheetController, ToastController, LoadingController, Loading } from "ionic-angular";
//import { Alertas } from "../../services/alertas";
import { TiposAlertas } from "../../services/tiposalertas";
import { Proyectos } from "../../services/proyectos";
import { ConstructorService } from "../../services/serviciosConstructor";
import { ArchivosAlertas } from "../../services/archivosalertas";
import { File }  from "@ionic-native/file";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Temas }  from '../../services/temas';
import { MensajesUsuario } from "../../services/mensajesusuario";
import { Proveedores }  from '../../services/proveedores';
import { Responsables }  from '../../services/responsables';
import { Estatus }  from '../../services/estatus';
import { Usuarios }  from '../../services/usuarios';
import { Tareas }  from '../../services/tareas';
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { ArchivosMensajes } from "../../services/archivosmensajes";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import { DatosAPP } from "../../services/datosApp";
import { FileOpener } from '@ionic-native/file-opener';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Notificaciones } from '../../services/notificaciones';
import {NotificacionesPage} from "../notificaciones/notificaciones";

@Component({
    selector: "alertasdetalle-page",
    templateUrl: "alertasdetalle.html"
})

export class AlertasDetallePage{
    alerta: any;
    listaProyectos: Proyectos[];
    listasTiposAlertas: TiposAlertas[];
    listaArchivosAlertas: ArchivosAlertas[];
    listaArchivosMensajes: ArchivosMensajes[];
    listaTemas: Temas[];
    loading: Loading;
    form: FormGroup;
    formDocto: FormGroup;
    titulo: string;
    color: string;
    descripcionTema: string;
    nuevoRegistro: boolean;
    color2 =  "#488aff";
    descripcion : string;
    documento: MensajesUsuario;
    listaProveedores: Proveedores[];
    listaResponsables: Responsables[];
    listaEstatus: Estatus[];
    listaUsuarios: Usuarios[];
    listaTareas: Tareas[];
    razonSocial: string;
    colorRed =  "#f53d3d";
    db: string;
    asset: string;
    DatosUsuario: DatosAPP;

    constructor(private fb: FormBuilder, private navparams: NavParams, private servicio: ConstructorService, public toastCtlr: ToastController, 
               public loadingCtlr: LoadingController, public file: File,
               public transfer: FileTransfer,
                private viewController: ViewController, private alertController: AlertController,
               private navCtlr:  NavController, private photoViewer: PhotoViewer, private fileOpener: FileOpener,
               private socialSharing: SocialSharing, public actionSheetCtlr: ActionSheetController){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.asset = this.DatosUsuario.asset;

        this.alerta = this.navparams.get("alerta");
        this.nuevoRegistro = this.navparams.get("nuevo");
        this.documento = this.navparams.get("documento");

        this.cargarProyectos();
        this.cargarTiposAlertas();
        this.cargarProveedores();
        this.cargarResponsables();
        this.cargarEstatus();
        this.cargarUsuarios();
        this.cargarTemas();
        this.cargarTareas();
        
        this.obtenerArchivos(this.alerta.mensaje);
        
        if(this.documento == null || this.documento == undefined){
            if(this.alerta.mensaje>0){
                this.obtenerDocumento(this.alerta.mensaje);
            }
        }else{
            this.crearFormaDocumento(this.documento);
        }
        /*if(this.alerta == null){
            this.nuevoRegistro = true;
        }else{
            this.nuevoRegistro = false;
        }*/

        this.crearFomrAlerta();

        if(!this.nuevoRegistro){
            if(this.alerta.notificado == 1){
                this.alerta.notificado = 0;
                this.form.controls["notificado"].patchValue(this.alerta.notificado);
                this.actualizarAlerta();
            }
        }
        
        this.cargarArchivosAlertas();

    }
    
        
    obtenerArchivos(mensaje: number){
        let peticion = "mensajes/archivos/"
            if( mensaje>0 ){
                        this.servicio.filtroMensajes(mensaje, peticion+this.db+"/",this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                        rs => this.listaArchivosMensajes = rs,
                        er=>console.log(er)
            );
        }

    }

    cargarProyectos(){
        this.servicio.getDatos("proyectos/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaProyectos = rs,          
            er => console.log(er)
        )
    }

    cargarTiposAlertas(){
        this.servicio.getDatos("tiposalertas/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listasTiposAlertas = rs;
        }, (er)=>{
            console.log(er);
        })
    }

    cargarArchivosAlertas(){
        this.servicio.getDatos("archivosalertas/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaArchivosAlertas = rs;
        }, (er)=>{console.log(er);})
    }

    actualizarAlerta(){
    
        this.servicio.putRegistro("alertas/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            console.log("");
        }, (er)=>console.log("Error: " + er))
    }
     
    cargarTemas(){
        this.servicio.getDatos("temas/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>{this.listaTemas = rs
                    this.listaTemas.forEach((element)=>{
                        if(element.id == this.alerta.tema){
                            this.descripcion = element.descripcion;
                        }
                    });
                    if(this.descripcion==null || this.descripcion == undefined){
                        this.descripcion = "No. Documento";
                    }
                },          
            er => console.log(er),
            () => this.cambiarTitulo()
        )
    }

    obtenerDocumento(id: number){
        this.servicio.getDatos("mensajes/"+this.db+"/"+id.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.documento = rs[0];
             this.crearFormaDocumento(this.documento);
        }, (err)=>console.log(err))
    }
    cambiarTitulo(){
        if(this.alerta.tema > 0){
            for(var key in this.listaTemas){
                if(this.listaTemas[key].id == this.alerta.tema){
                    this.titulo = this.listaTemas[key].nombre.toString();
                    this.color = this.listaTemas[key].color.toString();
                    this.descripcionTema = this.listaTemas[key].descripcion.toString();

                    
                    if(this.listaTemas[key].id== 1 || this.listaTemas[key].id == 2 || this.listaTemas[key].id == 3 ){
                        this.razonSocial = "Proveedor";
                    }else if(this.listaTemas[key].id == 4 || this.listaTemas[key].id == 5 ){
                        this.razonSocial = "Contratistas";
                    }else if(this.listaTemas[key].id == 6){
                        this.razonSocial = "Cliente";
                    }else{
                        this.razonSocial = "Razón Social";
                    }
                }
                
            }

        }else{
                this.titulo = "Control de Obra";
            }
            
    }

    crearFomrAlerta(){
        if(this.alerta!=null && !this.nuevoRegistro){
             this.form = this.fb.group({
                id: [this.alerta.id],
                mensaje:[this.alerta.mensaje],
                tema: [this.alerta.tema],
                tipo: [this.alerta.tipo],
                proyecto: [this.alerta.proyecto],
                asunto: [this.alerta.asunto],
                fecha_alerta: [this.alerta.fecha_alerta],
                monto: [this.alerta.monto],
                dias: [this.alerta.dias],
                fecha_documento: [this.alerta.fecha_documento],
                moneda: [this.alerta.moneda],
                enviadoA: [this.alerta.enviadoA],
                enviadoAId: [this.alerta.enviadoAId],
                enviadoPor: [this.alerta.enviadoPor],
                enviadoPorId: [this.alerta.enviadoPorId],
                numdocumento: [this.alerta.numdocumento],
                nota: [this.alerta.nota],
                alerta: [this.alerta.alerta],
                archivo: [this.alerta.archivo],
                notificado: [this.alerta.notificado],
                fecha: [this.alerta.fecha]
            });
        }else if(this.alerta!=null && this.nuevoRegistro){
            this.form = this.fb.group({
                mensaje:[this.alerta.mensaje],
                tema: [this.alerta.tema],
                tipo: [this.alerta.tipo],
                proyecto: [this.alerta.proyecto],
                asunto: [this.alerta.asunto],
                fecha_alerta: [this.alerta.fecha_alerta],
                monto: [this.alerta.monto],
                dias: [this.alerta.dias],
                fecha_documento: [this.alerta.fecha_documento],
                moneda: [this.alerta.moneda],
                enviadoA: [this.alerta.enviadoA],
                enviadoPor: [this.alerta.enviadoPor],
                numdocumento: [this.alerta.numdocumento],
                nota: [this.alerta.nota],
                alerta: [this.alerta.alerta],
                archivo: [this.alerta.archivo],
                notificado: [this.alerta.notificado],
                fecha: [this.alerta.fecha]
            });
        }else{
            this.form = this.fb.group({
                mensaje:[null],
                tema: [null],
                tipo: [null],
                proyecto: [null],
                asunto: [null],
                fecha_alerta: [null],
                monto: [null],
                dias: [null],
                fecha_documento: [null],
                moneda: [null],
                enviadoA: [null],
                enviadoPor: [null],
                numdocumento: [null],
                nota: [null],
                alerta:[null],
                archivo: [null],
                notificado: [null],
            });
        }
       
        let fecha_elab;

        if(this.form.controls["fecha"].value != null){
            fecha_elab = this.form.controls["fecha"].value.toString().slice(0,10);    
            this.form.controls["fecha"].patchValue(fecha_elab);
        }

        if(this.form.controls["fecha_alerta"].value != null){
            fecha_elab = this.form.controls["fecha_alerta"].value.toString().slice(0,10);    
            this.form.controls["fecha_alerta"].patchValue(fecha_elab);
        }

        if(this.form.controls["fecha_documento"].value != null){
            fecha_elab = this.form.controls["fecha_documento"].value.toString().slice(0,10);    
            this.form.controls["fecha_documento"].patchValue(fecha_elab);
        }
        
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
            
        var url = "http://"+this.DatosUsuario.direccion_remota + ":"+this.DatosUsuario.puerto+"/"  + this.asset + "/" + archivo.nombre 

        const fileTransfer: FileTransferObject = this.transfer.create();

        this.loading = this.loadingCtlr.create({
            content: "Abriendo archivo...",
        }); 

        this.loading.present();
        
         fileTransfer.download(url, directorio + archivo.nombre).then((entry) => {
                this.loading.dismissAll()
                //this.presentToast("Abriendo el archivo " + entry.toURL());
                this.abrirArchivo(this.file.tempDirectory + archivo.nombre, archivo.formato)
            }, (error) => {
                this.loading.dismissAll()
                this.presentToast("Error al abrir el archivo. "+this.file.tempDirectory + archivo.nombre);
            });
    }

    public compartirArchivo(archivo: any){
        var directorio = "";

        if(this.DatosUsuario.so == "ios"){
            directorio = this.file.tempDirectory;
        }else if(this.DatosUsuario.so == "android"){
            directorio = this.file.externalCacheDirectory;
        }else{
            directorio = this.file.tempDirectory;
        }
        
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
        .catch(e => this.presentToast("Formato del archivo no es soportado"));
    }

    private presentToast(text){
        let toast = this.toastCtlr.create({
            message: text,
            duration: 3000,
            position: "middle"
        });
        toast.present();
    }

    returnControlObra(){
        this.viewController.dismiss();
    }

    crearFormaDocumento(mensaje: MensajesUsuario){

            this.formDocto = this.fb.group({
            id: [mensaje.id],
            tarea: [mensaje.tarea],
            numproy: [mensaje.numproy],
            tema: [mensaje.tema],
            numdocumento: [mensaje.numdocumento],
            cliente: [mensaje.cliente],
            semana: [mensaje.semana],
            fecha_elab: [mensaje.fecha_elab],
            responsable: [mensaje.responsable],
            monto: [mensaje.monto],
            estatus: [mensaje.estatus],
            autorizado_por: [mensaje.autorizado_por],
            fecha_aut:[mensaje.fecha_aut],
            nota:[mensaje.nota],
            archivos: [mensaje.archivos]
        });
        this.formDocto.disable();
    }

    cargarProveedores(){
        this.servicio.getDatos("proveedores/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaProveedores = rs,          
            er => console.log(er)
        )
    }

    cargarResponsables(){
        this.servicio.getDatos("usuarios/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaResponsables = rs,          
            er => console.log(er)
        )
    }
    
    cargarEstatus(){
        this.servicio.getDatos("estatus/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaEstatus = rs,          
            er => console.log(er)
        )
    }

    cargarUsuarios(){
        this.servicio.getDatos("usuarios/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaUsuarios = rs,          
            er => console.log(er)
        )
    }

    cargarTareas(){
         this.servicio.getDatos("tareas/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
        .subscribe(  
            rs=>this.listaTareas = rs,          
            er => console.log(er)
        )
    }

    confirmarAlerta(){
         let confirmar = this.alertController.create({
                    title: "Confirmar alerta",
                    message: "",
                    buttons:[
                        {
                            text: "Si",
                            handler: ()=>{
                               this.enviarAlerta();
                            }
                        },{
                            text: "No"
                        }
                    ]
                });
        confirmar.present();  
    }
    
    enviarAlerta(){

        let alerta: any;
        //let por_fecha: number;
        //let por_monto: number;
        //let por_estatus: number;
        //var dias = 0;
        //var monto = 0;
        //var estatus = 0;
        //var descriTipo = "";
        let fecha_actual =  this.fechaActualCadena();
        //let fecha_lab = this.documento.fecha_elab;
       
        /*this.listasTiposAlertas.forEach((element)=>{
            if(element.tema==this.alerta.tema && element.tipo==this.form.controls["tipo"].value){
                por_fecha = element.por_fecha;
                por_monto = element.por_monto;
                por_estatus = element.por_estatus;    
                descriTipo = element.descripcion;            
            }
        });

        if(por_fecha == 1){
            dias = this.obtenerDiasAnuales(new Date(fecha_actual)) - this.obtenerDiasAnuales(new Date(fecha_lab));//this.diferenciaEntreFechasEnDias(new Date(fecha_lab), new Date(fecha_actual));
        }else if(por_monto == 1){
            monto = this.documento.monto;    
        }else if(por_estatus){
            estatus=0;
        }*/

        var fecha_elab;

        if(this.documento.fecha_elab == undefined || this.documento.fecha_elab == null){
           fecha_elab =  fecha_actual.toString().slice(0,10)
        }else{
            fecha_elab = this.documento.fecha_elab.slice(0,10)
        }

        alerta = {
            mensaje: this.documento.id,
            tema: this.documento.tema,
            tipo: this.form.controls["tipo"].value,
            proyecto: this.alerta.proyecto,
            asunto: this.form.controls["asunto"].value,
            fecha_alerta: fecha_actual.toString().slice(0,10),
            monto: this.form.controls["monto"].value,
            dias: this.form.controls["dias"].value,
            fecha_documento: fecha_elab,
            moneda: "",
            enviadoA: this.alerta.enviadoA,
            enviadoAId: this.alerta.enviadoAId,
            enviadoPor: this.DatosUsuario.nombre,
            enviadoPorId: this.DatosUsuario.id_usuario,
            numdocumento: this.documento.numdocumento,
            nota: this.form.controls["nota"].value,
            alerta: this.form.controls["alerta"].value,
            archivo: 0,
            notificado: 1,
        }

        this.servicio.addRegistro("alertas/"+this.db+"/", alerta, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.presentToast("Se mando la alerta");

            if(rs.insertId  > 0){

                var notificacion: any = {};

                if(alerta.monto == null){
                    alerta.monto = 0;
                }

                notificacion.tipo = 1;
                notificacion.id_proceso = rs.insertId;
                notificacion.tema = alerta.tema;
                notificacion.tarea = alerta.tipo;
                notificacion.proyecto = alerta.proyecto;
                notificacion.monto = alerta.monto;
                notificacion.enviadoA = alerta.enviadoA;
                notificacion.enviadoAId = alerta.enviadoAId;
                notificacion.responsable = alerta.enviadoPor;
                notificacion.responsableId = alerta.enviadoPorId;
                notificacion.vendedor = 0;
                notificacion.archivo = alerta.archivo;
                notificacion.notificado = 1;
                notificacion.gp = 0;
                notificacion.fecha = Notificaciones.obtenerFechaActual();

                this.servicio.addRegistro("notificaciones/"+this.DatosUsuario.db+"/", notificacion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
                .subscribe(rs=>{
                    //console.log(rs);
                }, err=>console.log(err))

                //rs.insertId
            }
        }, (er)=>this.presentToast("Error al mandar la alerta"))

        this.viewController.dismiss();
    }

    diferenciaEntreFechasEnDias(fecha_ini: Date, fecha_fin: Date){

        var MsxDia = 1000 * 60 * 80 * 24;
        
        var utc1 = Date.UTC(fecha_ini.getFullYear(), fecha_ini.getMonth(), fecha_ini.getDate());
        var utc2 = Date.UTC(fecha_fin.getFullYear(), fecha_fin.getMonth(), fecha_fin.getDate());
        
        
    
        return Math.floor((utc1 - utc2) / MsxDia);
    }

    fechaActualCadena(){
        let fecha;
        let fechaActual = new Date();

        fecha = fechaActual.getFullYear().toString();

        if((fechaActual.getMonth() + 1).toString().length<2){
            fecha = fecha + "-0"+ (fechaActual.getMonth() + 1).toString()
        }else{
            fecha = fecha + "-"+ (fechaActual.getMonth() + 1).toString()
        }

        if(fechaActual.getDate().toString().length<2){
            fecha = fecha + "-0"+ fechaActual.getDate().toString()
        }else{
            fecha = fecha + "-"+ fechaActual.getDate().toString()
        }
        fecha = fecha+"T00:00:00.000Z"
        return fecha;
    }

    obtenerDiasAnuales(fecha: Date){
        
        let lb_bisiestos: boolean;
        let mes = fecha.getMonth() + 1;
        let sumaDias = 0;

        if((fecha.getFullYear() % 4) == 0){
            lb_bisiestos = true;
        }else if((fecha.getFullYear() % 100) == 0){

            if((fecha.getFullYear() % 400) == 0 ){
                lb_bisiestos = true;
            }else{
                 lb_bisiestos = false;
            }

        }else{

             lb_bisiestos = false;
        }

        for( var i = 1; i < mes; i++ ){

            switch (i) {
                case 1: 
                case 3: 
                case 5: 
                case 7: 
                case 8: 
                case 10: 
                case 12:
                    sumaDias+=31;
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                  sumaDias+=30;
                  break;
                case 2:
                    if(lb_bisiestos){
                        sumaDias+=29;
                    }else{
                        sumaDias+=28;
                    }
                    break;
                default:
                    sumaDias+=0;
                    break;
            }
      
        }

        sumaDias+=fecha.getUTCDate();
        return sumaDias;

    }

    cancelarAlert(){
        //this.viewController.dismiss();
    }

    obtenerPlantillaAlerta(parametro){
        let por_fecha: number;
        let por_monto: number;
        let por_estatus: number;
        let alertaPlantilla: string;
        var descriTipo = "";
        var dias = 0;
        var monto = 0;
        var estatus = 0;
        let fecha_actual =  this.fechaActualCadena();
        let fecha_lab = this.documento.fecha_elab;
        var indiceCadena = 0;


        this.listasTiposAlertas.forEach((element)=>{
            if(element.tema == this.alerta.tema && element.tipo == parametro){
                alertaPlantilla = element.alerta;
                por_fecha = element.por_fecha;
                por_monto = element.por_monto;
                por_estatus = element.por_estatus;
                descriTipo = element.descripcion

                if(alertaPlantilla==null || alertaPlantilla == undefined){
                    alertaPlantilla = "";
                }
            }
        });

         if(por_fecha == 1){
            dias = this.obtenerDiasAnuales(new Date(fecha_actual)) - this.obtenerDiasAnuales(new Date(fecha_lab));//this.diferenciaEntreFechasEnDias(new Date(fecha_lab), new Date(fecha_actual));
            indiceCadena = alertaPlantilla.indexOf("0");
            alertaPlantilla = alertaPlantilla.replace("0", dias.toString());
            this.form.controls["dias"].patchValue(dias);
            this.form.controls["monto"].patchValue(0);
        }else if(por_monto == 1){
            monto = this.documento.monto;
            indiceCadena = alertaPlantilla.indexOf("0");
            alertaPlantilla = alertaPlantilla.replace("0", monto.toString()); 
            this.form.controls["dias"].patchValue(0);
            this.form.controls["monto"].patchValue(monto);   
        }else if(por_estatus){
            estatus=0;
            this.form.controls["dias"].patchValue(0);
            this.form.controls["monto"].patchValue(0);
        }

        this.form.controls["alerta"].patchValue(alertaPlantilla);
        this.form.controls["asunto"].patchValue(descriTipo);

    }

    menuBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

    borrarAlerta(){
         let confirmar = this.alertController.create({
                    title: "Borrar alerta",
                    message: "",
                    buttons:[
                        {
                            text: "Si",
                            handler: ()=>{
                                    this.servicio.delRegistro(this.alerta.id, "alertas/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                                        this.presentToast("Se borro la alerta");
                                    }, (er)=>this.presentToast("Error al borrar la alerta"))
                                }
                        },{
                            text: "No"
                        }
                    ]
                });
        confirmar.present();  
    }

    imageFullSize(url, image){
        //var urlImage = url + this.asset + "/" + image.nombre;
        var urlImage = this.DatosUsuario.url + this.asset + "/" + image.nombre;
        this.photoViewer.show(urlImage, image.nombre);
    }

    returnPathFile(link, file){
            //return link+"/"+this.asset+"/"+file;
            return this.DatosUsuario.url + this.asset+"/"+file;
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

    irNotificaciones()
    {
        this.navCtlr.push(NotificacionesPage, {DatosUsuario: this.DatosUsuario});
    }
}