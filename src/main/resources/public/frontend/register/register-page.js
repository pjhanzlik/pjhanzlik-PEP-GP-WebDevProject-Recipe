/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

// const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * Ensure the register button calls processRegistration when clicked
 */

document.getElementById("register-button").addEventListener(
    "click",
    event => {
        if (!event.target.form.checkValidity()) {
            return alert("Please fix errors indicated on the form and submitting again.");
        }
    });
document.addEventListener("submit", processRegistration)
document.addEventListener("change", event => {
    // On change trim input values
    event.target.value = event.target.value.trim();
    // If it is a password field check for a repeat pattern match
    if (event.target.id == "password-input") {
        document.getElementById("repeat-password-input").pattern = event.target.value;
    }
});


/**
 * Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration(event) {
    event.preventDefault();

    // Example placeholder:
    // const registerBody = { username, email, password };
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
            email: event.target.elements.email.value,
            password: event.target.elements.password.value
        })
    };

    try {
        const response = await fetch(event.target.action, requestOptions);
        switch (response.status) {
            case 201:
                return location = "../login-page.html";
            case 409:
                return alert("Username or email already exists. Please try again.");
            default:
                return alert(`Status code ${response.status} received from server. Please try again`);
        }
    } catch (error) {
        return alert("Failed to get a response from server. Please try again.");
    }

}
