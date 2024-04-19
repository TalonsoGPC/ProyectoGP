import { Pipe, PipeTransform, ModuleWithComponentFactories } from '@angular/core';
import { DateTime } from 'ionic-angular';

/**
 * Generated class for the LapsoTiempoPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'lapsoTiempo',
})
export class LapsoTiempo implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
      
      var fecha_actual = new Date(Date.now());
      //var fecha = new Date(this.obtenerTiempo(value));
      var fecha_cadena = this.obtenerTiempo(value);
      var ls_return = "";

      if (fecha_cadena.anio+"-"+fecha_cadena.mes+"-"+fecha_cadena.dia == fecha_actual.getFullYear()+"-"+(fecha_actual.getMonth() + 1 )+"-"+fecha_actual.getDate()){
            if((fecha_actual.getHours() - fecha_cadena.hora) <= 0  ){
                if((fecha_actual.getMinutes() - fecha_cadena.minuto)<=0){
                  ls_return =  Math.abs((fecha_actual.getSeconds() - fecha_cadena.segundo)) + "s";
                }else{
                  ls_return =  Math.abs((fecha_actual.getMinutes() - fecha_cadena.minuto)) + "m";
                }
                
            }else{
              ls_return =   Math.abs((fecha_actual.getHours() - fecha_cadena.hora)) + "h";
            }
            
        }else{
           
          if (fecha_cadena.dia.toString().length==1){
            ls_return = "0" + fecha_cadena.dia.toString();
          }else{
            ls_return = fecha_cadena.dia.toString();
          }

          ls_return = ls_return + "/" + this.obtenerMes(fecha_cadena.mes);

           /*if (fecha.getMonth().toString().length==1){
            ls_return = ls_return + "/" + "0"+fecha.getMonth().toString();
          }else{
            ls_return = ls_return + "/" + fecha.getMonth().toString();
          } */
          
          //ls_return = ls_return + "/"+fecha.getFullYear().toString();
          if(fecha_cadena.anio != fecha_actual.getFullYear()){
            ls_return = ls_return + "/"+fecha_cadena.anio.toString();
          }
           
        } 

        return ls_return;
  }

   public obtenerMes(mes: number):string{
      var ls_mes = "";

      if(mes == 1){
        ls_mes = "Ene"
      }else if(mes == 2){
        ls_mes = "Feb"
      }else if(mes == 3){
        ls_mes = "Mar"
      }else if(mes == 4){
        ls_mes = "Abr"
      }else if(mes == 5){
        ls_mes = "May"
      }else if(mes == 6){
        ls_mes = "Jun"
      }else if(mes == 7){
        ls_mes = "Jul"
      }else if(mes == 8){
        ls_mes = "Ago"
      }else if(mes == 9){
        ls_mes = "Sep"
      }else if(mes == 10){
        ls_mes = "Oct"
      }else if(mes == 11){
        ls_mes = "Nov"
      }else if(mes == 12){
        ls_mes = "Dic"
      }

      return ls_mes;
   }

   public obtenerTiempo(fecha){

      var li_pos = fecha.indexOf(":");
      var li_pos2 = fecha.indexOf("T");

      var fecha_local = fecha.substring(0, li_pos2);
      var hora = parseInt(fecha.substring(li_pos2 + 1, li_pos));

      li_pos2 = fecha.indexOf(":", li_pos + 1);

      var min = parseInt(fecha.substring(li_pos + 1, li_pos2));
      
      li_pos = fecha.indexOf(".");

      var sec = parseInt(fecha.substring(li_pos2 + 1, li_pos));

      li_pos2 = fecha.indexOf("-");
      var anio = parseInt(fecha.substring(0, li_pos2));

      li_pos = fecha.indexOf("-", li_pos2 + 1);
      var mes = parseInt(fecha.substring(li_pos2 + 1, li_pos));

      li_pos2 = fecha.indexOf("T");
      var dia = parseInt(fecha.substring(li_pos + 1, li_pos2));

      //13/9/2018 17:19:00
      return {fecha: fecha_local, hora: hora, minuto: min, segundo: sec, anio: anio, mes: mes, dia: dia}
      //return fecha_local + " " + hora.toString()+":"+min.toString()+":"+sec.toString();

   }
}


