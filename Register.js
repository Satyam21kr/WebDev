import React, {useEffect, useRef, useState} from 'react'
import '../App.css'
import axios from "axios";
import {Link} from "react-router-dom";

function Login() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [firstName, setFirstname] = useState()
    const [lastName, setLastname] = useState()


    const cloud1 = useRef()
    const cloud2 = useRef()

    useEffect(() => {
        if(cloud1 != null && cloud2 != null) {
            document.addEventListener('mousemove', (e) => {
                // cloud1.current.style.top = (500+e.clientY/20)+'px';
                // cloud1.current.style.left = 500+e.clientX/20+'px';
                // cloud2.current.style.top = (100-e.clientY/20)+'px';
                // cloud2.current.style.left = -e.clientX/20+'px';
                //cloud1.current.style.top = (500+e.clientY/20)+'px';
                //cloud1.current.style.left = 500+e.clientX/20+'px';
            })
        }

    },[cloud1, cloud2])

    const handleSubmit = (e) => {
        e.preventDefault()

        axios.post('http://localhost:5000/POST_REGISTER', {
            data : {
                email,
                password,
                firstName,
                lastName
            }
        }).then(res => {
            if(res.data.status) {
                window.location.href = '/Contact'
            }else {
                document.querySelector('.error').innerHTML = res.data.error
            }
        })
    }

    return (
        <>
            <div id='formCollector'>
                <img ref={cloud1} className='cloud1' src={process.env.PUBLIC_URL+'/cloud1.png'} />
                <img ref={cloud2} className='cloud2' src={process.env.PUBLIC_URL+'/cloud1.png'} />

                <span id="main">
                <h2>Flight Management</h2>
                <h4>Take it away from HERE.</h4>
                <form onSubmit={handleSubmit}>
                    <p className='error'></p>
                    <span>
                        <label>First Name</label>
                        <input type="text" placeholder='Enter your First Name' onChange={(e) => setFirstname(e.target.value)}/>
                    </span>
                    <span>
                        <label>Last Name</label>
                        <input type="text" placeholder='Enter your Last Name' onChange={(e) => setLastname(e.target.value)}/>
                    </span>
                    <span>
                        <label>Email</label>
                        <input type="text" placeholder='Enter your Username' onChange={(e) => setEmail(e.target.value)}/>
                    </span>
                    <span>
                        <label>Password</label>
                        <input type="password"  placeholder='Enter your Password' onChange={(e) => setPassword(e.target.value)}/>
                    </span>
                    <span>
                        <input type="submit" value="Submit"/>
                    </span>
                </form>
                    <Link to='/'>Login</Link>
            </span>
            </div>
            <img id='rside' src={process.env.PUBLIC_URL+'/flight.png'} />
        </>
    )
}

export default Login