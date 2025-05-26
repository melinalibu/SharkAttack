// Seiten

const pageStart = document.querySelector("#pageStart");
const pageCountry = document.querySelector("#pageCountry");
const pageActivity = document.querySelector("#pageActivity");
const pageSurvive = document.querySelector("#pageSurvive");
const pageAttack = document.querySelector("#pageAttack");
const pageEnd = document.querySelector("#pageEnd");

// Buttons
const btnPlay = document.getElementById("btnPlay");
const btnExit = document.getElementById("btnExit");
const btnRestart = document.getElementById("btnRestart");

// Auswahl-Elemente
const countryDiv = document.querySelector("#countryDiv");
const activityDiv = document.querySelector("#activityDiv");
const surviveDiv = document.querySelector("#survive");
const attackDiv = document.querySelector("#attack");

// Variablen
let selectedCountry = "";
let selectedActivity = "";

// Seitensteuerung
function showPage(page) {
  const allPages = [
    pageStart,
    pageCountry,
    pageActivity,
    pageSurvive,
    pageAttack,
    pageEnd
  ];
  allPages.forEach(p => p.style.display = "none");
  page.style.display = "block";
}

// Startbutton
btnPlay.addEventListener("click", () => {
  showPage(pageCountry);
});

// Exit zur Endseite
btnExit.addEventListener("click", () => {
  showPage(pageEnd);
});

// Restart
btnRestart.addEventListener("click", () => {
  showPage(pageStart);
});

// Country-Auswahl
let country = ["USA", "AUSTRALIA", "FIJI", "SOUTH AFRICA", "NEW ZEALAND", "BAHAMAS", "BRAZIL", "CANADA", "COSTA RICA", "CROATIA", "EGYPT", "FRANCE", "INDONESIA"];

let randomCountry = [];
while (randomCountry.length < 3) {
  let randomIndex = Math.floor(Math.random() * country.length);
  let chosenCountry = country[randomIndex]; // Umbenannt!
  if (!randomCountry.includes(chosenCountry)) {
    randomCountry.push(chosenCountry);
  }
}


randomCountry.forEach(country => {
  const button = document.createElement("button");
  button.innerText = country;
  button.id = country;
  countryDiv.appendChild(button);

// Button-Laenderauswahl
  button.addEventListener("click", async () => {
    selectedCountry = country;
    const data = await loadData(country);
    showPage(pageActivity);


//activity-Auswahl
    activityDiv.innerHTML = "";

    if (data && data.results) {
      let allActivities = data.results
        .map(record => record.activity)
        .filter(activity => activity && activity.trim().length > 0 && activity.trim().split(/\s+/).length <= 4);

      let uniqueActivities = [...new Set(allActivities)];
      let anzahl = Math.min(3, uniqueActivities.length);

      let randomActivities = [];
      while (randomActivities.length < anzahl) {
        let index = Math.floor(Math.random() * uniqueActivities.length);
        let act = uniqueActivities[index];
        if (!randomActivities.includes(act)) {
          randomActivities.push(act);
        }
      }
      randomActivities.forEach(activity => {
        const btn = document.createElement("button");
        btn.innerText = activity;
        activityDiv.appendChild(btn);

//activity-Buttons
        btn.addEventListener("click", () => {
          selectedActivity = activity;
          showPage(pageSurvive);
          showSurvivalButtons();
        });
      });
    }
  });
});

// Survival Buttons
function showSurvivalButtons() {
  surviveDiv.innerHTML = "";
  const rescueIdeas = [
    "Dash it a fish.",
    "Drop dead quick.",
    "Offer your ex.",
    "Swing first, fam.",
    "Make yourself look large, G.",
    "Buss It Up!",
    "Bang the shark's nose.",
    "Swim calm, swim smart.",
    "Pull Out Uno reverse card.",
    "Chat to the Shark.",
    "Offer it your least favorite toe.",
    "Flex on the Shark.",
    "Bust a move so cold the shark forgets it's hungry.",
    "Make a lot of noise, fam."
  ];

  // Zufällige Auswahl von 3 Ideen Survival
  let randomRescues = [];
  while (randomRescues.length < 3) {
    let idea = rescueIdeas[Math.floor(Math.random() * rescueIdeas.length)];
    if (!randomRescues.includes(idea)) {
      randomRescues.push(idea);
    }
  }
// Buttons für die Survival-Ideen

  randomRescues.forEach(idea => {
    const btn = document.createElement("button");
    btn.innerText = idea;
    surviveDiv.appendChild(btn);

    btn.addEventListener("click", () => {
      showPage(pageAttack);
      showAttackResult();
    });
  });
}

// Zeige Ergebnis basierend auf Land + Aktivität
async function showAttackResult() {
  const data = await loadData(selectedCountry);
  attackDiv.innerHTML = "";

  if (data && data.results) {
    const filtered = data.results.filter(
      item =>
        item.activity &&
        item.activity.toLowerCase().includes(selectedActivity.toLowerCase())
    );

    if (filtered.length > 0) {
      const attack = filtered[Math.floor(Math.random() * filtered.length)];
      const ul = document.createElement("ul");

      const dateLi = document.createElement("li");
      dateLi.textContent = `Date: ${attack.date || "Unknown"}`;
      const injuryLi = document.createElement("li");
      injuryLi.textContent = `Injury: ${attack.injury || "Unknown"}`;
      const speciesLi = document.createElement("li");
      speciesLi.textContent = `Species: ${attack.species || "Unknown"}`;
      const typeLi = document.createElement("li");
      typeLi.textContent = `Type: ${attack.type || "Unknown"}`;

      ul.append(dateLi, injuryLi, speciesLi, typeLi);
      attackDiv.appendChild(ul);
    } else {
      attackDiv.textContent = "No matching shark attack found.";
    }
  } else {
    attackDiv.textContent = "No data available.";
  }
}

// Lade Daten von API
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
