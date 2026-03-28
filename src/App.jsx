import { useState, useEffect } from "react"
import './App.css'


function App() {

  // useState: variável que quando muda, atualiza a tela automaticamente
  // jeito de escrever => [valor, função que muda o valor] = useState(valor inicial)
  const [inputTexto, setInputTexto] = useState('')
  const [prioridade, setPrioridade] = useState('Alta')
  const [formularioAberto, setFormularioAberto] = useState(false)

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

useEffect(() => {
  localStorage.setItem("xp", JSON.stringify(xp))
  localStorage.setItem("listaDeTarefas", JSON.stringify(listaDeTarefas))
  localStorage.setItem("idTarefa", JSON.stringify(idTarefa))
}, [listaDeTarefas, xp, idTarefa])

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

    // spread (...): copia tudo da lista antiga([]) + adiciona a nova tarefa
    // pois nunca modificamos a lista diretamente, sempre criamos uma nova
    setListaDeTarefas([...listaDeTarefas, novaTarefa])
    setIdTarefa(idTarefa + 1)
    setInputTexto("")
    setFormularioAberto(false)
  }

  function excluirTarefa(id) {
    setListaDeTarefas(listaDeTarefas.filter(t => t.id !== id))
  }

  function concluirTarefa(id) {
    setListaDeTarefas(listaDeTarefas.map(t => {
      if (t.id === id) {
        return { ...t, concluida: true}
      }
      return t
    }))

    const tarefa = listaDeTarefas.find(t => t.id === id)
    if (tarefa.prioridade === "Alta") {
      setXp(xp + 100)
    } else if (tarefa.prioridade === "Média") {
      setXp(xp + 50)
    } else {
      setXp(xp + 25)
    }
  }

  function calcularPorcentagem() {
    const { nivel, xpAcumulado } = calcularNivel(xp)
    const xpNecessario = 200 * Math.pow(1.5, nivel - 1)
    const xpNoNivelAtual = xp - xpAcumulado
    return (xpNoNivelAtual / xpNecessario) * 100
  }

return (
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
          <span style={{ textDecoration: tarefa.concluida ? "line-through" : "none", opacity: tarefa.concluida ? "0.6" : "1" }}>
            {tarefa.prioridade === "Alta" ? "🔴" : tarefa.prioridade === "Média" ? "🟠" : "🟡"} {tarefa.texto}
          </span>
          <button onClick={() => excluirTarefa(tarefa.id)}>❌</button>
          <button onClick={() => concluirTarefa(tarefa.id)} disabled={tarefa.concluida}>✅</button>
        </li>
      ))}
    </ul>
  </div>
)
}

export default App