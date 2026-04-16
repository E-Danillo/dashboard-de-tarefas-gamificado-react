import { useState } from 'react'
import styles from './Login.module.css'
import icon from './IconDashboardGamificado.png'

export function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  // Se os campos estiverem vazios, mostra alerta:
    function handleLogin() {
      if (email === '' || senha === '') {
        alert('Preencha todos os campos')
        return
      } 
      onLogin() // clica em Entrar → handleLogin valida → chama onLogin() → App seta login=true → dashboard
  }

  return (
    <div className={styles.containerPrincipal}>
      <div className={styles.container}>
        <h1 className={styles.nomeDoSite}>KillTheDay</h1>
        <p className={styles.fraseImpacto}>O dia te testa. Você responde vencendo.</p>
          <div className={styles.box}>
            <img className={styles.icon} src={icon} alt="Logo do Dashboard Gamificado"/>
            <h2>Login</h2>

            <h3 className={styles.label}>Email</h3>
            <input 
            placeholder="seu@email.com" 
            className={styles.input}  
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>

            <h3 className={styles.label}>Senha</h3>
            <input 
            type="password" 
            placeholder="******" 
            className={styles.input}   
            value={senha}
            onChange={(e) => setSenha(e.target.value)}/>

            <button className={styles.button} onClick={handleLogin}>Entrar</button>
          </div>
        <footer className={styles.footer}>
          © 2026 Emerson Danillo. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  )
}