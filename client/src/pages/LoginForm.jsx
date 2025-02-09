import {Form, Formik} from 'formik'
import { use, useEffect, useState } from 'react'

import loginImage from '../assets/images/others/museo-login-image.png'

import '../styles/pages/LoginPage.scss'

import eyeOpenIcon from '../assets/icons/eye-opened-icon.png';
import eyeClosedIcon from '../assets/icons/eye-closed-icon.png';

import { Link } from 'react-router-dom'

function LoginForm() {

    const [shown, setShown] = useState(false);

    const switchShown = () => {
        setShown(!shown);
    }

    const [password, setPassword] = useState('');

    useEffect(() => {

    }, []);

  return (
    <>
        <main id='login-main'>
            <div id='login-form'>
                <h1>Iniciar Sesión</h1>

                <Formik
                    initialValues={{
                        login_frm_email: '',
                        login_frm_password: ''
                    }}
                    onSubmit={(values) => {
                        console.log(values)
                    }}
                >
                    {({handleChange, handleSubmit, isSubmitting}) => (
                        <Form onSubmit={handleSubmit}>
                        <div className="login-field">
                            <input 
                                type="email" 
                                id="login-frm-email" 
                                name="login_frm_email" 
                                placeholder="Correo Electrónico" 
                                required 
                            />
                            <label htmlFor="login-frm-email">Correo Electrónico</label>
                        </div>
                        <div className="login-field">
                            <input 
                                type={shown ? "text" : "password"} 
                                id="login-frm-password" 
                                name="login_frm_password" 
                                placeholder="Contraseña" 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password}
                                required 
                            />
                            <label htmlFor="login-frm-password">Contraseña</label>
                            <img 
                                src={shown ? eyeOpenIcon : eyeClosedIcon} 
                                onClick={switchShown}
                                alt="Mostrar contraseña" 
                                id="eye"
                                className='eye' 
                            />
                        </div>
                            <input 
                                type="submit" 
                                value="Iniciar" 
                                id="login-button" 
                            />
                        </Form>
                    )}
                </Formik>
                <Link to="/Recuperar">¿Olvidaste tu contraseña?</Link>
                <p>¿No tienes una cuenta aún? <Link to="../Registrarse">Regístrate aquí</Link></p>
            </div>
            <div id="login-linea"></div>
                <div id="login-imagen">
                    <img 
                        src={loginImage} 
                        alt="Login" 
                    />
                </div>
        </main>
    </>
  )
}

export default LoginForm