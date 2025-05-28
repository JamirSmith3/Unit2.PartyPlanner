const COHORT = "Unit2.PartyPlanner";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const form = document.querySelector("form");
const eventList = document.querySelector("#events");

const state = {
  parties: [],
};

async function getEvents() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    state.parties = json.data;
  } catch (err) {
    console.error("Failed to fetch events:", err);
  }
}

async function addEvent(eventData) {
  eventData.date = new Date(eventData.date).toISOString();
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message);
  } catch (err) {
    console.error("Failed to add event:", err);
  }
}


async function deleteEvent(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
  } catch (err) {
    console.error("Failed to delete event:", err);
  }
}


function renderEvents() {
  if (!state.parties.length) {
    eventList.innerHTML = "<li>No Events</li>";
    return;
  }

  const cards = state.parties.map((evt) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${evt.name}</h2>
      <time datetime="${evt.date}">${evt.date.slice(0, 10)}</time>
      <address>${evt.location}</address>
      <p>${evt.description}</p>
      <button data-id="${evt.id}">Delete</button>
    `;

    li.querySelector("button").addEventListener("click", async () => {
      await deleteEvent(evt.id);
      await refresh(); 
    });

    return li;
  });

  eventList.replaceChildren(...cards);
}

async function refresh() {
  await getEvents();
  renderEvents();
}


document.addEventListener("DOMContentLoaded", refresh);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newEvent = {
    name:        form.eventName.value.trim(),
    description: form.description.value.trim(),
    date:        form.date.value,
    location:    form.location.value.trim(),
  };

  await addEvent(newEvent);
  form.reset();
  await refresh();
});
