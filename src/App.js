import React, { Component } from 'react';
import './assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import Login from './components/Login';


const url="http://localhost:5131/api/Todo/";

class App extends Component{
  state={
    data:[],
    modalInsertar: false, 
    modalEliminar: false, 
    form:{                
      id: '',
      title: '',
      description: '',
      tipoModal: ''  
    }
  }

  peticionGet=()=>{
    axios.get(url).then(response=>{
      this.setState({data: response.data});
      console.log(response.data);
    }).catch(error=>{             
      console.log(error.message);
    })
  }

  peticionPost=async ()=>{        
    delete this.state.form.id;    
    await axios.post(url, this.state.form).then(response=>{
      this.modalInsertar();       
      this.peticionGet();         
    }).catch(error=>{             
      console.log(error.message);
    })
  }

  peticionPut=()=>{
    axios.put(url+this.state.form.id, this.state.form).then(response=>{   
      this.modalInsertar();   
      this.peticionGet();     
    }).catch(error=>{             
      console.log(error.message);
    })
  }

  peticionDelete=()=>{
    axios.delete(url+this.state.form.id).then(response=>{ 
      this.setState({modalEliminar: false});
      this.peticionGet();
    }).catch(error=>{             
      console.log(error.message);
    })
  }

  modalInsertar=()=>{              
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

  seleccionarMiembro=(miembro)=>{  
    this.setState({
      form: {
        id: miembro.id,
        title: miembro.title,
        description: miembro.description
      },      
      tipoModal: 'actualizar',           
    })
  }

  handleChange=async e=>{               
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,              
        [e.target.name]: e.target.value  
      }
    });
    console.log(this.state.form);
  }

  componentDidMount(){
      this.peticionGet();
  }

  render(){
     const {form}=this.state; 
    return(
      <div className="App">
          <br/>
          <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Todo</button> 
          <br/><br/>
            <table className="table">
                <thead>
                  <tr>
                      <th>Título</th>
                      <th>Descripción</th>
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
                              <button className="btn btn-primary" onClick={()=>{this.seleccionarMiembro(miembro); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button> 
                              {"    "}
                              <button className="btn btn-danger" onClick={()=>{this.seleccionarMiembro(miembro); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                          </td>

                        </tr>
                    )   
                  })}
                </tbody>
            </table>

            <Modal isOpen={this.state.modalInsertar}>       
                  <ModalHeader style={{display: 'block'}}>
                    <span style={{float: 'right'}}>x</span>
                  </ModalHeader>
                  <ModalBody>
                    <div className="form-group">
                        <br/>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems:'center', justifyContent:'space-between'}}>
                        <label htmlFor="title">Título</label>
                        <input className="form-control" style={{width: '350px'}} type="text" name="title" id="title" onChange={this.handleChange} value={form?form.title: ''}/> 
                        </div>
                        <br/>   
                        <div style={{display: 'flex', flexDirection: 'row', alignItems:'center', justifyContent:'space-between'}}>
                        <label htmlFor="description">Descripción</label>
                        <input className="form-control" style={{width: '350px', display: 'flex', justifyContent: 'center'}} type="text" name="description" id="description"onChange={this.handleChange} value={form?form.description:  ''}/>
                        </div>
                        <br/>
                    </div>
                  </ModalBody>

                  <ModalFooter>
                    {this.state.tipoModal=='insertar'? (
                      <button className="btn btn-success" onClick={()=>this.peticionPost()}>Insertar</button>) : (<button className="btn btn-primary" onClick={()=>this.peticionPut()}>Actualizar</button> 
                    )}                                                                                         
                      <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button> 
                  </ModalFooter>
            </Modal>

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

export default App;
