import React, {useState, useEffect} from 'react'
import './style.css'
import axios from 'axios';
import { TimePicker } from '@material-ui/pickers';
import swal from 'sweetalert';


export const Maintenance = () => {
    const [machines,setMachines] = useState([]);
    const [tipo, setTipo] = useState("");
    const [idMachine, setIdMachine] = useState(0);
    const [diaSemana, setDiaSemana] = useState(0);
    const [semana, setSemana] = useState(0)
    const [horaInicio, setHoraInicio] = useState(new Date());
    const [horaFin, setHoraFin] = useState(new Date());

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/maquinas`).then((response) => {
            if(response.status === 200) setMachines(response.data);
        }).catch(() => setMachines([]))
        
    }, [])



    const handleMantencion = async (e) => {
        horaInicio.setSeconds(0,0);
        horaFin.setSeconds(0,0);
        e.preventDefault();
        
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/createMantencion`,{
            id_mantencion : 1,
            tipo: tipo,
            inicio: horaInicio.toLocaleTimeString(),
            final:horaFin.toLocaleTimeString(),
            dia: diaSemana
        }).then((response) => {
            if(response.status === 201){
                swal({
                    title: "Mantención creada correctamente",
                    icon: "success",
                    button: "Aceptar"
                  })
            };
        }).catch((error) =>{
            if(error.response.status === 400){
                swal({
                    title: "No se pudo crear la mantención",
                    icon: "error",
                    button: "Aceptar"
                  })
            };
        })

    }

    const handlerCargarId = function(e){
        const opcion = e.target.value;
        setIdMachine(machines[opcion].id_maquina);
        setTipo(machines[opcion].tipo)
    }


  return (
    <div className='main-container'>
        <div className='type-mach'>
            <h1 className='text-type-machine'>Seleccione la máquina</h1>
            <select className='machines' onClick={handlerCargarId}>
                <option value = {-1}> Seleccione una opción:</option>
                {machines.map((machine,i) => (
                    <option key = {'tipo'+i}value={i}> {machine.tipo}</option>
                ))}
                </select>
        </div>
        <div className='main-time'>
            <h1 className='text-time'>Hora inicio:</h1>
            <TimePicker value={horaInicio} onChange={setHoraInicio}/>
            <h1 className='text-time'>Hora final:</h1>
            <TimePicker value={horaFin} onChange={setHoraFin}/>
        </div>
        <div className='date-main'>
            <h1 className='dia-h1'>Dia de la semana</h1>
            <select name='semana-select' onChange={(event) => setDiaSemana(event.target.value)}>
                <option value={'Seleccione una opción'}>Seleccione una opción</option>
                <option value={'Lunes'}>Lunes</option>
                <option value={'Martes'}>Martes</option>
                <option value={'Miercoles'}>Miércoles</option>
                <option value={'Jueves'}>Jueves</option>
                <option value={'Viernes'}>Viernes</option>
                <option value={'Sabado'}>Sábado</option>
                <option value={'Domingo'}>Domingo</option>
            </select>
        </div>
        <div className='btn-maint'>
            <button className='button-maintenance' onClick={handleMantencion} >INGRESAR MANTENCION</button>
        </div>
    </div>
  )
}
