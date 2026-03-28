import { useState } from "react"

function App() {

  // useState: variável que quando muda, atualiza a tela automaticamente
  // jeito de escrever => [valor, função que muda o valor] = useState(valor inicial)
  const [listaDeTarefas, setListaDeTarefas] = useState([])
  const [idTarefa, setIdTarefa] = useState(0)
  const [xp, setXp] = useState(0)
  const [inputTexto, setInputTexto] = useState('')
  const [prioridade, setPrioridade] = useState('Alta')
  const [formularioAberto, setFormularioAberto] = useState(false)

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

return (
  <div>
    <h1>Dashboard</h1>
    <p>Nível: {calcularNivel(xp).nivel}</p>
    <p>XP: {xp}</p>

    <button onClick={() => setFormularioAberto(true)}>Nova Tarefa</button>

    {/* se formularioAberto for true, mostra o div. Se for false, não mostra nada. */}
    {formularioAberto && (
      <div>
        <input
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
        <button onClick={adicionarTarefa}>Adicionar</button>
        <button onClick={() => setFormularioAberto(false)}>Cancelar</button>
      </div>
    )}

    {/* "para cada `tarefa` do array listaDeTarefas, cria um `<li>` com o texto e a prioridade dela." */}
    <ul> 
        {listaDeTarefas.map(tarefa => (
          <li key = {tarefa.id}>
            {<span style={{ textDecoration: tarefa.concluida ? "line-through" : "none", opacity: tarefa.concluida ? "0.6" : "1" }}>{tarefa.texto}</span>} - {tarefa.prioridade}
            <button onClick={() => excluirTarefa(tarefa.id)}>❌</button>
            <button onClick={() => concluirTarefa(tarefa.id)}>✅</button>
          </li>
        ))}
    </ul>
  </div>
)
}

export default App