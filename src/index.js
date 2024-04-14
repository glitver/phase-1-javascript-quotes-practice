document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.getElementById("quote-list");
    const newQuoteForm = document.getElementById("new-quote-form");
  
    const fetchQuotes = async () => {
      try {
        const response = await fetch("http://localhost:3000/quotes?_embed=likes");
        const quotes = await response.json();
        quotes.forEach(renderQuote);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };

    const renderQuote = (quote) => {
      const li = document.createElement("li");
      li.classList.add("quote-card");
  
      li.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success' data-id="${quote.id}">Likes: <span>${quote.likes.length}</span></button>
          <button class='btn-danger' data-id="${quote.id}">Delete</button>
        </blockquote>
      `;
  
      quoteList.appendChild(li);
    };

    newQuoteForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(newQuoteForm);
      const quote = formData.get("quote");
      const author = formData.get("author");
  
      try {
        const response = await fetch("http://localhost:3000/quotes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quote, author }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to create quote");
        }
  
        const newQuote = await response.json();
        renderQuote(newQuote);
        newQuoteForm.reset();
      } catch (error) {
        console.error("Error creating quote:", error);
      }
    });
      quoteList.addEventListener("click", async (event) => {
      if (event.target.matches(".btn-success")) {
        const quoteId = event.target.dataset.id;
  
        try {
          const response = await fetch("http://localhost:3000/likes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quoteId: parseInt(quoteId) }),
          });
  
          if (!response.ok) {
            throw new Error("Failed to like quote");
          }
  
          const updatedQuote = await response.json();
          const span = event.target.querySelector("span");
          span.textContent = updatedQuote.likes.length;
        } catch (error) {
          console.error("Error liking quote:", error);
        }
      } else if (event.target.matches(".btn-danger")) {
        const quoteId = event.target.dataset.id;
  
        try {
          const response = await fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: "DELETE",
          });
  
          if (!response.ok) {
            throw new Error("Failed to delete quote");
          }
  
          event.target.closest(".quote-card").remove();
        } catch (error) {
          console.error("Error deleting quote:", error);
        }
      }
    });
    fetchQuotes();
  });
  