/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});


async function handleRequest(request) {
    if (request.method === 'POST') {
        try {
            // Parse the JSON body
            const { name, email, message } = await request.json();

            // Construct the email message
            const msg = {
                personalizations: [{
                    to: [{ email: 'doucovanie.petrzalka@gmail.com' }], // Change to your recipient's email
                    subject: 'New Contact Form Submission',
                }],
                from: { email: 'doucovanie.petrzalka@gmail.com' }, // Change to your verified sender
                content: [{
                    type: 'text/plain',
                    value: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
                }],
            };

            // Send the email using SendGrid API
            const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SENDGRID_API_KEY}`, // Use your API key here
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(msg),
            });

            // Check the response from SendGrid
            if (response.ok) {
                return new Response('Message sent successfully!', { status: 200 });
            } else {
                const errorText = await response.text(); // Get error details from SendGrid
                return new Response(`Failed to send message. Error: ${errorText}`, { status: 500 });
            }
        } catch (error) {
            return new Response(`Error processing request: ${error.message}`, { status: 500 });
        }
    } else {
        return new Response('Invalid request method. Only POST is allowed.', { status: 405 });
    }
}

export default {
    async fetch(request) {
        if (request.method === 'POST') {
            try {
                // Parse the JSON body
                const { name, email, message } = await request.json();
    
                // Construct the email message
                const msg = {
                    personalizations: [{
                        to: [{ email: 'doucovanie.petrzalka@gmail.com' }], // Change to your recipient's email
                        subject: 'New Contact Form Submission',
                    }],
                    from: { email: 'doucovanie.petrzalka@gmail.com' }, // Change to your verified sender
                    content: [{
                        type: 'text/plain',
                        value: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
                    }],
                };
    
                // Send the email using SendGrid API
                const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${SENDGRID_API_KEY}`, // Use your API key here
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(msg),
                });
    
                // Check the response from SendGrid
                if (response.ok) {
                    return new Response('Message sent successfully!', { status: 200 });
                } else {
                    const errorText = await response.text(); // Get error details from SendGrid
                    return new Response(`Failed to send message. Error: ${errorText}`, { status: 500 });
                }
            } catch (error) {
                return new Response(`Error processing request: ${error.message}`, { status: 500 });
            }
        } else {
            return new Response('Invalid request method. Only POST is allowed.', { status: 405 });
        }
    }
};

