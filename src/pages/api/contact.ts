import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  console.log("Contact API request received");
  try {
    let data;
    const rawText = await request.text();
    console.log("Raw request text:", rawText);
    
    if (!rawText) {
      return new Response(JSON.stringify({ error: "Empty request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    try {
      data = JSON.parse(rawText);
      console.log("Parsed data:", data);
    } catch (e) {
      console.error("Failed to parse request JSON:", e);
      return new Response(JSON.stringify({ error: "Invalid JSON format", rawText }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("Forwarding to n8n...");
    const response = await fetch("https://n8n.suitsoftware.com/webhook/contact-form-suit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("n8n response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("n8n error response:", errorText);
      return new Response(JSON.stringify({ 
        error: "Failed to send data to n8n", 
        details: errorText 
      }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("Successfully sent to n8n");
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Critical API proxy error:", error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
