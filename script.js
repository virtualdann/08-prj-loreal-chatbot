/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Store conversation history with system prompt
const messages = [{
  role: 'system',
  content: 'You are a helpful L\'Oréal beauty assistant. Your purpose is to help users discover and understand L\'Oréal products including makeup, skincare, haircare, and fragrances. You can provide personalized beauty routines and product recommendations. If a user asks about topics unrelated to L\'Oréal products, beauty, skincare, makeup, haircare, or fragrances, politely let them know that you specialize in L\'Oréal beauty products and redirect the conversation back to how you can help them with their beauty needs.'
}];

// Set initial message
chatWindow.innerHTML = `<div class="msg assistant"><strong>Assistant:</strong> "👋 Hello! How can I help you today?"</div>`;

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user's message
  const userMessage = userInput.value;

  // Add user message to conversation history
  messages.push({ role: 'user', content: userMessage });

  // Display user message in chat window (right-aligned)
  chatWindow.innerHTML += `<div class="msg user"><strong>You:</strong> ${userMessage}</div>`;

  // Clear input immediately
  userInput.value = '';

  const CLOUDFLARE_WORKER_URL = `https://dry-union-af10.danishnakdegree.workers.dev/`

  const response = await fetch(`${CLOUDFLARE_WORKER_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: messages // Send entire conversation history
    })
  });

  const result = await response.json();

  // When using Cloudflare, you'll need to POST a `messages` array in the body,
  // and handle the response using: data.choices[0].message.content

  // Get assistant's response
  const assistantMessage = result.choices[0].message.content;

  // Add assistant message to conversation history
  messages.push({ role: 'assistant', content: assistantMessage });

  // Display assistant message in chat window (left-aligned)
  chatWindow.innerHTML += `<div class="msg assistant"><strong>Assistant:</strong> ${assistantMessage}</div>`;
});
