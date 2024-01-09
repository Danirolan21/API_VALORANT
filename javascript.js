const btnHome = document.getElementById('Home');
const btnAgents = document.getElementById('Agents');
const btnWeapons = document.getElementById('Weapons');
const carousel = document.getElementById("carousel");
const sliderTrack = document.querySelector(".gallery ul");
const divAgentDescription = document.getElementById("AgentDescription");
const divArmas = document.getElementById('armas');
const listaArmas = document.querySelector(".listaArmas");
const video = document.getElementById('video-background');
const plantilla = document.querySelector("template.plantilla").content;
const url = "https://valorant-api.com/v1/agents";
const urlWeapons = "https://valorant-api.com/v1/weapons";
const uuidList = new Set(); // Utilizamos un Set para almacenar los uuid únicos de los agentes
let elementosLi = document.querySelectorAll('#carousel ul li');
let arrayFromSet = Array.from(uuidList);

async function getCharacters() {
    const response = await fetch(url);
    const json = await response.json();
    return json;
}
async function getCharactersPerUUID(uuid) {
    const urlFetch = `${url}/${uuid}`;
    const response = await fetch(urlFetch);
    const json = await response.json();
    return json;
}
async function getWeapons() {
    const response = await fetch(urlWeapons);
    const json = await response.json();
    return json;
}

function MostrarAgentes() {
    getCharacters().then((Agents) => {
        getUuids(Agents);
        getAgentsDescription(arrayFromSet[[Math.floor(Math.random() * 23)]]);
        getImages(Agents);
    });
}
function getUuids(Agents) {
    Agents.data.forEach((element) => {
        if (element.isPlayableCharacter) {
            uuidList.add(element.uuid);
        }
    });
    arrayFromSet = Array.from(uuidList);
}
btnHome.addEventListener('click', e => {
    carousel.classList.add("hide");
    divAgentDescription.classList.add("hide");
    divArmas.classList.add("hide");
    video.classList.remove("hide");
});
btnWeapons.addEventListener('click', e => {
    carousel.classList.add("hide");
    divAgentDescription.classList.add("hide");
    divArmas.classList.remove("hide");
    video.classList.add("hide");
});
btnAgents.addEventListener('click', e => {
    carousel.classList.remove("hide");
    divAgentDescription.classList.remove("hide");
    divArmas.classList.add("hide");
    video.classList.add("hide");
});
function getAgentsDescription(uuid) {
    divAgentDescription.innerHTML = "";

    getCharactersPerUUID(uuid)
        .then((Agent) => {
        const fragment = document.createDocumentFragment();

        plantilla.querySelector("#AgentDescription-BackgroundImage img").src =
            Agent.data.background;
        plantilla.querySelector("#AgentDescription-Image img").src =
            Agent.data.fullPortrait;
        plantilla.querySelector(".primaryRole").textContent =
            Agent.data.role.displayName;
        plantilla.querySelector(".name").textContent = Agent.data.displayName;
        plantilla.querySelector(".description").textContent =
            Agent.data.description;
        plantilla.querySelector(".role").textContent = Agent.data.role.displayName;
        plantilla.querySelector(".roleDescription").textContent =
            Agent.data.role.description;

        const abilitiesTable = plantilla.querySelectorAll(".abilities td");

        abilitiesTable.forEach((element, index) => {
            if (index > 0) {
                element.querySelector("img").src =
                    Agent.data.abilities[index - 1].displayIcon;
            } else {
                element.querySelector("img").src = Agent.data.role.displayIcon;
            }
        });

        const clone = plantilla.cloneNode(true);

        divAgentDescription.style.opacity = '1';

        fragment.appendChild(clone);

        divAgentDescription.appendChild(fragment);
    });
}
// Función para obtener las imágenes de los agentes y mostrarlas en el slider
function getImages(Agents) {
    let count = 1;

    Agents.data.forEach((element) => {
        if (element.isPlayableCharacter) {
            uuidList.add(element.uuid);
            const slide = document.createElement("li");
            const img = document.createElement("img");
            img.setAttribute("src", element.displayIcon);
            img.setAttribute("alt", count);
            slide.appendChild(img);

            sliderTrack.appendChild(slide);
            
            count++;
        }
    });
    console.log(carousel);

    // Agregar eventos después de que se han agregado las imágenes dinámicamente
    const elementosLi = document.querySelectorAll('#carousel ul li');

    elementosLi.forEach(element => {
        element.addEventListener("click", () => {
            // Obtener el número del atributo 'alt' de la imagen dentro del li
            const numero = parseInt(element.querySelector('img').getAttribute('alt'));

            // Obtener el uuid correspondiente al número seleccionado
            const uuid = arrayFromSet[numero - 1];

            // Llamar a la función getAgentsDescription con el uuid obtenido
            getAgentsDescription(uuid);
        });
    });
}
function MostrarArmas() {
    getWeapons()
        .then( Weapon => {
            let tiposArmas = new Set();
            Weapon.data.forEach(element => {
                if (element.shopData && element.shopData.category) {
                    tiposArmas.add(element.shopData.category);
                }
            });
            tiposArmas.forEach( element => {
                const className = element.replace(/\s+/g, '_');
                const div = document.createElement("div");
                const h3 = document.createElement("h3");
                h3.textContent = element;
                h3.classList.add('text-white');
                div.classList.add(className);
                console.log(className);

                div.appendChild(h3);
                listaArmas.appendChild(div);
                
                // Filtrar las armas por categoría y adjuntar imágenes a los divs correspondientes
                Weapon.data.forEach(weapon => {
                    if (weapon.shopData && weapon.shopData.category === element) {
                        const img = document.createElement("img");
                        img.setAttribute("src", weapon.displayIcon);

                        // Adjuntar la imagen al div correspondiente a su categoría
                        div.appendChild(img);
                    }
                });
            });
        });
}


// Mostrar la primera página al cargar
window.addEventListener("load", () => {
    MostrarAgentes();
    MostrarArmas();
});