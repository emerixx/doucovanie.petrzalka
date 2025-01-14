/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


export function onRequest(context) {
    return new Response("Hello, world!")
}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'POST') {
      const { name, email, message } = await request.json();

      const msg = {
          personalizations: [{
              to: [{ email: email }], // Change to your recipient
              subject: 'New Contact Form Submission',
          }],
          from: { email: 'doucovanie.petrzalka@gmail.com' }, // Change to your verified sender
          content: [{
              type: 'text/plain',
              value: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
          }],
      };

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${SENDGRID_API_KEY}`, // Use your API key here
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(msg),
      });

      if (response.ok) {
          return new Response('Message sent successfully!', { status: 200 });
      } else {
          return new Response('Failed to send message.', { status: 500 });
      }
  } else {
      return new Response('Invalid request method.', { status: 405 });
  }
}
