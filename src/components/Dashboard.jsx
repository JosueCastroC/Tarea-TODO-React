import React from 'react'

class Dashboard extends React.Component {   // "extends" significa que hereda. Esta clase es un componente.
    render(){   //Metodo que retorna todos los elementos html al controlador principal. "render" siempre retorna algo.
        return(
            <div>
                Holiwis desde Dashboard
            </div>
        )
    };
}  

export default Dashboard 

// const Login = () => {
//   return (
//     <div>Holiwis desde Login</div>
//   )
// }