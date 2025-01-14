export async function onRequest(context) {
    const { request, env } = context;
    if (request.method === "POST") {
        return await handlePostRequest(request, env);
    } else {
        return await handleDisallowedMethod();
    }
}

function composeRequest(formData) {
    const { name, email, message } = formData;
    return {
        from: {
            email: "doucovanie.petrzalka@gmail.com", // This must be a verified sender
            name: "my website",
        },
        replyTo: {
            email: email,
            name: name,
        },
        subject: "New message from my website",
        content: [
            {
                type: "text/plain",
                value: `New message from ${name} (${email}): "${message}"`,
            },
        ],
        personalizations: [
            {
                to: [
                    {
                        email: "doucovanie.petrzalka@gmail.com", // Change if necessary
                        name: "Recipient",
                    },
                ],
            },
        ],
    };
}

async function sendEmail(messageBody, env) {
    try {
        console.log(env.SENDGRID_API_KEY); // Corrected logging
        const emailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messageBody),
        });
        
        return emailResponse; // Return the response directly
    } catch (error) {
        console.error("Error sending email:", error); // Log any errors
        return { status: 500, statusText: error.message }; // Return error message
    }
}

async function handleDisallowedMethod() {
    return new Response("Method Not Allowed", { status: 405 });
}

async function handlePostRequest(request, env) {
    const returnUrl = request.headers.get("referer");
    
    let formData = await readRequestBody(request);
    const requestBody = composeRequest(formData);
    
    if (!env.SENDGRID_API_KEY) { // Check for API key correctly
        return Response.redirect(`${returnUrl}?success=false&reason=no-api-key`);
    }
    
    let emailResponse = await sendEmail(requestBody, env);
    
    if (emailResponse.status > 299) {
        const errorText = await emailResponse.text(); // Get detailed error message
        return Response.redirect(
            `${returnUrl}?success=false&reason=SendGrid%20API%20returned%20${errorText}%20(statusCode: ${emailResponse.status})`
        );
    }
    
    return Response.redirect(`${returnUrl}sent-email`);
    
}

async function readRequestBody(request) {
    const { headers } = request;
    const contentType = headers.get("content-type");
    
    if (contentType.includes("application/json")) {
        return await request.json();
    } else if (contentType.includes("form")) {
        const formData = await request.formData();
        let body = {};
        
        for (let entry of formData.entries()) {
            body[entry[0]] = entry[1];
        }
        
        return body;
    }
}
