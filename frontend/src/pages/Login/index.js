import React, {useState} from 'react';
import api from '../../services/api';


export default function Login({ history }){
    const [email, setEmail] = useState('');


    async function handleSubmit(event){
        event.preventDefault();//sem funcionamento padrão do formulario

        const response = await api.post('/sessions', {
        email
        })

        const { _id } = response.data; 
        localStorage.setItem('user', _id);

        history.push('/dashboard')
  }
    return (
    <>
        <p>
         Ofereça <strong>spots</strong> para seus talentos e encontre <strong>talentos</strong> para suas empresas
       </p>

       <form onSubmit={handleSubmit} >
         <label htmlFor="email">E-MAIL *</label>
         <input type="email" id= "email" placeholder= "Seu melhor e-mail" onChange={event => setEmail(event.target.value)} value={email} />
         <button className = "btn" type="submit">Entrar</button>
       </form>
    </>
    );
}