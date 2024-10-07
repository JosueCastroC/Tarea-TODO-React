import React, { Component } from 'react';
import './assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; //Es una libreria de diseño, Framework de front-end
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
//images
//import logo from '../assets/img/pendientes.png'

import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import Nuevo from './components/Nuevo';
// import Editar from './components/Editar';

//import {  BrowserRouter as Router , Routes, Route} from 'react-router-dom'

const url="http://localhost:5131/api/Todo/";

class App extends Component{
  state={
    data:[],
    modalInsertar: false, //Estado para abrir y cerra metodo POST
    modalEliminar: false, //Estado para abrir y cerrar metodo DELETE
    form:{                //Este form guarda la informacion de nuestro estado
      id: '',
      title: '',
      description: '',
      tipoModal: ''  //Como reutilizamos el mismo Modal para POST y PUT, necesitamos un estado para diferenciar el tipo de modal que se requerira
    }
  }

  peticionGet=()=>{
    axios.get(url).then(response=>{
      this.setState({data: response.data});
      console.log(response.data);
    }).catch(error=>{             //Se hace un manejo de errores
      console.log(error.message);
    })
  }

  peticionPost=async ()=>{        //Debe ser asincrona porque se ejecuta en segundo plano
    delete this.state.form.id;    //Elimina nuestro atributo id, ya que lo asigna nuestra base de datos automaticamente
    await axios.post(url, this.state.form).then(response=>{
      this.modalInsertar();       //Al momento que usuario inserte datos tenemos que cerrar el modal
      this.peticionGet();         //Debemos hacer una solicitud Get para actualizar los datos
    }).catch(error=>{             //Se hace un manejo de errores
      console.log(error.message);
    })
  }

  peticionPut=()=>{
    axios.put(url+this.state.form.id, this.state.form).then(response=>{   //"url+this.state.form.id" es el formato para consumir a nuestra API. La data es nuestro estado form
      this.modalInsertar();   //En caso de que la peticion sea exitosa, cierra el modal
      this.peticionGet();     //Hace de nuevo la peticion GET para refrescar nuestra informacion
    }).catch(error=>{             //Se hace un manejo de errores
      console.log(error.message);
    })
  }

  peticionDelete=()=>{
    axios.delete(url+this.state.form.id).then(response=>{ //Nuestra url es igual que en metodo PUT, pero en DELETE no tenemos ningun body que mandar, asi que solo
      this.setState({modalEliminar: false});
      this.peticionGet();
    }).catch(error=>{             //Se hace un manejo de errores
      console.log(error.message);
    })
  }

  modalInsertar=()=>{              {/*Este metodo 'modalInsertar' cambia en POST, el estado de true a false y viceversa*/}
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

  seleccionarMiembro=(miembro)=>{  {/*Capturamos que miembro estamos seleccionando. Recibe al miembro y lo asigna a nuestro estado*/}
    this.setState({
      form: {
        id: miembro.id,
        title: miembro.title,
        description: miembro.description
      },      
      tipoModal: 'actualizar',           //Establecemos el tipo de Modal, que en PUT es 'actualizar'
    })
  }

  handleChange=async e=>{                {/*Captura lo que el usuario escribe en los input POST*/}
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,              //Esta linea es para heredar todos los atributos que ya existan en el form y no se borren en el momento de que el usuario escriba
        [e.target.name]: e.target.value  //Segun el title del input es como se guardara en el estado. Por ello es importante que el input se llame igual al estado donde se guarda la informacion
      }
    });
    console.log(this.state.form);
  }

  componentDidMount(){
      this.peticionGet();
  }

  render(){
     const {form}=this.state; {/*Para abreviar los parametros de 'value' en los inputs*/}
    return(
      <div className="App">
          <br/>
          <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar miembro</button> {/*Cuando se presiona el boton 'agregar miembro' se abre el modalInsertar. Cuando se hace click en agregar miembro tenemos que establecer el form en null para que entienda que nos referimos a la peticion POST*/}
          <br/><br/>
            <table className="table">
                <thead>
                  <tr>
                      <th>title</th>
                      <th>description</th>
                      <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.map(miembro=>{
                    return(
                        <tr>
                          <td>{miembro.title}</td>
                          <td>{miembro.description}</td>
                          <td>
                              <button className="btn btn-primary" onClick={()=>{this.seleccionarMiembro(miembro); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button> {/*Mandamos llamar 'seleccionarMiembro' para saber y registrar que miembro se va a editar*/}
                              {"    "}
                              <button className="btn btn-danger" onClick={()=>{this.seleccionarMiembro(miembro); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                          </td>

                        </tr>
                    )   
                  })}
                </tbody>
            </table>

            {/*Modal esta destinado para el metodo POST*/}
            <Modal isOpen={this.state.modalInsertar}>       {/*'isOpen' pasa el estado para el Modal*/}
                  <ModalHeader style={{display: 'block'}}>
                    <span style={{float: 'right'}}>x</span>
                  </ModalHeader>
                  <ModalBody>
                    <div className="form-group">
                        <br/>
                        <label htmlFor="title">title</label>
                        <input className="form-control" type="text" name="title" id="title" onChange={this.handleChange} value={form?form.title: ''}/> 
                        <br/>   {/* Se agregaron los puntos y comillas en cada 'value' para diferenciar de cuando el form esta vacio o no, ya que cuando presionamos seleccionar  se cargan los valores, por el otro lado al insertar el form esta vacio debido a que el usuario lo tiene que digitar*/}
                        <label htmlFor="description">description</label>
                        <input className="form-control" type="text" name="description" id="description"onChange={this.handleChange} value={form?form.description:  ''}/>
                        <br/>
                    </div>
                  </ModalBody>

                  <ModalFooter>
                    {this.state.tipoModal=='insertar'? (
                      <button className="btn btn-success" onClick={()=>this.peticionPost()}>Insertar</button>) : (<button className="btn btn-primary" onClick={()=>this.peticionPut()}>Actualizar</button> 
                    )}                                                                                         {/*Cuando se presiona el boton 'Insertar' se abre el modalInsertar*/}   {/*Hacemos llamar a nuestro metodo PUT con: "onClick={()=>this.peticionPut()}" */}
                      <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button> {/*Cuando se presiona el boton 'Cancelar' se cierra el modalInsertar*/}
                  </ModalFooter>
            </Modal>

            {/*Este Modal se despliega cuando se va a eliminar a un usuario*/}
            <Modal isOpen={this.state.modalEliminar}> 
              <ModalBody>
                Está seguro que desea eliminar al miembro {form && form.title}
              </ModalBody>
              <ModalFooter>
                <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
                <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
              </ModalFooter>
            </Modal>
      </div>
    );
  }
}

// function App() {
//   return (  //React.Fragment Es como un div, es una etiqueta propia de React. 
//       <React.Fragment>    
//           <Router>
//             <Routes>
//               {/*<Route path="/" element={<Login />}></Route>*/}
//               <Route path="/dashboard" element={<Dashboard />}></Route>
//               <Route path="/nuevo" element={<Nuevo />}></Route>
//               <Route path="/editar" element={<Editar />}></Route>

//             </Routes>
//           </Router>
//       </React.Fragment>
//   );
// }

export default App;
