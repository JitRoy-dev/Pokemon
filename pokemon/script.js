// Gorgeous custom tailored ambient colors & glows for each of the 18 types
const typeThemes = {
    normal: { primary: '#a8a77a', secondary: '#c6c6a7', shadow: 'rgba(168, 167, 122, 0.3)', bgGlow1: '#1c1c16', bgGlow2: '#121210' },
    fire: { primary: '#ff4e50', secondary: '#f9d423', shadow: 'rgba(255, 78, 80, 0.45)', bgGlow1: '#250808', bgGlow2: '#2a1a05' },
    water: { primary: '#2196f3', secondary: '#00e5ff', shadow: 'rgba(33, 150, 243, 0.45)', bgGlow1: '#061a30', bgGlow2: '#00252a' },
    electric: { primary: '#ffd600', secondary: '#ffab00', shadow: 'rgba(255, 214, 0, 0.4)', bgGlow1: '#222002', bgGlow2: '#261801' },
    grass: { primary: '#4caf50', secondary: '#8bc34a', shadow: 'rgba(76, 175, 80, 0.35)', bgGlow1: '#092107', bgGlow2: '#1b2203' },
    ice: { primary: '#5ce1e6', secondary: '#a1eedc', shadow: 'rgba(92, 225, 230, 0.35)', bgGlow1: '#052a2e', bgGlow2: '#0f172a' },
    fighting: { primary: '#e53935', secondary: '#b31217', shadow: 'rgba(229, 57, 53, 0.4)', bgGlow1: '#250505', bgGlow2: '#180e04' },
    poison: { primary: '#ab47bc', secondary: '#7b1fa2', shadow: 'rgba(171, 71, 188, 0.35)', bgGlow1: '#22082b', bgGlow2: '#0c0f20' },
    ground: { primary: '#dfa65d', secondary: '#f4d197', shadow: 'rgba(223, 166, 93, 0.35)', bgGlow1: '#201507', bgGlow2: '#15150d' },
    flying: { primary: '#8b80f9', secondary: '#b4cbf9', shadow: 'rgba(139, 128, 249, 0.35)', bgGlow1: '#120f28', bgGlow2: '#0b1d2b' },
    psychic: { primary: '#ff4081', secondary: '#ff80ab', shadow: 'rgba(255, 64, 129, 0.45)', bgGlow1: '#2c0415', bgGlow2: '#0f1422' },
    bug: { primary: '#8bc34a', secondary: '#c1d763', shadow: 'rgba(139, 195, 74, 0.35)', bgGlow1: '#12240b', bgGlow2: '#151502' },
    rock: { primary: '#b6a136', secondary: '#d1c17d', shadow: 'rgba(182, 161, 54, 0.35)', bgGlow1: '#1d190d', bgGlow2: '#10161b' },
    ghost: { primary: '#7e57c2', secondary: '#b39ddb', shadow: 'rgba(126, 87, 194, 0.35)', bgGlow1: '#130c24', bgGlow2: '#08090f' },
    dragon: { primary: '#5c6bc0', secondary: '#8c9eff', shadow: 'rgba(92, 107, 192, 0.4)', bgGlow1: '#090d24', bgGlow2: '#18041c' },
    dark: { primary: '#5b6b7c', secondary: '#2e3d49', shadow: 'rgba(91, 107, 124, 0.3)', bgGlow1: '#070a0e', bgGlow2: '#0f172a' },
    steel: { primary: '#90a4ae', secondary: '#cfd8dc', shadow: 'rgba(144, 164, 174, 0.3)', bgGlow1: '#13191c', bgGlow2: '#0f172a' },
    fairy: { primary: '#ff80ab', secondary: '#f8bbd0', shadow: 'rgba(255, 128, 171, 0.4)', bgGlow1: '#2a0c1b', bgGlow2: '#0e1526' }
};

// Global variables for keeping track of active sprites and state
let currentNormalSprite = '';
let currentShinySprite = '';
let isShiny = false;

// Trigger search when pressing the "Enter" key in the search input
document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("pokemonName");
    if (inputField) {
        inputField.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                fetchData();
            }
        });
        
        // Initial search for Charizard to wow the user on load!
        fetchData();
    }
});

// Primary data-fetching method
async function fetchData() {
    const inputElement = document.getElementById("pokemonName");
    const query = inputElement.value.trim().toLowerCase();

    if (!query) return;

    // Show loading state
    toggleLoading(true);
    hideError();

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);

        if (!response.ok) {
            throw new Error(`Pokemon "${query}" not found.`);
        }

        const data = await response.json();
        
        // Populate Pokemon card details
        renderPokemonCard(data);
    } catch (error) {
        console.error(error);
        showError(error.message || "Could not fetch details. Please try again.");
    } finally {
        toggleLoading(false);
    }
}

// Fetch random Pokémon from Gen 1 to Gen 9
function fetchRandom() {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    document.getElementById("pokemonName").value = randomId;
    fetchData();
}

// Render data elements to cards
function renderPokemonCard(data) {
    // Reset Shiny state
    isShiny = false;
    const shinyToggle = document.getElementById("shinyToggle");
    shinyToggle.classList.remove("active");

    // Display Name and Padded ID
    document.getElementById("pokemonDisplayName").textContent = data.name;
    document.getElementById("pokemonId").textContent = `#${String(data.id).padStart(4, '0')}`;

    // Get sprites (fallback sequence: Official Artwork -> Home Artwork -> standard default -> Pokeball placeholder)
    const officialArt = data.sprites?.other?.['official-artwork'];
    const homeArt = data.sprites?.other?.home;
    const pokeBallPlaceholder = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';

    currentNormalSprite = officialArt?.front_default || homeArt?.front_default || data.sprites?.front_default || pokeBallPlaceholder;
    currentShinySprite = officialArt?.front_shiny || homeArt?.front_shiny || data.sprites?.front_shiny || currentNormalSprite;

    const imgElement = document.getElementById("pokemonSprite");
    imgElement.onerror = () => {
        imgElement.src = pokeBallPlaceholder;
    };
    imgElement.src = currentNormalSprite;

    // Set Types pills
    const typesContainer = document.getElementById("typesContainer");
    typesContainer.innerHTML = '';
    const mainType = data.types[0].type.name;

    data.types.forEach(t => {
        const typeName = t.type.name;
        const pill = document.createElement("span");
        pill.className = `type-pill type-${typeName}`;
        pill.innerHTML = `<i class="fa-solid ${getTypeIcon(typeName)}"></i> ${typeName}`;
        typesContainer.appendChild(pill);
    });

    // Apply color values and variables to body
    applyDynamicTheme(mainType);

    // Height & Weight details conversion (decimeter to meter, hectogram to kg)
    document.getElementById("valHeight").textContent = `${(data.height / 10).toFixed(1)} m`;
    document.getElementById("valWeight").textContent = `${(data.weight / 10).toFixed(1)} kg`;

    // Abilities details
    const abilityNames = data.abilities.map(a => a.ability.name.replace('-', ' '));
    const mainAbilities = abilityNames.slice(0, 2).join(', ');
    const abilitiesEl = document.getElementById("valAbilities");
    abilitiesEl.textContent = mainAbilities;
    abilitiesEl.title = abilityNames.join(', ');

    // Sound Cry controls
    const cryContainer = document.getElementById("cryContainer");
    const audioCtrl = document.getElementById("pokemonAudioCtrl");
    const cryBtn = document.getElementById("cryBtn");
    
    // Stop any currently playing audio and reset cry button UI
    audioCtrl.pause();
    cryBtn.classList.remove("playing");

    let crySource = '';
    if (data.cries?.latest) {
        crySource = data.cries.latest;
    } else if (data.cries?.legacy) {
        crySource = data.cries.legacy;
    }

    if (crySource) {
        audioCtrl.src = crySource;
        cryContainer.style.display = "flex";
    } else {
        cryContainer.style.display = "none";
    }

    // Render stats
    renderStatsList(data.stats);

    // Reveal final block
    document.getElementById("pokedexContainer").style.display = "block";
}

// Render Pokemon base stats and slide in bars
function renderStatsList(stats) {
    const statsGrid = document.getElementById("statsGrid");
    statsGrid.innerHTML = '';

    const statsAbbr = {
        'hp': 'HP',
        'attack': 'ATK',
        'defense': 'DEF',
        'special-attack': 'SATK',
        'special-defense': 'SDEF',
        'speed': 'SPD'
    };

    stats.forEach(s => {
        const statName = statsAbbr[s.stat.name] || s.stat.name.substring(0, 4).toUpperCase();
        const baseVal = s.base_stat;

        // Calculate fill percentage relative to a max (say 180 base stat)
        const percent = Math.min(100, Math.round((baseVal / 185) * 100));

        const row = document.createElement("div");
        row.className = "stat-row";
        row.innerHTML = `
            <span class="stat-name">${statName}</span>
            <div class="stat-bar-track">
                <div class="stat-bar-fill" data-percent="${percent}%" style="width: 0%;"></div>
            </div>
            <span class="stat-value">${baseVal}</span>
        `;
        statsGrid.appendChild(row);
    });

    // Smooth delay animation to trigger slider animations
    setTimeout(() => {
        const fills = statsGrid.querySelectorAll(".stat-bar-fill");
        fills.forEach(fill => {
            fill.style.width = fill.getAttribute("data-percent");
        });
    }, 150);
}

// Toggle Normal vs Shiny version of the active searched Pokemon
function toggleShiny() {
    if (!currentNormalSprite) return;

    isShiny = !isShiny;
    const imgElement = document.getElementById("pokemonSprite");
    const shinyToggle = document.getElementById("shinyToggle");

    // Add metallic/shiny styling class indicator
    if (isShiny) {
        imgElement.src = currentShinySprite;
        shinyToggle.classList.add("active");
    } else {
        imgElement.src = currentNormalSprite;
        shinyToggle.classList.remove("active");
    }
}

// Dynamic sound cry coordinator
function playCry() {
    const audioCtrl = document.getElementById("pokemonAudioCtrl");
    const cryBtn = document.getElementById("cryBtn");

    if (!audioCtrl.src) return;

    cryBtn.classList.add("playing");
    audioCtrl.currentTime = 0;
    audioCtrl.play().catch(err => {
        console.error("Failed to play sound cry", err);
        cryBtn.classList.remove("playing");
    });

    // Reset button animation when audio playback finishes
    audioCtrl.onended = () => {
        cryBtn.classList.remove("playing");
    };
}

// Apply type themes to layout CSS variables
function applyDynamicTheme(typeName) {
    const theme = typeThemes[typeName.toLowerCase()] || typeThemes.normal;

    // Apply color attributes to root element
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    document.documentElement.style.setProperty('--glow-shadow', theme.shadow);
    document.documentElement.style.setProperty('--bg-glow-1', theme.bgGlow1);
    document.documentElement.style.setProperty('--bg-glow-2', theme.bgGlow2);
    document.documentElement.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`);
}

// Helper to retrieve semantic FontAwesome icons representing each Pokemon type
function getTypeIcon(type) {
    const icons = {
        fire: 'fa-fire-flame-curved',
        water: 'fa-droplet',
        grass: 'fa-leaf',
        electric: 'fa-bolt-lightning',
        ice: 'fa-snowflake',
        fighting: 'fa-hand-fist',
        poison: 'fa-skull-crossbones',
        ground: 'fa-mountain',
        flying: 'fa-feather',
        psychic: 'fa-eye',
        bug: 'fa-bug',
        rock: 'fa-gem',
        ghost: 'fa-ghost',
        dragon: 'fa-dragon',
        dark: 'fa-moon',
        steel: 'fa-shield-halved',
        fairy: 'fa-star-of-david',
        normal: 'fa-circle'
    };
    return icons[type.toLowerCase()] || 'fa-circle';
}

// Handle loading spinner visibility
function toggleLoading(isLoading) {
    const statusMsg = document.getElementById("statusMessage");
    const pokedexContainer = document.getElementById("pokedexContainer");

    if (isLoading) {
        statusMsg.style.display = "flex";
        document.getElementById("statusText").textContent = "Accessing database...";
        pokedexContainer.style.display = "none";
    } else {
        statusMsg.style.display = "none";
    }
}

// Display error toasts
function showError(message) {
    const errorBox = document.getElementById("errorBox");
    const errorMessage = document.getElementById("errorMessage");
    
    errorMessage.textContent = message;
    errorBox.style.display = "flex";

    // Shake Card or hide wrapper
    document.getElementById("pokedexContainer").style.display = "none";
}

// Hide error toasts
function hideError() {
    document.getElementById("errorBox").style.display = "none";
}