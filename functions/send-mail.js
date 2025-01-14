

export async function onRequest(context) {
    const { request, env } = context;
    if (request.method === "POST") {
      return await handlePostRequest(request, env);
    } else {
      return await handleDisallowedMethod();
    }
  }
  
  function composeRequest(formData, env) {
    const { name, email, message } = formData;
    return {
      from: {
        email: "doucovanie.petrzalka@gmail.com",
        name: "my website",
      },
      replyTo: {
        email: `${email}`,
        name: `${name}`,
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
          from: {
            email: "doucovanie.petrzalka@gmail.com",
            name: "my website (example.com)",
          },
          to: [
            {
              email: "doucovanie.petrzalka@gmail.com",
              name: "Recipient",
            },
          ],
        },
      ],
    };
  }
  
  async function sendEmail(messageBody, env) {
    try {
      const email = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageBody),
      });
      return email;
    } catch (error) {
      return { status: 500, statusText: error };
    }
  }
  
  async function handleDisallowedMethod() {
    return new Response("Object Not Found", {
      statusText: "Object Not Found",
      status: 404,
    });
  }
  
  async function handlePostRequest(request, env) {
    const returnUrl = request.headers.get("referer");
  
    let formData = await readRequestBody(request);
    const requestBody = composeRequest(formData, env);f
  
    if (!env ?? env.SENDGRID_API_KEY) {
      return Response.redirect(`${returnUrl}?success=false&reason=no-api-key`);
    }
  
    let emailResponse = await sendEmail(requestBody, env);
  
    if (emailResponse.status > 299) {
      return Response.redirect(
        `${returnUrl}?success=false&reason=SendGrid%20API%20returned%20${emailResponse.statusText}%20(statusCode: ${emailResponse.status}))`
      );
    }
    return Response.redirect(`${returnUrl}?success=true`);
  }
  
  async function readRequestBody(request) {
    const { headers } = request;
    const contentType = headers.get("content-type");
    if (contentType.includes("application/json")) {
      const body = await request.json();
      return body;
    } else if (contentType.includes("form")) {
      const formData = await request.formData();
      let body = {};
      for (let entry of formData.entries()) {
        body[entry[0]] = entry[1];
      }
      return body;
    }
  }