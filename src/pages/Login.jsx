// Login.jsx
import styles from './Login.module.css'
import icon from './IconDashboardGamificado.png'

export function Login({ onLogin }) {
  return (
    <div className={styles.containerPrincipal}>
      <div className={styles.container}>
        <h1 className={styles.nomeDoSite}>KillTheDay</h1>
        <p className={styles.fraseImpacto}>O dia te testa. Você responde vencendo.</p>
          <div className={styles.box}>
            <img className={styles.icon} src={icon} alt="Logo do Dashboard Gamificado"/>
            <h2>Login</h2>
            <h3 className={styles.label}>Email</h3>
            <input placeholder="seu@email.com" className={styles.input} />
            <h3 className={styles.label}>Senha</h3>
            <input type="password" placeholder="******" className={styles.input}/>
            <button className={styles.button} onClick={onLogin}>Entrar</button>
          </div>
        <footer className={styles.footer}>
          © 2026 Emerson Danillo. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  )
}