/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL
const INGREDIENT_URL = `${BASE_URL}/ingredients`;
/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */

/* 
 * Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
document.addEventListener("submit", event => {
    const nameInput = event.target.elements.name;
    switch (event.target.id) {
        case "add-ingredient-form":
            event.preventDefault();
            addIngredient(nameInput);
            break;
        case "delete-ingredient-form":
            event.preventDefault();
            deleteIngredient(nameInput);
            break;
    }
});

/* 
 * On page load, call getIngredients()
 */
getIngredients();


/**
 * Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
document.addEventListener("change", event => event.target.value = event.target.value.trim());
async function addIngredient(nameInput) {
    const name = nameInput.value;
    try {
        const response = await fetch(
            INGREDIENT_URL,
            {
                method: "POST",
                headers: {
                    "Authorization": `auth-token: ${sessionStorage.getItem("auth-token")}`
                },
                body: JSON.stringify({ name })
            }
        );
        if (response.ok) {
            nameInput.value = "";
            getIngredients();
        } else {
            throw new Error(`Response status code ${response.status} when adding ingredient.  Please try again.`);
        }
    } catch (error) {
        alert(error);
    }
}


/**
 * Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array (decided to use ingredient list html element instead)
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    const ingredientList = document.getElementById("ingredient-list");
    try {
        const response = await fetch(INGREDIENT_URL);
        if (response.ok) {
            return refreshIngredientList(await response.json());
        }
        if (response.status === 404) {
            return refreshIngredientList([]);
        }
        throw new Error(`Unexpected response status ${response.status}`);
    } catch (error) {
        alert(error);
    }
}


/**
 * Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient(nameInput) {
    const ingredientList = document.getElementById("ingredient-list");
    const ingredientItem = [...ingredientList.children]
        .find(element => element.dataset.name === nameInput.value);
    if (ingredientItem === undefined) {
        return alert("Ingredient not found to delete. Please try again.");
    }
    const id = ingredientItem.dataset.id;
    const url = `${INGREDIENT_URL}/${id}`;
    const requestInit = { method: "DELETE" };
    try {
        const response = await fetch(url, requestInit);
        if (response.ok) {
            nameInput.value = "";
            ingredientItem.remove();
        } else if (response.status === 401) {
            alert("Delete was not authorized. This is likely a CORS issue you cannot resolve.");
        } else {
            alert(await response.text());
        }
    } catch (error) {
        console.error(error);
        alert("Delete network request error occurred. Please try again.");
    }
}


/**
 * Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList(ingredients) {
    const ingredientList = document.getElementById("ingredient-list");
    ingredientList.replaceChildren(...ingredients.map(ingredient => {
        const li = document.createElement("li");
        li.textContent = ingredient.name;
        li.dataset.name = ingredient.name;
        li.dataset.id = ingredient.id;
        return li;
    }));
}
