import { useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import './App.css'

const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#1877F2"/>
    <path fill="white" d="M15 12h-2v7h-3v-7H8v-3h2V7.5C10 5 11.5 4 14 4h2v3h-1.5c-.7 0-1 .3-1 1V9h2.5L15 12z"/>
  </svg>
)

const TikTokIcon = (props) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="black" {...props}>
    <path d="M19.321 5.562a5.124 5.124 0 0 1-3.177-1.105 5.05 5.05 0 0 1-1.772-3.032h-3.184v13.52c0 1.61-1.308 2.918-2.918 2.918s-2.918-1.308-2.918-2.918 1.308-2.918 2.918-2.918c.273 0 .537.038.79.108V9.015a6.09 6.09 0 0 0-.79-.051C4.01 8.964 1 11.974 1 15.674S4.01 22.383 7.71 22.383s6.71-3.01 6.71-6.71V8.944a8.244 8.244 0 0 0 4.9 1.615V7.457a5.072 5.072 0 0 1-.0-1.895z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <defs>
      <radialGradient id="instaRadial" cx="0.2" cy="1" r="1.2">
        <stop offset="0.1" stopColor="#FFD600" />
        <stop offset="0.4" stopColor="#FF0100" />
        <stop offset="1" stopColor="#D800B9" />
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#instaRadial)"/>
    <rect x="5" y="5" width="14" height="14" rx="4" stroke="white" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="3.5" stroke="white" strokeWidth="2" fill="none" />
    <circle cx="17.5" cy="6.5" r="1" fill="white" />
  </svg>
)

const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8.1 3.2l6-6C34.5 2.7 29.6 0 24 0 14.7 0 6.6 5.4 2.7 13.2l7.5 5.8C12 13.3 17.5 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.7-.1-3.3-.4-4.8H24v9.1h12.7c-.5 2.7-2 5-4.3 6.6l6.6 5.1C43.8 36.5 46.5 31 46.5 24.5z"/>
    <path fill="#FBBC05" d="M10.2 28.9c-.5-1.5-.8-3.1-.8-4.9s.3-3.4.8-4.9l-7.5-5.8C1 16.3 0 20 0 24s1 7.7 2.7 10.7l7.5-5.8z"/>
    <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.7l-6.6-5.1c-1.8 1.2-4.2 1.9-9.4 1.9-6.5 0-12-3.8-13.8-9.5l-7.5 5.8C6.6 42.6 14.7 48 24 48z"/>
  </svg>
)

function App() {
  // Estados para guardar lo que escribe el usuario
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Estado para saber si estamos en modo Login o Registro
  const [isLogin, setIsLogin] = useState(true)
  
  // Estado para mensajes (éxito o error)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    // Decidimos a qué ruta llamar dependiendo del modo
    const endpoint = isLogin ? '/api/login' : '/api/register'
    
    try {
      const response = await axios.post(`http://localhost:3000${endpoint}`, {
        email: email,
        password: password
      })

      setMessage(`✅ ${response.data.message}`)
      
      // Si fue registro exitoso, limpiar campos
      if (!isLogin) {
        setEmail('')
        setPassword('')
      }

    } catch (error) {
      console.error(error)
      if (error.response) {
        setMessage(`❌ ${error.response.data.message}`)
      } else {
        setMessage('❌ Error al conectar con el servidor')
      }
    }
  }

  return (
    <div className="app-container">
      <div className="auth-card">
        <TikTokIcon className="tiktok-icon" />
        <h2>{isLogin ? 'Inicia sesión en TikTok' : 'Regístrate en TikTok'}</h2>

        <div className="social-login-options">
          <button className="social-btn phone-email">
            <FontAwesomeIcon icon={faUser} className="social-icon user" />
            Usar teléfono / correo / nombre de usuario
          </button>
          <button className="social-btn facebook">
            <FacebookIcon />
            Continuar con Facebook
          </button>
          <button className="social-btn google">
            <GoogleIcon />
            Continuar con Google
          </button>
          <button className="social-btn instagram">
            <InstagramIcon />
            Continuar con Instagram
          </button>
        </div>

        <p className="divider">O</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            required
          />

          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />

          {isLogin && (
            <button type="button" className="forgot-password">
              ¿Olvidaste la contraseña?
            </button>
          )}

          <button type="submit" disabled={!email || !password}>
            {isLogin ? 'Iniciar sesión' : 'Registrarse'}
          </button>
        </form>

        {message && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>}

        <div className="bottom-text">
          {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          <button 
            className="toggle-link" 
            onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
          >
            {isLogin ? ' Regístrate' : ' Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
