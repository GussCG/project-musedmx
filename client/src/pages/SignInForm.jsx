import React, {useRef, useEffect, useState} from 'react'

import '../styles/pages/SignInPage.scss'

import userPlaceholder from '../assets/images/placeholders/user_placeholder.png'

import eyeOpenIcon from '../assets/icons/eye-opened-icon.png'
import eyeClosedIcon from '../assets/icons/eye-closed-icon.png'
import AuthLayout from '../layouts/AuthLayout'

function SignInForm() {

    // Para mostrar o no la contraseña
    const [shown1, setShown1] = useState(false);
    const [shown2, setShown2] = useState(false);

    const switchShown1 = () => {
        setShown1(!shown1);
    }

    const switchShown2 = () => {
        setShown2(!shown2);
    }

    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const signInButtonRef = useRef(null);
    const passwordRef = useRef(null);
    const password2Ref = useRef(null);

    // Para el rango de costo
    const [costo, setCosto] = useState("");
    const [valorRango, setValorRango] = useState(0);
    const [rangoHabilitado, setRangoHabilitado] = useState(false);

    const handleCostoChange = (event) => {
        const seleccion = event.target.value;
        setCosto(seleccion);

        if (seleccion === "Siempre con costo" || seleccion === "A veces gratis") {
            setRangoHabilitado(true);
        } else {
            setRangoHabilitado(false);
            setValorRango(0); // Reseteamos el valor del rango
        }
    }

    const handleRangoChange = (event) => {
        setValorRango(event.target.value);
    }

    // Para el cambio de imagen de perfil
    const [imagePreview, setImagePreview] = useState(userPlaceholder);
    const imageInputRef = useRef(null);

    const handleImageChange = (event) => {
        setImagePreview(URL.createObjectURL(event.target.files[0]));
    }

    // Para la logica de seleccion de tematicas
    const [selectedTematicas, setSelectedTematicas] = useState([]);

    const handleTematicaChange = (event) => {
        const {value, checked} = event.target;

        setSelectedTematicas((prev) => {
            if (checked && prev.length < 3) {
                return [...prev, value];
            } else if (!checked) {
                return prev.filter((tematica) => tematica !== value);
            }

            return prev;
        });
    }

    useEffect(() => {
        let password = passwordRef.current;
        let password2 = password2Ref.current;
        let signInButton = signInButtonRef.current;

        // Validamos las contraseña y la confirmacion de la contraseña
        // Si son iguales se pinta de verde y se activa el boton de registro
        if (signInButton) {
            signInButton.disabled = true;
        }

        const validatePasswords = () => {

            if (password2.value == "") {
                password2.style.borderColor = "black";
                password2.style.borderWidth = "1px";
                password2.setCustomValidity("");
                signInButton.disabled = true;
                return;
            }

            if (password.value !== password2.value) {
                password2.setCustomValidity("Las contraseñas no coinciden");
                password2.style.borderColor = "red";
                password2.style.borderWidth = "2px";
                signInButton.disabled = true;
            } else {
                password2.setCustomValidity("");
                password2.style.borderColor = "green";
                password2.style.borderWidth = "2px";
                signInButton.disabled = false;
            }
        };

        password?.addEventListener("input", validatePasswords);
        password2?.addEventListener("input", validatePasswords);

        return () => {
            password?.removeEventListener("input", validatePasswords);
            password2?.removeEventListener("input", validatePasswords);
        };        
    }, []);

  return (
    <>
        <main id="registros-main">
            <div id="registros-form">
                <h1>Datos Personales</h1>
                <form action="#" >
                    <div className="registros-field">
                        <input type="text" id="signin-frm-nombre" name="signin-frm-nombre" placeholder="Nombre" required /><label htmlFor="signin-frm-nombre" className="frm-label">Nombre</label>
                    </div>
                    <div className="registros-field">
                        <input type="text" id="signin-frm-appaterno" name="signin-frm-appaterno" placeholder="Apellido Paterno" required /><label htmlFor="signin-frm-appaterno" className="frm-label">Apellido Paterno</label>
                    </div>
                    <div className="registros-field">
                        <input type="text" id="signin-frm-apmaterno" name="signin-frm-apmaterno" placeholder="Apellido Materno" required /><label htmlFor="signin-frm-apmaterno" className="frm-label">Apellido Materno</label>
                    </div>         
                    <div className="registros-field">
                        <input type="email" id="signin-frm-email" name="signin-frm-email" placeholder="Correo Electrónico" required /><label htmlFor="signin-frm-email" className="frm-label">Correo Electrónico</label>
                    </div>       
                    <div className="registros-field">
                        <input type="tel" id="signin-frm-telefono" name="signin-frm-telefono" placeholder="Teléfono" required /><label htmlFor="signin-frm-telefono" className="frm-label">Teléfono</label>
                    </div>
                    <div className="registros-field">
                        <input type="date" id="signin-frm-fecnac" name="signin-frm-fecnac" placeholder="Fecha de Nacimiento" required /><label htmlFor="signin-frm-fecnac" className="frm-label">Fecha de Nacimiento</label>
                    </div>
                    <div className="registros-field">
                        <input 
                            type={shown1 ? 'text' : 'password'} 
                            id="signin-frm-password" 
                            name="signin-frm-password" 
                            placeholder="Contraseña" 
                            ref={passwordRef} 
                            onChange={(e) => setPassword(e.target.value)}
                            value={password} 
                            required />
                            <label htmlFor="signin-frm-password" className="frm-label">Contraseña</label>
                        <img 
                            src={shown1 ? eyeOpenIcon : eyeClosedIcon}
                            onClick={switchShown1}
                            alt="Mostrar contraseña" 
                            id="eye" 
                            className='eye'
                        />
                    </div>
                    <div className="registros-field">
                        <input 
                            type={shown2 ? 'text' : 'password'} 
                            id="signin-frm-repassword" 
                            name="signin-frm-repassword" 
                            placeholder="Repetir Contraseña" 
                            ref={password2Ref}
                            onChange={(e) => setPassword2(e.target.value)}
                            value={password2}
                            required
                            />
                            <label htmlFor="signin-frm-repassword" className="frm-label">Repetir Contraseña</label>
                        <img 
                            src={shown2 ? eyeOpenIcon : eyeClosedIcon}
                            onClick={switchShown2}
                            alt="Mostrar contraseña" 
                            id="eye2" 
                            className='eye'
                        />
                    </div>
                </form>
            </div>
            <div id="registros-linea"></div>
            <div id="registros-preferencias">
                <h1>Preferencias</h1>
                <div className="registros-chks">
                    <fieldset>
                        <legend>Selecciona tus temáticas favoritas (3 máx)</legend>
                        <div className="registros-chk-container">
                            <div className="registros-chk">
                                <input 
                                    type="checkbox" 
                                    id="antropologia" 
                                    name="signin-frm-tematica" 
                                    value="Antropología"
                                    onChange={handleTematicaChange}
                                    checked={selectedTematicas.includes("Antropología")}
                                />
                                <label htmlFor="antropologia">Antropología</label>
                            </div>
                            <div className="registros-chk">
                                <input 
                                    type="checkbox" 
                                    id="arte" 
                                    name="signin-frm-tematica" 
                                    value="Arte" 
                                    onChange={handleTematicaChange}
                                    checked={selectedTematicas.includes("Arte")}
                                />
                                <label htmlFor="arte">Arte</label>
                            </div>
                            <div className="registros-chk">
                                <input 
                                    type="checkbox" 
                                    id="arte-alternativo" 
                                    name="signin-frm-tematica" 
                                    value="Arte Alternativo" 
                                    onChange={handleTematicaChange}
                                    checked={selectedTematicas.includes("Arte Alternativo")}
                                />
                                <label htmlFor="arte-alternativo">Arte Alternativo</label>
                            </div>
                            <div className="registros-chk">
                                <input 
                                    type="checkbox" 
                                    id="arqueologia" 
                                    name="signin-frm-tematica" 
                                    value="Arqueología" 
                                    onChange={handleTematicaChange}
                                    checked={selectedTematicas.includes("Arqueología")}
                                />
                                <label htmlFor="arqueologia">Arqueología</label>
                            </div>
                            <div className="registros-chk">
                                <input 
                                    type="checkbox" 
                                    id="ciencia-tecnologia" 
                                    name="signin-frm-tematica" 
                                    value="Ciencia y Tecnología" 
                                    onChange={handleTematicaChange}
                                    checked={selectedTematicas.includes("Ciencia y Tecnología")}
                                />
                                <label htmlFor="ciencia-tecnologia">Ciencia y Tecnología</label>
                            </div>
                            <div className="registros-chk">
                                <input 
                                    type="checkbox" 
                                    id="especializado" 
                                    name="signin-frm-tematica" 
                                    value="Especializado" 
                                    onChange={handleTematicaChange}
                                    checked={selectedTematicas.includes("Especializado")}
                                />
                                <label htmlFor="especializado">Especializado</label>
                            </div>
                            <div className="registros-chk">
                                <input 
                                    type="checkbox" 
                                    id="historia" 
                                    name="signin-frm-tematica" 
                                    value="Historia" 
                                    onChange={handleTematicaChange}
                                    checked={selectedTematicas.includes("Historia")}
                                />
                                <label htmlFor="historia">Historia</label>
                            </div>
                            <div className="registros-chk">
                                <input 
                                    type="checkbox" 
                                    id="otro" 
                                    name="signin-frm-tematica" 
                                    value="Otro" 
                                    onChange={handleTematicaChange}
                                    checked={selectedTematicas.includes("Otro")}
                                />
                                <label htmlFor="otro">Otro</label>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div className="registros-field">
                    <select name="signin-frm-costo" className="registros-frm-select" id="registros-frm-costo" value={costo} onChange={handleCostoChange} required>
                        <option value="" disabled>Selecciona un tipo de costo</option>
                        <option value="Siempre gratis">Siempre gratis</option>
                        <option value="A veces gratis">A veces gratis</option>
                        <option value="Siempre con costo">Siempre con costo</option>
                    </select>
                </div>
                <div className="registros-field-rango">
                    <label htmlFor="registros-frm-rango-costo" id="frm-costo-label">Rango de Costo: $ <output>{valorRango}</output> MXN</label>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5" 
                        value={valorRango} 
                        id="registros-frm-rango-costo" 
                        name="signin-frm-rango-costo" 
                        placeholder="Rango de Costo" 
                        list="rango-costo"
                        onChange={handleRangoChange}
                        disabled={!rangoHabilitado} 
                        required 
                    />
                </div>
                <hr/>
                <div className="registros-field-foto">
                    <div className="registros-field-foto-input">
                        <h2>Foto de Perfil</h2>
                        <input 
                            type="file" 
                            id="registros-frm-foto" 
                            name="signin-frm-foto" 
                            accept="image/*" 
                            ref={imageInputRef}
                            onChange={handleImageChange}
                            required 
                        />
                    </div>
                    <img 
                        src={imagePreview} 
                        alt="Foto de Perfil" 
                        id="foto-preview" 
                    />
                </div>
            </div>
            <input type="submit" value="Registrarse" id="registros-button" ref={signInButtonRef} />
        </main>
    </>
  )
}

export default SignInForm