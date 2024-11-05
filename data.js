class Agente {
    constructor(nombre, rol, habilidades, imagen) {
        this.nombre = nombre
        this.rol = rol
        this.habilidades = habilidades
        this.imagen = imagen
    }
}

async function getAgents() {
    const response = await fetch("https://valorant-api.com/v1/agents")
    const data = await response.json()
    const agents = data.data
        .filter(agent => agent.role)  
        .map(agent => new Agente(
            agent.displayName,
            agent.role.displayName,
            agent.abilities.map(ability => ability.displayName),
            agent.displayIconSmall
        ))
    return agents
}

function renderAgents(agents) {
    const container = document.getElementById('agentsContainer');
    container.innerHTML = "" 
    
    agents.forEach(agent => {
        const agentElement = document.createElement("div")
        agentElement.classList.add("agent-card")
        
        agentElement.innerHTML = `
            <img src="${agent.imagen}" alt="${agent.nombre}">
            <h2>${agent.nombre}</h2>
            <p>Rol: ${agent.rol}</p>
            <h3>Habilidades:</h3>
            <ul>${agent.habilidades.map(habilidad => `<li>${habilidad}</li>`).join('')}</ul>
        `
        
        container.appendChild(agentElement)
    })
}

function setupSearchAndFilter(agents) {
    const searchBar = document.getElementById('searchBar')
    const roleFilter = document.getElementById('roleFilter')
    
    function filterAgents() {
        const searchTerm = searchBar.value.toLowerCase()
        const selectedRole = roleFilter.value

        const filteredAgents = agents.filter(agent => {
            const matchesName = agent.nombre.toLowerCase().includes(searchTerm)
            const matchesRole = selectedRole === "" || agent.rol === selectedRole
            return matchesName && matchesRole
        })

        renderAgents(filteredAgents)
    }

    searchBar.addEventListener("input", filterAgents)
    roleFilter.addEventListener("change", filterAgents)
}



async function init() {
    const agents = await getAgents()
    renderAgents(agents)
    setupSearchAndFilter(agents)
}

init()