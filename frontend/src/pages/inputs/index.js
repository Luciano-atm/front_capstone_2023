import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { Maintenance } from '../../components/maintenance'
import './style.css'
import 'bootstrap/dist/css/bootstrap.css'
import swal from 'sweetalert';
import FileDownload from "js-file-download";


export const Inputs = () => {
  const [val, setVal] = useState([]);
  const [semana, setSemana] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [archivo_pdf, setArchivoPfd]= useState(null);
  const [semanas, setSemanas] = useState([]);
  const navigate = useNavigate();

  const handleAdd = () => {
    const abc = [...val, []]
    setVal(abc)
  }



  const subirArchivo = e => {
    setArchivo(e);
  }

  const subirArchivoPdf = e => {
    setArchivoPfd (e);
  }

  const insertarArchivos = async () => {
    const f = new FormData();

    for (let index = 0; index < archivo.length; index++) {
      f.append("myfile", archivo[index]);
    }

    for (let index = 0; index < archivo_pdf.length; index++) {
      f.append("mypdf", archivo_pdf[index]);
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/postFile`, f);
      swal({
        title: "Archivo subido correctamente",
        icon: "success",
        button: "Aceptar"
      }).then(() => {
        // Llama a la función de descarga después de que se complete la carga
        download();
      });
    } catch (error) {
      console.log(error);
      // Puedes mostrar una notificación o realizar cualquier otra acción de manejo de errores aquí.
      swal({
        title: "Error al subir el archivo",
        text: "Ha ocurrido un error al subir el archivo.",
        icon: "error",
        button: "Aceptar",
        
      });
    }
  }

  const download = async (e)=>{
    e.preventDefault();
    axios({
      url:`${process.env.REACT_APP_BACKEND_URL}/getFileInput`,
      method:'GET',
      responseType:'blob',
    }).then((res) =>{
      console.log(res);
      FileDownload(res.data,"input.xlsx")
    })
  }




  const handleSemana = async (e) => {
    e.preventDefault();
    if (semana) {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/obtenerSemana`, {
        semana: semana
      }).catch((error) => {
        if (error.response.status === 400) console.log(error.response.status);
      })
    }

  }

  const handleSubmit = async (data) => {
    navigate('/outputs/' + semana)
  }

  function imprimirMensaje() {
    console.log("Este es un mensaje en la consola.");
  }


  return (
    <div className='background-input'>
      <div className='box-container-input'>
        <div className='box-top-input'>
          <h1 className='top-text-input'>Bienvenido al Sistema de Apoyo a la Toma de Decisiones</h1>
        </div>
        <form className='form-group' >
          <div className='box-down-input'>

            <div className='form'>
              <label className='text-input-excel'><h1>Insertar planificación enólogo </h1></label>
              <input type='file' className='form-control' onChange={(e) => subirArchivo(e.target.files)} required></input>
            </div>
            <div className='form'>
              <label className='text-input-excel'><h1>Insertar planificación Igenieros </h1></label>
              <input type='file' className='form-control' onChange={(e) => subirArchivoPdf(e.target.files)} required></input>
            </div>
            <div className='form'>
              <div className='btn-in'>
                <button className='button-succ' onClick={() => insertarArchivos()}>
                  Subir
                </button>
              </div> 
              <div className='btn-out'>
                <button className='button-succ' onClick={(e) =>download(e)}>
                  Descargar
                </button>
              </div> 
            </div>
            

          </div>
        </form>
      </div>
    </div>
  )
}
