import React from 'react'

class Nuevo extends React.Component {   // "extends" significa que hereda. Esta clase es un componente.
    render(){   //Metodo que retorna todos los elementos html al controlador principal. "render" siempre retorna algo.
        return(
            <div>
                Holiwis desde Nuevo
            </div>
        )
    };
}  

export default Nuevo 

// const Login = () => {
//   return (
//     <div>Holiwis desde Login</div>
//   )
// }