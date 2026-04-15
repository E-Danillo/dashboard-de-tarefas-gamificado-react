// Login.jsx
import styles from './Login.module.css'
import icon from './IconDashboardGamificado.png'

export function Login({ onLogin }) {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.box}>
        <img className={styles.icon} src={icon} alt="Logo do Dashboard Gamificado"/>
          <h1>Login</h1>
          <h3 className={styles.label}>Email</h3>
          <input placeholder="seu@email.com" className={styles.input} />
          <h3 className={styles.label}>Senha</h3>
          <input type="password" placeholder="******" className={styles.input}/>
          <button className={styles.button} onClick={onLogin}>Entrar</button>
        </div>
      </div>
    </div>
  )
}