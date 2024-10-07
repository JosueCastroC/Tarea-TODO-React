import React from 'react';
//css
import '../assets/css/Login.css';
//images
import logo from '../assets/img/pendientes.png'
//servicios
import { Apiurl } from '../services/apirest';

class Login extends React.Component {   // "extends" significa que hereda. Esta clase es un componente.

    state={
        form:{
            "nombre":"",
            "apellido":""
        },
        error:false,
        errorMsg:""
    }
    
    manejadorSubmit =e=>{
        e.preventDefault();
    }

    manejadorChange = async e=>{
        await this.setState({           //setState es una variable de React. Asigna un valor a una variable del estado. 
            form:{
                ...this.state.form,
                [e.target.name] : e.target.value
            }
        }) 
        console.log(this.state.form);
    } 

    manejadorBoton=()=>{  //Como sabes cuando se ha presionado el boton. Se corre al presionar el boton de "Iniciar sesion"
        //let url = Apiurl + "auth";
        fetch("http://localhost:5131/swagger/index.html")
        .then(res=> console.log(res))
    }

    render(){   //Metodo que retorna todos los elementos html al controlador principal. "render" siempre retorna algo.
        return(
            <div>
                <div className="wrapper fadeInDown">
                    <div id="formContent">

                        <div className="fadeIn first">
                        <br/><br/>
                        <img src={logo} style={{width: '130px'}} alt="User Icon" />
                        <br/><br/>
                        </div>

                        <form onSubmit={this.manejadorSubmit}>
                        <input type="text" className="fadeIn second" name="usuario" placeholder="Usuario" onChange={this.manejadorChange} />
                        <input type="password"  className="fadeIn third" name="password" placeholder="Contraseña" onChange={this.manejadorChange} autoComplete="current-password"/>
                        <input type="submit" className="fadeIn fourth" value="Iniciar sesión" onClick={this.manejadorBoton}/>
                        </form>

                        <div id="formFooter">
                        <a className="underlineHover" href="#">Forgot Password?</a>
                        </div>

                    </div>
                </div>
            </div>
        )
    };
}  

export default Login 

// const Login = () => {
//   return (
//     <div>Holiwis desde Login</div>
//   )
// }