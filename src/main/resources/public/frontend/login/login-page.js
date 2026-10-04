/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/
// const BASE_URL = "http://localhost:8081"; // backend URL
// TODO: Optionally show the logout button if applicable

/* 
 * Add click event listener to login button
 * - Call processLogin on click
 */
document.addEventListener("submit", processLogin);

// - Trim input and validate that neither is empty
document.addEventListener("change", event => event.target.value = event.target.value.trim());

/**
 * Process Login Function
 * 
 * Requirements:
 * - Retrieve values from username and password input fields
 * - Construct a request body with { username, password }
 * - Configure request options for fetch (POST, JSON headers)
 * - Send request to /login endpoint
 * - Handle responses:
 *    - If 200: extract token and isAdmin from response text
 *      - Store both in sessionStorage
 *      - Redirect to recipe-page.html
 *    - If 401: alert user about incorrect login
 *    - For others: show generic alert
 * - Add try/catch to handle fetch/network errors
 * 
 * Hints:
 * - Use fetch with POST method and JSON body
 * - Use sessionStorage.setItem("key", value) to store auth token and admin flag
 * - Use `window.location.href` for redirection
 */
async function processLogin(event) {
    event.preventDefault();

    // TODO: Create a requestBody object with username and password

    const requestOptions = {
        method: event.target.method,
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
        // Send POST request to http://localhost:8081/login using fetch with requestOptions
        const response = await fetch(event.target.action, requestOptions);

        
        
        switch (response.status) {
            // If response status is 200
            // - Read the response as text
            // - Response will be a space-separated string: "token123 true"
            // - Split the string into token and isAdmin flag
            // - Store both in sessionStorage using sessionStorage.setItem()
            // Add a small delay (e.g., 500ms) using setTimeout before redirecting
            // - Use window.location.href to redirect to the recipe page
            case 200:
                const splitText = (await response.text()).split(' ');
                sessionStorage.setItem("auth-token", splitText[0]);
                sessionStorage.setItem("is-admin", splitText[1]);
                location.assign("../recipe/recipe-page.html");
                break;
            // If response status is 401
            // - Alert the user with "Incorrect login!"    
            case 401:
                alert("Incorrect login!");
                break;
            // For any other status code
            // - Alert the user with a generic error like "Unknown issue!"
            default:
                console.error(response);
                alert(`Received failure status code ${response.status}. Please try again.`);
        }
    } catch (error) {
        // Handle any network or unexpected errors
        // - Log the error and alert the user
        console.error(error);
        alert("Failed to receive login response from server. Please try again.")
    }
}

