const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#productSearch");
const searchHint = document.querySelector(".search-hint");
const questions = document.querySelector("#questions");
const cartCount = document.querySelector("#cartCount");
const cartSummary = document.querySelector("#cartSummary");
const preferences = { focus: "", budget: "" };

function renderQuestion(step) {
  questions.hidden = false;
  searchHint.hidden = true;

  if (step === 1) {
    questions.innerHTML = `
      <p class="step-label">A couple of quick questions <span>1 of 2</span></p>
      <fieldset>
        <legend>What matters most?</legend>
        <div class="choice-list">
          <label class="choice"><input type="radio" name="focus" value="practical" ${
            preferences.focus === "practical" ? "checked" : ""
          } /><span>Everyday practicality</span></label>
          <label class="choice"><input type="radio" name="focus" value="calm" ${
            preferences.focus === "calm" ? "checked" : ""
          } /><span>A calmer space</span></label>
          <label class="choice"><input type="radio" name="focus" value="writing" ${
            preferences.focus === "writing" ? "checked" : ""
          } /><span>Writing things down</span></label>
          <label class="choice"><input type="radio" name="focus" value="gift" ${
            preferences.focus === "gift" ? "checked" : ""
          } /><span>A thoughtful gift</span></label>
        </div>
      </fieldset>
      <div class="step-actions">
        <button class="text-button" type="button" data-action="edit-search">← Edit search</button>
        <button class="primary-button" type="button" data-action="next" ${
          preferences.focus ? "" : "disabled"
        }>Next <span aria-hidden="true">→</span></button>
      </div>
    `;
    return;
  }

  questions.innerHTML = `
    <p class="step-label">A couple of quick questions <span>2 of 2</span></p>
    <fieldset>
      <legend>What feels right for your budget?</legend>
      <div class="choice-list">
        <label class="choice"><input type="radio" name="budget" value="20" ${
          preferences.budget === "20" ? "checked" : ""
        } /><span>Under $20</span></label>
        <label class="choice"><input type="radio" name="budget" value="40" ${
          preferences.budget === "40" ? "checked" : ""
        } /><span>$20–$40</span></label>
        <label class="choice"><input type="radio" name="budget" value="any" ${
          preferences.budget === "any" ? "checked" : ""
        } /><span>I'm flexible</span></label>
      </div>
    </fieldset>
    <div class="step-actions">
      <button class="text-button" type="button" data-action="back">← Back</button>
      <button class="primary-button" type="button" data-action="results" ${
        preferences.budget ? "" : "disabled"
      }>See all results <span aria-hidden="true">→</span></button>
    </div>
  `;
}

function navigateToResults() {
  const params = new URLSearchParams({
    q: searchInput.value.trim(),
    focus: preferences.focus,
    budget: preferences.budget,
  });
  window.location.href = `results.html?${params.toString()}`;
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!searchInput.value.trim()) {
    searchInput.focus();
    return;
  }
  preferences.focus = "";
  preferences.budget = "";
  renderQuestion(1);
});

questions.addEventListener("change", (event) => {
  if (event.target.name === "focus") {
    preferences.focus = event.target.value;
    renderQuestion(1);
  } else if (event.target.name === "budget") {
    preferences.budget = event.target.value;
    renderQuestion(2);
  }
});

questions.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "edit-search") {
    questions.hidden = true;
    searchHint.hidden = false;
    searchInput.focus();
  } else if (action === "next") {
    renderQuestion(2);
  } else if (action === "back") {
    renderQuestion(1);
  } else if (action === "results") {
    navigateToResults();
  }
});

ModernMarket.updateCart(cartCount, cartSummary);
