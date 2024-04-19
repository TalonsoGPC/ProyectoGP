import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';


import { ProjectGP } from './app.component';

/*Pipes*/
import { LapsoTiempo } from "../pipes/lapso-tiempo/lapso-tiempo"

/*Constructor*/
import { ConstructorPage } from "../pages/constructor/constructor"
import { RequisicionesPage } from "../pages/requisiciones/requisiciones";
import { ConstructorService }  from '../services/serviciosConstructor';
import { TabsPage } from "../pages/tabs/tabs";
import { ConfiguracionPage } from "../pages/configuracion/configuracion";
import { ProyectosPage } from "../pages/proyectos/proyectos";
import { ProyectosDetallePage } from "../pages/proyectosdetalle/proyectosdetalle";
import { MenuConstructorPage } from "../pages/menuConstructor/menuConstructor";
import { MenuBossPage } from "../pages/menuBoss/menuBoss";
import { AutBossPage } from "../pages/autBoss/autBoss";
import { MenuControlObraPage } from "../pages/menucontrolobra/menucontrolobra";
import { MenuVentasPage } from "../pages/menuVentas/menuVentas";
import { FileBrowserPage } from "../pages/fileBrowser/fileBrowser";
import { AlertasPage } from "../pages/alertas/alertas";
import { AlertasDetallePage } from "../pages/alertasdetalle/alertasdetalle";
import { ConfigTemaAlertaPage } from "../pages/configTemaAlerta/configTemaAlerta";
import { ConfiguracionBossPage } from "../pages/configuracionBoss/configuracionBoss";
import { ConfigTiposAlertaPage } from "../pages/configTiposAlerta/configTiposAlerta";
import { CatalogoTemasPage }  from "../pages/catalogoTemas/catalogoTemas";
import { CatalogoTemasDetallePage }  from "../pages/catalogoTemasDetalle/catalogoTemasDetalle";
import { CatalogoTareasPage }  from "../pages/catalogoTareas/catalogoTareas";
import { CatalogoTareasDetallePage }  from "../pages/catalogoTareasDetalle/catalogoTareasDetalle";
import { CatalogoTareasTemaPage } from "../pages/catalogoTareasTemas/catalogoTareasTemas";
import { ConfigTiposAlertaDetallePage } from "../pages/configTiposAlertaDetalle/configTiposAlertaDetalle";
import { CatalogoTipoEmpresaPage } from "../pages/catalogoTipoEmpresa/catalogoTipoEmpresa";
import { CatalogoTipoEmpresaDetallePage } from "../pages/catalogoTipoEmpresaDetalle/catalogoTipoEmpresaDetalle";
import { CatalogoEmpresasPage } from "../pages/catalogoEmpresas/catalogoEmpresas";
import { CatalogoEmpresasDetallePage } from "../pages/catalogoEmpresasDetalle/catalogoEmpresasDetalle";
import { DocumentacionPage } from "../pages/documentacion/documentacion";
import { DocumentacionDetallePage }  from "../pages/documentacionDetalle/documentacionDetalle";
import { DocumentosProyectosPage } from "../pages/documentosProyectos/documentosProyectos";
import { DocumentosProyectoTemaPage } from "../pages/documentacionProyectoTema/documentacionProyectoTema";
import { FiltroDocumentosTiposPage } from "../pages/filtroDocumentosTipo/filtroDocumentosTipo";
import { TiposReportesBossPage }  from "../pages/tiposReportesBoss/tiposReportesBoss";
import { ReportesProyectosPage  } from "../pages/reportesProyectos/reportesProyectos";
import { ReportesBossDetallePage }from "../pages/reportesBossDetalle/reportesBossDetalle";
import { VeMensajesUsuariosPage } from "../pages/veMensajesUsuarios/veMensajesUsuarios";
import { VentasConstructorPage } from "../pages/ventasConstructor/ventasConstructor";
import { ConfiguracionVentasPage } from "../pages/configuracionVentas/configuracionVentas";
import { CatalogoTemasVentasPage } from "../pages/catalogoTemasVentas/catalogoTemasVentas";
import { CatalogoTemasVentasDetallePage } from "../pages/catalogoTemasVentasDetalle/catalogoTemasVentasDetalle";
import { ResumenDeVentasPage } from "../pages/resumenDeVentas/resumenDeVentas";
import { ResumenDeProyectosPage } from "../pages/resumenDeProyectos/resumenDeProyectos";
import { RegistroCuentaPage } from "../pages/registroCuenta/registroCuenta";
import { AccesoUsuariosPage } from "../pages/accesoUsuarios/accesoUsuarios";
import { SeleccionarAppPage } from "../pages/seleccionarApp/seleccionarApp";
import { CatalogoMonedasPage } from "../pages/catalogoMonedas/catalogoMonedas";
import { CatalogoMonedasDetallePage } from "../pages/catalogoMonedasDetalle/catalogoMonedasDetalle";
import { RegistroPerfilPage } from "../pages/registroPerfil/registroPerfil";
import { TutorialGPPage } from "../pages/tutorialGP/tutorialGP";
import { RegistroActividadPage } from "../pages/registroActividad/registroActividad";
import { VeCatalogoModelosPropiedadDetallePage } from "../pages/veCatalogoModelosPropiedadDetalle/veCatalogoModelosPropiedadDetalle";
import { VeCatalogoModelosPropiedadPage } from "../pages/veCatalogoModelosPropiedad/veCatalogoModelosPropiedad";
import { SubMenuVentasPage } from "../pages/subMenuVentas/subMenuVentas";
import { VeCatalogoVendedoresPage } from "../pages/veCatalogoVendedores/veCatalogoVendedores";
import { VeCatalogoVendedoresDetallePage } from "../pages/veCatalogoVendedoresDetalle/veCatalogoVendedoresDetalle";
import { BibliotecaDocumentosPage } from "../pages/bibliotecaDocumentos/bibliotecaDocumentos";
import { CatalogoUsuariosPage } from "../pages/catalogoUsuarios/catalogoUsuarios";
import { PermisosUsuarioProyectoPage } from "../pages/permisosUsuarioProyecto/permisosUsuarioProyecto";
import { NotificacionesPage } from "../pages/notificaciones/notificaciones";
import { ParametrosPage } from "../pages/parametros/parametros";
import { menuControlGP } from "../pages/menuControlGP/menuControlGP";
import { AlRecepcionesPage } from "../pages/ALRecepciones/ALRecepciones";
import { ListaRecepciones } from "../pages/listaRecepciones/listaRecepciones";

import {Badge} from '@ionic-native/badge';
import {Camera} from '@ionic-native/camera';
import {File} from '@ionic-native/file';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { FileTransfer } from '@ionic-native/file-transfer';
import { MediaCapture } from '@ionic-native/media-capture';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { SocialSharing } from '@ionic-native/social-sharing';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { FileOpener } from '@ionic-native/file-opener';
import {IonicStorageModule} from "@ionic/storage";
import {IOSFilePicker} from "@ionic-native/file-picker";
import {FileChooser} from "@ionic-native/file-chooser";



@NgModule({
  declarations: [
    LapsoTiempo,
    PermisosUsuarioProyectoPage,
    CatalogoUsuariosPage,
    ProjectGP,
    ConstructorPage,
    RequisicionesPage,
    TabsPage,
    ConfiguracionPage,
    ProyectosPage,
    ProyectosDetallePage,
    MenuConstructorPage,
    MenuBossPage,
    AutBossPage,
    MenuControlObraPage,
    MenuVentasPage,
    FileBrowserPage,
    AlertasPage,
    AlertasDetallePage,
    ConfigTemaAlertaPage,
    ConfiguracionBossPage,
    ConfigTiposAlertaPage,
    CatalogoTemasPage,
    CatalogoTemasDetallePage,
    CatalogoTareasPage,
    CatalogoTareasDetallePage,
    CatalogoTareasTemaPage,
    ConfigTiposAlertaDetallePage,
    CatalogoTipoEmpresaPage,
    CatalogoTipoEmpresaDetallePage,
    CatalogoEmpresasPage,
    CatalogoEmpresasDetallePage,
    DocumentacionPage,
    DocumentacionDetallePage,
    DocumentosProyectosPage,
    DocumentosProyectoTemaPage,
    FiltroDocumentosTiposPage,
    TiposReportesBossPage,
    ReportesProyectosPage,
    ReportesBossDetallePage,
    VeMensajesUsuariosPage,
    VentasConstructorPage,
    ConfiguracionVentasPage,
    CatalogoTemasVentasPage,
    CatalogoTemasVentasDetallePage,
    ResumenDeVentasPage,
    RegistroCuentaPage,
    AccesoUsuariosPage,
    SeleccionarAppPage,
    ResumenDeProyectosPage,
    CatalogoMonedasPage,
    CatalogoMonedasDetallePage,
    RegistroPerfilPage,
    TutorialGPPage,
    RegistroActividadPage,
    VeCatalogoModelosPropiedadPage,
    VeCatalogoModelosPropiedadDetallePage,
    SubMenuVentasPage,
    VeCatalogoVendedoresPage,
    VeCatalogoVendedoresDetallePage,
    BibliotecaDocumentosPage,
    NotificacionesPage,
    ParametrosPage, 
    menuControlGP, 
    AlRecepcionesPage,
    ListaRecepciones,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(ProjectGP, {backButtonText: ''}),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PermisosUsuarioProyectoPage,
    CatalogoUsuariosPage,
    ProjectGP,
    ConstructorPage,
    RequisicionesPage,
    TabsPage,
    ConfiguracionPage,
    ProyectosPage,
    ProyectosDetallePage,
    MenuConstructorPage,
    MenuBossPage,
    AutBossPage,
    MenuControlObraPage,
    MenuVentasPage,
    FileBrowserPage,
    AlertasPage,
    AlertasDetallePage,
    ConfigTemaAlertaPage,
    ConfiguracionBossPage,
    ConfigTiposAlertaPage,
    CatalogoTemasPage,
    CatalogoTemasDetallePage,
    CatalogoTareasPage,
    CatalogoTareasDetallePage,
    CatalogoTareasTemaPage,
    ConfigTiposAlertaDetallePage,
    CatalogoTipoEmpresaPage,
    CatalogoTipoEmpresaDetallePage,
    CatalogoEmpresasPage,
    CatalogoEmpresasDetallePage,
    DocumentacionPage,
    DocumentacionDetallePage,
    DocumentosProyectosPage,
    DocumentosProyectoTemaPage,
    FiltroDocumentosTiposPage,
    TiposReportesBossPage,
    ReportesProyectosPage,
    ReportesBossDetallePage,
    VeMensajesUsuariosPage,
    VentasConstructorPage,
    ConfiguracionVentasPage,
    CatalogoTemasVentasPage,
    CatalogoTemasVentasDetallePage,
    ResumenDeVentasPage,
    RegistroCuentaPage,
    AccesoUsuariosPage,
    SeleccionarAppPage,
    ResumenDeProyectosPage,
    CatalogoMonedasPage,
    CatalogoMonedasDetallePage,
    RegistroPerfilPage,
    TutorialGPPage,
    RegistroActividadPage,
    VeCatalogoModelosPropiedadPage,
    VeCatalogoModelosPropiedadDetallePage,
    SubMenuVentasPage,
    VeCatalogoVendedoresPage,
    VeCatalogoVendedoresDetallePage,
    BibliotecaDocumentosPage,
    NotificacionesPage,
    ParametrosPage, 
    menuControlGP,
    AlRecepcionesPage,
    ListaRecepciones,
  ],
  providers: [FileChooser, IOSFilePicker, ConstructorService, FileOpener, Badge, 
    Camera, 
    File, 
    DocumentViewer, 
    FileTransfer, 
    MediaCapture, 
    PhotoViewer, 
    SocialSharing, 
    StreamingMedia,
    StatusBar,
    SplashScreen, 
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
