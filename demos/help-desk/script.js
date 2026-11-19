const sampleTickets = [
    {
        id: "HD-104",
        title: "Shared printer is offline",
        category: "Hardware",
        priority: "High",
        status: "Open",
        description: "A shared office printer is unavailable to connected workstations."
    },
    {
        id: "HD-103",
        title: "Intermittent Wi-Fi in meeting room",
        category: "Network",
        priority: "Normal",
        status: "In progress",
        description: "The wireless connection drops during meetings in one room."
    },
    {
        id: "HD-102",
        title: "Install an approved software update",
        category: "Software",
        priority: "Low",
        status: "Resolved",
        description: "A workstation needed a routine update to an approved application."
    }
];

const ticketList = document.getElementById("ticket-list");
const emptyState = document.getElementById("empty-state");
const ticketSearch = document.getElementById("ticket-search");
const ticketForm = document.getElementById("ticket-form");
const formStatus = document.getElementById("form-status");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const countElements = {
    total: document.getElementById("total-count"),
    open: document.getElementById("open-count"),
    progress: document.getElementById("progress-count"),
    resolved: document.getElementById("resolved-count")
};

let tickets = [...sampleTickets];
let activeFilter = "all";
let nextTicketNumber = 105;

const normalizeSearchText = value => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const createTicketCard = ticket => {
    const card = document.createElement("article");
    card.className = "ticket-card";

    const header = document.createElement("div");
    header.className = "ticket-top";

    const id = document.createElement("span");
    id.className = "ticket-id";
    id.textContent = ticket.id;

    const priority = document.createElement("span");
    priority.className = `ticket-priority${ticket.priority === "High" ? " is-high" : ""}`;
    priority.textContent = `${ticket.priority} priority`;
    header.append(id, priority);

    const title = document.createElement("h3");
    title.textContent = ticket.title;

    const description = document.createElement("p");
    description.className = "ticket-description";
    description.textContent = ticket.description;

    const footer = document.createElement("div");
    footer.className = "ticket-bottom";

    const category = document.createElement("span");
    category.className = "ticket-category";
    category.textContent = ticket.category;

    const statusLabel = document.createElement("label");
    statusLabel.textContent = "Status";

    const statusSelect = document.createElement("select");
    statusSelect.className = "ticket-status";
    statusSelect.setAttribute("aria-label", `Status for ${ticket.id}: ${ticket.title}`);

    ["Open", "In progress", "Resolved"].forEach(status => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        option.selected = ticket.status === status;
        statusSelect.append(option);
    });

    statusSelect.addEventListener("change", () => {
        ticket.status = statusSelect.value;
        formStatus.textContent = `${ticket.id} marked ${ticket.status.toLowerCase()}.`;
        renderTickets();
        const updatedStatus = ticketList.querySelector(`[aria-label^="Status for ${ticket.id}:"]`);

        if (updatedStatus) {
            updatedStatus.focus();
        } else {
            filterButtons.find(button => button.dataset.filter === activeFilter)?.focus();
        }
    });

    statusLabel.append(statusSelect);
    footer.append(category, statusLabel);
    card.append(header, title, description, footer);

    return card;
};

const renderTickets = () => {
    const query = normalizeSearchText(ticketSearch.value.trim());
    const visibleTickets = tickets.filter(ticket => {
        const matchesFilter = activeFilter === "all" || ticket.status === activeFilter;
        const searchableText = normalizeSearchText(
            `${ticket.title} ${ticket.description} ${ticket.category} ${ticket.id}`
        );
        const matchesSearch = searchableText.includes(query);

        return matchesFilter && matchesSearch;
    });

    ticketList.replaceChildren(...visibleTickets.map(createTicketCard));
    emptyState.hidden = visibleTickets.length > 0;

    countElements.total.textContent = String(tickets.length);
    countElements.open.textContent = String(tickets.filter(ticket => ticket.status === "Open").length);
    countElements.progress.textContent = String(tickets.filter(ticket => ticket.status === "In progress").length);
    countElements.resolved.textContent = String(tickets.filter(ticket => ticket.status === "Resolved").length);
};

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter || "all";

        filterButtons.forEach(filterButton => {
            const isActive = filterButton === button;
            filterButton.classList.toggle("is-active", isActive);
            filterButton.setAttribute("aria-pressed", String(isActive));
        });

        renderTickets();
    });
});

ticketSearch.addEventListener("input", renderTickets);

ticketForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(ticketForm);
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (!title || !description) {
        formStatus.textContent = "Add a title and details to create a sample request.";
        return;
    }

    const ticket = {
        id: `HD-${nextTicketNumber}`,
        title,
        category: String(formData.get("category") || "Other"),
        priority: String(formData.get("priority") || "Normal"),
        status: "Open",
        description
    };

    nextTicketNumber += 1;
    tickets = [ticket, ...tickets];
    activeFilter = "all";
    ticketSearch.value = "";

    filterButtons.forEach(button => {
        const isActive = button.dataset.filter === "all";
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    renderTickets();
    ticketForm.reset();
    formStatus.textContent = `${ticket.id} added. This sample request remains in this page session only.`;
});

renderTickets();
