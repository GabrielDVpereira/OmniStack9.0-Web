import React, {useEffect, useState, useMemo} from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import socketio from 'socket.io-client';
import './styles.css';
export default function Dashboard(){

    const [spots, setSpots] = useState([]);
    const [requests, setRequests] = useState([]);


    const user_id = localStorage.getItem('user');
    const socket = useMemo(()=> socketio('http://localhost:3333', {
            query: {user_id}
        }), [user_id]); //useMemo memoriza uma variavel para não ser resetada quando o componente recarregar 
        //só é chamado novamente caso o userId mude

    //useEffect a funcção passada como parametro executa toda vez que uma variavel é alterada dentro do array
    useEffect( () => {
        socket.on('booking_request', data => {
            console.log(data)
            setRequests([...requests, data]) //data são novos requests que estão vindo dos sockets do back
        })
    }, [requests,socket])

    useEffect( () => {
        const user_id = localStorage.getItem('user');
        async function loadSpots(){
            const response = await api.get('/dashboard', {
                headers: { user_id }
            });

            setSpots(response.data);
        }

        loadSpots();
    }, [])


    async function handleAccept(id){
       await api.post(`/bookings/${id}/approvals`);

        setRequests(requests.filter(request => request._id !== id));  //remove do array de requests aquele com id igual ao que foi aceito
    }

    async function handleReject(id){
        await api.post(`/bookings/${id}/rejects`);

        setRequests( requests.filter(request => request._id !== id));  //remove do array de requests aquele com id igual ao que foi aceito
    
    }
    return(
        <>
            <ul className="notifications">
                {requests.map(request => (
                    <li key={request._id}>
                        <p>
                            <strong>{request.user.email}</strong> está solicitando uma reserva em <strong>request.spot.company</strong> para a data: <strong>{request.date}</strong>
                        </p>
                        <button className="accept" onClick={() => handleAccept(request._id)}>Aceitar</button>
                        <button className="reject" onClick={() => handleReject(request._id)}>Rejeitar</button>
                    </li>
                ))}
            </ul>
          <ul className="spot-list">
            {spots.map(spot => (
                <li key={spot._id}>
                    <header style={{ backgroundImage: `url(${spot.thumbnail_url})`  }}/>
                    <strong>{spot.company}</strong>
                    <span>{spot.price ? `R$${spot.price}/dia` : 'GRATUITO'}</span>
                </li>
            ))}
          </ul>  
          <Link to= '/new'>
              <button className="btn">Cadastrar um novo Spot</button>
          </Link>
        </>
    );

}