import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { RegistroPerfilPage } from "../registroPerfil/registroPerfil";
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "tutorialGP-page",
    templateUrl: "tutorialGP.html"
})

export class TutorialGPPage{
    
    options: StreamingVideoOptions = {
        successCallback: ()=> {console.log("Video played")},
        errorCallback: ()=> {console.log("Error streaming")},
        orientation: 'landscape'
    }
    DatosUsuario: DatosAPP;

    constructor(private navparams: NavParams, private navCtlr: NavController, private streamingMedia: StreamingMedia){    
        this.DatosUsuario = this.navparams.get("DatosUsuario");
    }

    verVideo(){
        this.streamingMedia.playVideo("http://gpconstruct.elitesystemsmexico.net:8000/archivos/gpconstructVideo.MP4", this.options);
    }

    RegistroPerfilPage(){
        this.navCtlr.push(RegistroPerfilPage, {DatosUsuario: this.DatosUsuario});
    }
}