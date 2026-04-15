import { useState, useEffect } from "react"
import './App.css'
import { Login } from './pages/Login'

function App() {

  const [inputTexto, setInputTexto] = useState('')
  const [prioridade, setPrioridade] = useState('Alta')
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [textoEditado, setTextoEditado] = useState("")
  
  const [conquistas, setConquistas] = useState(() => {
    const salvo = localStorage.getItem("conquistas")
    return salvo ? JSON.parse(salvo) : [
      { id: 0, nome: "Novo eu!", descricao: "Conclua sua primeira tarefa", desbloqueada: false, xpGanho: 200 },
      { id: 1, nome: "Está muito fácil!", descricao: "Conclua 10 tarefas de prioridade Alta", desbloqueada: false, xpGanho: 500 },
      { id: 2, nome: "Aprendiz das tarefas", descricao: "Chegue ao nível 10", desbloqueada: false, xpGanho: 1000 },
    ]
  })

  const [login, setLogin] = useState(() => {
    const loginSalvo = JSON.parse(localStorage.getItem("login"))
    return loginSalvo ? JSON.parse(loginSalvo) : false
  })

  const [listaDeTarefas, setListaDeTarefas] = useState(() => {
    const salvo = localStorage.getItem("listaDeTarefas")
    return salvo ? JSON.parse(salvo) : []
  })

  const [idTarefa, setIdTarefa] = useState(() => {
    const salvo = localStorage.getItem("idTarefa")
    return salvo ? JSON.parse(salvo) : 0
  })

  const [xp, setXp] = useState(() => {
    const salvo = localStorage.getItem("xp")
    return salvo ? JSON.parse(salvo) : 0
  })

  // 🔥 NOVO
  const [totalAltasConcluidas, setTotalAltasConcluidas] = useState(() => {
    const salvo = localStorage.getItem("totalAltasConcluidas")
    return salvo ? JSON.parse(salvo) : 0
  })

  useEffect(() => {
    localStorage.setItem("xp", JSON.stringify(xp))
    localStorage.setItem("listaDeTarefas", JSON.stringify(listaDeTarefas))
    localStorage.setItem("idTarefa", JSON.stringify(idTarefa))
    localStorage.setItem("conquistas", JSON.stringify(conquistas))
    localStorage.setItem("totalAltasConcluidas", JSON.stringify(totalAltasConcluidas)) // 🔥 NOVO
  }, [listaDeTarefas, xp, idTarefa, conquistas, totalAltasConcluidas])

  function calcularNivel(xp) {
    let nivel = 1
    let xpAcumulado = 0

    while (true) {
      let xpNecessario = 200 * Math.pow(1.5, nivel - 1)
      if (xp < xpAcumulado + xpNecessario) break
      xpAcumulado += xpNecessario
      nivel++
    }

    return { nivel, xpAcumulado }
  }

  function adicionarTarefa() {
    if (inputTexto === "") return

    const novaTarefa = {
      id: idTarefa,
      texto: inputTexto,
      concluida: false,
      prioridade: prioridade
    }

    setListaDeTarefas([...listaDeTarefas, novaTarefa])
    setIdTarefa(idTarefa + 1)
    setInputTexto("")
    setFormularioAberto(false)
  }

  function iniciarEdicao(tarefa) {
    setEditandoId(tarefa.id)
    setTextoEditado(tarefa.texto)
  }

  function salvarEdicao(id) {
    if (textoEditado.trim() === "") return

    const novaLista = listaDeTarefas.map(t =>
      t.id === id ? { ...t, texto: textoEditado } : t
    )

    setListaDeTarefas(novaLista)
    setEditandoId(null)
    setTextoEditado("")
  }

  function excluirTarefa(id) {
    setListaDeTarefas(listaDeTarefas.filter(t => t.id !== id))
  }

  function concluirTarefa(id) {
    const tarefa = listaDeTarefas.find(t => t.id === id)
    if (!tarefa || tarefa.concluida) return

    const novaLista = listaDeTarefas.map(t =>
      t.id === id ? { ...t, concluida: true } : t
    )

    let novoXp = xp

    if (tarefa.prioridade === "Alta") {
      novoXp += 100
      setTotalAltasConcluidas(prev => prev + 1) // 🔥 NOVO
    }
    else if (tarefa.prioridade === "Média") novoXp += 50
    else novoXp += 25

    setListaDeTarefas(novaLista)
    verificarConquistas(novaLista, novoXp)
  }

  function calcularPorcentagem() {
    const { nivel, xpAcumulado } = calcularNivel(xp)
    const xpNecessario = 200 * Math.pow(1.5, nivel - 1)
    const xpNoNivelAtual = xp - xpAcumulado
    return (xpNoNivelAtual / xpNecessario) * 100
  }

  function verificarConquistas(novaLista, novoXp) {
    const totalConcluidas = novaLista.filter(t => t.concluida).length
    const { nivel } = calcularNivel(novoXp)

    let novasConquistas = [...conquistas]
    let xpBonus = 0

    if (novasConquistas[0] && totalConcluidas >= 1 && !novasConquistas[0].desbloqueada) {
      novasConquistas[0] = { ...novasConquistas[0], desbloqueada: true }
      xpBonus += novasConquistas[0].xpGanho
    }

    // 🔥 usa contador permanente
    if (novasConquistas[1] && totalAltasConcluidas >= 10 && !novasConquistas[1].desbloqueada) {
      novasConquistas[1] = { ...novasConquistas[1], desbloqueada: true }
      xpBonus += novasConquistas[1].xpGanho
    }

    if (novasConquistas[2] && nivel >= 10 && !novasConquistas[2].desbloqueada) {
      novasConquistas[2] = { ...novasConquistas[2], desbloqueada: true }
      xpBonus += novasConquistas[2].xpGanho
    }

    setConquistas(novasConquistas)
    setXp(novoXp + xpBonus)
  }

if (!login) {
  return (
    <Login onLogin={() => {
      setLogin(true)
      localStorage.setItem("login", "true")
    }} />
  )
}

  return (
    <div id="div-main">
      <div id="div-principal">
        <h1>Dashboard</h1>

        <p>Nível: {calcularNivel(xp).nivel}</p>
        <p>XP: {xp}</p>

        <div id="barra_nivel">
          <div id="barra_xp" style={{ width: calcularPorcentagem() + "%" }}></div>
        </div>

        <button id="criar_nova_tarefa" onClick={() => setFormularioAberto(true)}>Nova Tarefa</button>

        <div className={`div_do_formulario ${formularioAberto ? "ativada" : ""}`}>
          <input
            id="input"
            type="text"
            value={inputTexto}
            onChange={(e) => setInputTexto(e.target.value)}
            placeholder="Nome da tarefa"
          />

          <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
            <option>Alta</option>
            <option>Média</option>
            <option>Baixa</option>
          </select>

          <div id="botoes-formulario">
            <button id="adicionar" onClick={adicionarTarefa}>Adicionar</button>
            <button id="cancelar" onClick={() => setFormularioAberto(false)}>Cancelar</button>
          </div>
        </div>

        <ul id="lista_de_tarefas">
          {listaDeTarefas.map(tarefa => (
            <li key={tarefa.id}>
              {editandoId === tarefa.id ? (
              <>
                <input
                  value={textoEditado}
                  onChange={(e) => setTextoEditado(e.target.value)}
                  onKeyDown={(e) => {
                      if (e.key === "Enter") salvarEdicao(tarefa.id)
                    }}
                />
                <>
                  <button onClick={() => salvarEdicao(tarefa.id)}>Salvar</button>
                  <button onClick={() => setEditandoId(null)}>Cancelar</button>
                </>              </>
            ) : (
              <>
                <span style={{
                  textDecoration: tarefa.concluida ? "line-through" : "none",
                  opacity: tarefa.concluida ? "0.6" : "1"
                }}>
                  {tarefa.prioridade === "Alta" ? "🔴" : tarefa.prioridade === "Média" ? "🟠" : "🟡"} {tarefa.texto}
                </span>

                <button onClick={() => excluirTarefa(tarefa.id)}>❌</button>
                <button onClick={() => concluirTarefa(tarefa.id)} disabled={tarefa.concluida}>✅</button>
                <button onClick={() => iniciarEdicao(tarefa)}>✏️</button>
              </>
            )}
          </li>
          ))}
        </ul>
      </div>

      <div id="container_conquistas">
        <h2>🏆 Conquistas</h2>
        <ul id="conquistas">
          {conquistas.map(c => (
            <li key={c.id} className={c.desbloqueada ? "desbloqueada" : ""}>
              {c.desbloqueada ? "🏆" : "🔒"} {c.nome}
              <p style={{ fontSize: "12px" }}>{c.descricao}</p>
              {c.id === 1 && !c.desbloqueada && (
                <p style={{ fontSize: "12px" }}>
                  {totalAltasConcluidas}/10 concluídas
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>    
        <button onClick={() => {
          setLogin(false)
          localStorage.setItem("login","false")
        }} id="sair">Sair</button>
      </div>

    </div>
  )
}

export default App