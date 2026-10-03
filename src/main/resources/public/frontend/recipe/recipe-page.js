/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];


/*
* Show logout button if auth-token exists in sessionStorage
*/
if (sessionStorage.getItem("auth-token") != null) {
    document.getElementById("logout-button").hidden = null;
}


/*
* Show admin link if is-admin flag in sessionStorage is "true"
*/
if (sessionStorage.getItem("is-admin") === "true") {
    document.getElementById("admin-link").hidden = null;
}

/*
* On page load, call getRecipes() to populate the list
*/
getRecipes();


/**
 * Search Recipes Function
 * - Read search term from input field
 * - Send GET request with name query param
 * - Update the recipe list using refreshRecipeList()
 * - Handle fetch errors and alert user
 */
async function searchRecipes() {
    const name = document.getElementById("search-input").value;
    const requestOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            username: event.target.elements.username.value, 
            password: event.target.elements.password.value
        })
    };

    try {
        const response = await fetch(`${BASE_URL}/`)
    } catch (error) {
        console.error(error);
        alert("Network error during search request. Please try again.");
    }
}

/**
 * TODO: Add Recipe Function
 * - Get values from add form inputs
 * - Validate both name and instructions
 * - Send POST request to /recipes
 * - Use Bearer token from sessionStorage
 * - On success: clear inputs, fetch latest recipes, refresh the list
 */
async function addRecipe() {
    // Implement add logic here
}

/**
 * TODO: Update Recipe Function
 * - Get values from update form inputs
 * - Validate both name and updated instructions
 * - Fetch current recipes to locate the recipe by name
 * - Send PUT request to update it by ID
 * - On success: clear inputs, fetch latest recipes, refresh the list
 */
async function updateRecipe() {
    // Implement update logic here
}

/**
 * TODO: Delete Recipe Function
 * - Get recipe name from delete input
 * - Find matching recipe in list to get its ID
 * - Send DELETE request using recipe ID
 * - On success: refresh the list
 */
async function deleteRecipe() {
    // Implement delete logic here
}

/**
 * TODO: Get Recipes Function
 * - Fetch all recipes from backend
 * - Store in recipes array
 * - Call refreshRecipeList() to display
 */
async function getRecipes() {
    // Implement get logic here

    refreshRecipeList();
}

/**
 * Refresh Recipe List Function
 * - Clear current list in DOM
 * - Create <li> elements for each recipe with name + instructions
 * - Append to list container
 */
function refreshRecipeList() {
    document.getElementById("recipe-list").replaceChildren(...recipes);
}

/**
 * Logout Function
 * - Send POST request to /logout
 * - Use Bearer token from sessionStorage
 * - On success: clear sessionStorage and redirect to login
 * - On failure: alert the user
 */
async function processLogout() {
    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Authorization": `auth-token: ${sessionStorage.getItem("auth-token")}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    };

    try {
        const response = await fetch(`${BASE_URL}/logout`, requestOptions);
        if (response.ok) {
            sessionStorage.clear();
            location.assign("../login/login-page.html");
        } else {
            console.error(response);
            alert("Received bad response from server on logout. Please try again.");
        }
    } catch(error) {
        console.error(error);
        alert("Network error occured while trying to logout. Please try again.")
    }
}

/*
* Attach event handlers
* - Add recipe button → addRecipe()
* - Update recipe button → updateRecipe()
* - Delete recipe button → deleteRecipe()
* - Search button → searchRecipes()
* - Logout button → processLogout()
*/
document.addEventListener("submit", event => {
    switch(event.target.id) {
        case "add-recipe-form":
            addRecipe(event);
            break;
        case "update-recipe-form":
            updateRecipe(event);
            break;
        case "delete-recipe-form":
            deleteRecipe(event);
            break;
        case "search-recipe-form":
            searchRecipes(event);
            break;
        default:
            console.error(event);
    }
});

document.getElementById("logout-button").addEventListener("click", processLogout);