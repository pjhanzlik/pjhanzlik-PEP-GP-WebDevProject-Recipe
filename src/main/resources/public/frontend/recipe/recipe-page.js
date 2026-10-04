/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL
const RECIPES_URL = `${BASE_URL}/recipes`;

let recipes = [];


document.addEventListener("change", event => event.target.value = event.target.value.trim());

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
    try {
        recipes = await fetchRecipes(name);
        refreshRecipeList();
    } catch (error) {
        console.error(error);
        alert("Network error during search request. Please try again.");
    }
}

async function fetchRecipes(name) {
    const response = await fetch(`${RECIPES_URL}?name=${name}`);
    if (response.status === 404) {
        return [];
    } else {
        return await response.json();
    }
}

async function fetchRecipeId(name) {
    return (await fetchRecipes(name))
        .find(recipe => recipe.name === name)?.id;
}

/**
 * Add Recipe Function
 * - Get values from add form inputs
 * - Validate both name and instructions
 * - Send POST request to /recipes
 * - Use Bearer token from sessionStorage
 * - On success: clear inputs, fetch latest recipes, refresh the list
 */
async function addRecipe() {
    const name = document.getElementById("add-recipe-name-input");
    const instructions = document.getElementById("add-recipe-instructions-input");
    const requestInit = {
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
        body: JSON.stringify({ name: name.value, instructions: instructions.value })
    };
    try {
        const response = await fetch(RECIPES_URL, requestInit);
        if (response.ok) {
            name.value = "";
            instructions.value = "";
            getRecipes();
        } else {
            console.error(response);
            alert("Recipe add request denied by server.");
        }
    } catch (error) {
        console.error(error);
        alert("Failed to add recipe!");
    }
}

/**
 * Update Recipe Function
 * - Get values from update form inputs
 * - Validate both name and updated instructions
 * - Fetch current recipes to locate the recipe by name
 * - Send PUT request to update it by ID
 * - On success: clear inputs, fetch latest recipes, refresh the list
 */
async function updateRecipe() {
    const name = document.getElementById("update-recipe-name-input");
    const instructions = document.getElementById("update-recipe-instructions-input");
    const requestInit = {
        method: "PUT",
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
        body: JSON.stringify({ name: name.value, instructions: instructions.value })
    };
    const id = await fetchRecipeId(name.value);
    if (id === undefined) {
        return alert("Recipe not found!");
    }
    const response = await fetch(`${RECIPES_URL}/${id}`, requestInit);
    if (response.ok) {
        name.value = "";
        instructions.value = "";
        getRecipes();
    } else {
        throw new Error("Update recipe response not okay.")
    }
}

/**
 * Delete Recipe Function
 * - Get recipe name from delete input
 * - Find matching recipe in list to get its ID
 * - Send DELETE request using recipe ID
 * - On success: refresh the list
 */
async function deleteRecipe() {
    const name = document.getElementById("delete-recipe-name-input");
    const id = await fetchRecipeId(name.value);
    if (id === undefined) {
        return alert("Recipe not found for delete.");
    }
    const requestInit = {
        method: "DELETE",
    };
    const response = await fetch(`${RECIPES_URL}/${id}`, requestInit);
    if (response.ok) {
        getRecipes();
    } else {
        console.error(response);
        if (response.status === 401) {
            alert("You are not authorized to DELETE recipes.");
        } else {
            alert(await response.text());
        }
        throw new Error("Delete recipe response not okay.")
    }
}

/**
 * Get Recipes Function
 * - Fetch all recipes from backend
 * - Store in recipes array
 * - Call refreshRecipeList() to display
 */
async function getRecipes() {
    try {
        const response = await fetch(RECIPES_URL);
        recipes = await response.json();
    } catch (error) {
        console.error(error);
        alert("Failed to get recipes from server!")
    }

    refreshRecipeList();
}

/**
 * Refresh Recipe List Function
 * - Clear current list in DOM
 * - Create <li> elements for each recipe with name + instructions
 * - Append to list container
 */
function refreshRecipeList() {
    const list = document.getElementById("recipe-list");
    list.replaceChildren(...recipes.map(recipe => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${recipe.name}</strong> ${recipe.instructions}`;
        return li;
    }));
}

/**
 * Logout Function
 * - Send POST request to /logout
 * - Use Bearer token from sessionStorage
 * - On success: clear sessionStorage and redirect to login
 * - On failure: alert the user
 */
document.getElementById("logout-button").addEventListener("click", processLogout);
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
    } catch (error) {
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
    event.preventDefault();
    switch (event.target.id) {
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