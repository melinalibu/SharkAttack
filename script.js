
// PAGES

const pages = {
  start: document.querySelector("#pageStart"),
  country: document.querySelector("#pageCountry"),
  activity: document.querySelector("#pageActivity"),
  survive: document.querySelector("#pageSurvive"),
  attack: document.querySelector("#pageAttack"),
  end: document.querySelector("#pageEnd")
};


// BUTTONS

const btnPlay = document.getElementById("btnPlay");
const btnExit = document.getElementById("btnExit");
const btnRestart = document.getElementById("btnRestart");


// SELECTION ELEMENTS

const countryDiv = document.querySelector("#countryDiv");
const activityDiv = document.querySelector("#activityDiv");
const surviveDiv = document.querySelector("#survive");
const attackDiv = document.querySelector("#attack");


// VARIABLES

let selectedCountry = "";
let selectedActivity = "";


// PAGE CONTROL

function showPage(page) {
  Object.values(pages).forEach(p => p.style.display = "none");
  page.style.display = page === pages.start ? "flex" : "block";
}


// EVENT LISTENERS

btnPlay.addEventListener("click", () => showPage(pages.country));
btnExit.addEventListener("click", () => showPage(pages.end));
btnRestart.addEventListener("click", () => showPage(pages.start));
document.getElementById("btnRestart").addEventListener("click", () => location.reload());


// COUNTRY SELECTION

const countries = [
  "USA", "AUSTRALIA", "FIJI", "SOUTH AFRICA", "NEW ZEALAND", "BAHAMAS",
  "BRAZIL", "CANADA", "COSTA RICA", "CROATIA", "EGYPT", "FRANCE", "INDONESIA"
];

const randomCountries = [];
while (randomCountries.length < 3) {
  const randomIndex = Math.floor(Math.random() * countries.length);
  const chosen = countries[randomIndex];
  if (!randomCountries.includes(chosen)) {
    randomCountries.push(chosen);
  }
}

randomCountries.forEach(country => {
  const button = document.createElement("button");
  button.innerText = country;
  button.id = country;
  countryDiv.appendChild(button);

  button.addEventListener("click", async () => {
    selectedCountry = country;
    const data = await loadData(country);
    showPage(pages.activity);
    activityDiv.innerHTML = "";

    if (data?.results) {
      const allActivities = data.results
        .map(r => r.activity)
        .filter(a => a?.trim().length > 0 && a.trim().split(/\s+/).length <= 4);

      const uniqueActivities = [...new Set(allActivities)];
      const count = Math.min(3, uniqueActivities.length);
      const randomActivities = [];

      while (randomActivities.length < count) {
        const act = uniqueActivities[Math.floor(Math.random() * uniqueActivities.length)];
        if (!randomActivities.includes(act)) {
          randomActivities.push(act);
        }
      }

      randomActivities.forEach(activity => {
        const btn = document.createElement("button");
        btn.innerText = activity;
        btn.classList.add("uppercase-text");
        activityDiv.appendChild(btn);

        btn.addEventListener("click", () => {
          selectedActivity = activity;
          showPage(pages.survive);
          showSurvivalButtons();
        });
      });
    }
  });
});


// SHOW SURVIVAL OPTIONS

function showSurvivalButtons() {
  surviveDiv.innerHTML = "";
  const ideas = [
    "DASH IT A FISH.",
"DROP DEAD QUICK.",
"OFFER YOUR EX.",
"SWING FIRST, FAM.",
"MAKE YOURSELF LOOK LARGE, G.",
"BUSS IT UP!",
"BANG THE SHARK'S NOSE.",
"SWIM CALM, SWIM SMART.",
"PULL OUT UNO REVERSE CARD.",
"CHAT TO THE SHARK.",
"OFFER IT YOUR TOE.",
"FLEX ON THE SHARK.",
"THROW A ROCK.",
"SPLASH WATER IN ITS FACE.",
"MAKE A LOT OF NOISE, FAM."
  ];

  const selectedIdeas = [];
  while (selectedIdeas.length < 3) {
    const idea = ideas[Math.floor(Math.random() * ideas.length)];
    if (!selectedIdeas.includes(idea)) {
      selectedIdeas.push(idea);
    }
  }

  selectedIdeas.forEach(idea => {
    const btn = document.createElement("button");
    btn.innerText = idea;
    surviveDiv.appendChild(btn);
    btn.addEventListener("click", () => {
      showPage(pages.attack);
      showAttackResult();
    });
  });
}


// SHOW ATTACK RESULT

async function showAttackResult() {
  const data = await loadData(selectedCountry);
  attackDiv.innerHTML = "";

  if (data?.results) {
    const filtered = data.results.filter(item =>
      item.activity?.toLowerCase().includes(selectedActivity.toLowerCase())
    );

    if (filtered.length > 0) {
      const attack = filtered[Math.floor(Math.random() * filtered.length)];
      const ul = document.createElement("ul");
      ul.classList.add("uppercase-text");

      function createStyledLi(label, value) {
        const li = document.createElement("li");
        li.innerHTML = `${label}: <span class=highlight>${value || "Unknown"}</span>`;
        return li;
      }

      ul.appendChild(createStyledLi("SHARK CAUGHT YOU SLIPPING ON", attack.date));
      ul.appendChild(createStyledLi("Injury", attack.injury));
      ul.appendChild(createStyledLi("Species", attack.species));
      ul.appendChild(createStyledLi("Type", attack.type));

      attackDiv.appendChild(ul);
    } else {
      attackDiv.textContent = "No matching shark attack found.";
    }
  } else {
    attackDiv.textContent = "No data available.";
  }
}


// LOAD DATA FROM API

async function loadData(country) {
  const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/global-shark-attack/records?limit=100&refine=country%3A%22${country}%22`;
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
}
