/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
// Create a for loop within the addGamesToPage function that loops over each item in the argument games.
// You can expect that games will be an array of objects with the same structure as GAMES_JSON
function addGamesToPage(games) {
    // loop over each item in the data
    for(let i = 0; i< games.length; i++) {
        // create a variable that stores the current game object
        const game = games[i];

        // Calculate funding percentage
        const fundingPercentage = Math.min(Math.round((game.pledged / game.goal) * 100), 100);

        // create a new div element, which will become the game card
        const gameCard = document.createElement("div");

        // add the class game-card to the list
        gameCard.classList.add("game-card");

        // Add funded/unfunded class for styling
        if (game.pledged >= game.goal) {
            gameCard.classList.add("funded");
        } else {
            gameCard.classList.add("unfunded");
        }

        // set the inner HTML using a template literal to display info with progress bar
        gameCard.innerHTML = `
            <img class="game-img" src="${game.img}" alt="${game.name} image">
            <h2 class="game-name">${game.name}</h2>
            <p class="game-description">${game.description}</p>
            <div class="funding-info">
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${fundingPercentage}%"></div>
                </div>
                <p class="funding-text">${fundingPercentage}% funded: $${game.pledged.toLocaleString()} of $${game.goal.toLocaleString()}</p>
            </div>
        `;

        // Append the newly created div to the DOM
        gamesContainer.appendChild(gameCard);
    }
    return gamesContainer;
}
// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON)
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((total, game)  => {
    return total + game.backers;
    console.log("total contributions: " + totalContributions);
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
    contributionsCard.innerHTML = `
        <p class ="num-contributions">${totalContributions.toLocaleString()}</p>`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((total, game) => {
    return total + game.pledged;
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `
        <p class ="total-raised">${totalRaised.toLocaleString("en-US", {style: "currency", currency: "USD"})}</p>`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalGames = GAMES_JSON.length;
gamesCard.innerHTML = `<p class ="num-games">${totalGames.toLocaleString()}</p>`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    // Clear the current games display
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);
    const unfundedGamesCount = unfundedGames.length;
    console.log("unfunded games: " + unfundedGamesCount);
    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    // Clear the current games display
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);
    const fundedGamesCount = fundedGames.length;
    console.log("funded games: " + fundedGamesCount);
    // use the function we previously created to add funded games to the DOM
    addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
    // Clear the current games display
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

// create a string that explains the number of unfunded games using the ternary operator
const unfundedGamesCount = `Here are the total number of unfunded games: ${unfundedGames.length} ${unfundedGames.length === 1 ? 'game' : 'games'}`;

// create a new DOM element containing the template string and append it to the description container
const unfundedGamesElement = document.createElement("p");
unfundedGamesElement.innerHTML = unfundedGamesCount;
descriptionContainer.appendChild(unfundedGamesElement);
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...restofGames] = sortedGames;


// create a new element to hold the name of the top pledge game, then append it to the correct element
// in the DOM
const topPledgeGame = document.createElement("div");
topPledgeGame.innerHTML = firstGame.name;
firstGameContainer.appendChild(topPledgeGame);

// do the same for the runner up item
const runnerUpGame = document.createElement("div");
runnerUpGame.innerHTML = secondGame.name;
secondGameContainer.appendChild(runnerUpGame);

console.log("Most funded game:", sortedGames[0]);
console.log("Second most funded game:", sortedGames[1]);
