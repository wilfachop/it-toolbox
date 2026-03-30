/*
main functions
*/
function copyText(id, btn) {
    const text = document.getElementById(id).value;
    navigator.clipboard.writeText(text);

    btn.innerText = "Copied!";
    setTimeout(() => {
        btn.innerText = "Copy";
    }, 1000);
}


/*
SEARCHING FUNCTIONS
*/

//stores user input/selections
let currentSearch = "";
let currentTag= "";

//updates state then applies filters
function searchSnippets() {
    currentSearch = document.getElementById("search").value.toLowerCase();
    applyFilters();
}


//filterByTag (advanced, highlighting)
function filterByTag(tag, el) {
    const normalizedTag = tag.toLowerCase();

    // If clicking the same tag → clear filter
    if (currentTag === normalizedTag) {
        currentTag = "";

        // Remove highlight from all tags
        document.querySelectorAll(".tag").forEach(t => {
            t.classList.remove("active");
        });

    } else {
        // Set new tag filter
        currentTag = normalizedTag;

        // Remove highlight from all tags
        document.querySelectorAll(".tag").forEach(t => {
            t.classList.remove("active");
        });

        // Highlight clicked tag
        el.classList.add("active");
    }

    applyFilters();
}

//the brain
function applyFilters() {
    const cards = document.getElementsByClassName("card");

    for (let card of cards) {
        const title = card.querySelector(".title-input").value.toLowerCase();
        const content = card.querySelector("textarea").value.toLowerCase();
        
        const tagInput = card.querySelector(".tag-input");
        const tags = tagInput ? tagInput.value.toLowerCase() : "";

        const matchesSearch =
            title.includes(currentSearch) ||
            content.includes(currentSearch) ||
            tags.includes(currentSearch);

        const matchesTag =
            currentTag === "" || tags.includes(currentTag);

        if (matchesSearch && matchesTag) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    }
}

//wipes input/variables then applies filters
function resetFilters() {
    // Reset state
    currentSearch = "";
    currentTag = "";

    // Clear search input (UI)
    document.getElementById("search").value = "";

    // Remove active class from all tags
    clearActiveTags();

    // Re-apply filters (shows everything)
    applyFilters();
}

//helper function to clear tags
function clearActiveTags() {
    const allTags = document.getElementsByClassName("tag");

    for (let tag of allTags) {
        tag.classList.remove("active");
    }
}


/*
EDITING FUNCTIONS
*/

function enableEdit(btn) {
    const card = btn.closest(".card");

    const textarea = card.querySelector("textarea");
    const tagInput = card.querySelector(".tag-input");
    const tagDisplay = card.querySelector(".tags-display");
    const titleInput = card.querySelector(".title-input");



    

    // Save original values
    textarea.dataset.original = textarea.value;
    tagInput.dataset.original = tagInput.value;
    titleInput.dataset.original = titleInput.value;

    // Enable editing
    textarea.removeAttribute("readonly");
    tagInput.removeAttribute("readonly");
    titleInput.removeAttribute("readonly");

    // Toggle tag UI
    tagDisplay.style.display = "none";
    tagInput.style.display = "block";

    // Toggle buttons
    card.querySelector(".edit-btn").style.display = "none";
    card.querySelector(".save-btn").style.display = "inline";
    card.querySelector(".cancel-btn").style.display = "inline";
    card.querySelector(".delete-btn").style.display = "inline";
    card.querySelector(".duplicate-btn").style.display = "inline";
}

function saveEdit(btn) {
    const card = btn.closest(".card");

    const textarea = card.querySelector("textarea");
    const tagInput = card.querySelector(".tag-input");
    const titleInput = card.querySelector(".title-input");
    
    const id = textarea.dataset.id;
    const content = textarea.value;
    const title = titleInput.value;

    const tags = tagInput.value
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

    fetch("/update-snippet", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            title: title,
            content: content,
            tags: tags
        })
    })
    .then(res => res.json())
    .then(data => {
        location.reload();
    });

}

function cancelEdit(btn) {
    const card = btn.closest(".card");

    const textarea = card.querySelector("textarea");
    const tagInput = card.querySelector(".tag-input");
    const tagDisplay = card.querySelector(".tags-display");
    const titleInput = card.querySelector(".title-input");

    // Restore original values
    textarea.value = textarea.dataset.original;
    tagInput.value = tagInput.dataset.original;
    titleInput.value = titleInput.dataset.original;

    // Lock fields again
    textarea.setAttribute("readonly", true);
    tagInput.setAttribute("readonly", true);
    titleInput.setAttribute("readonly", true);

    // Switch UI back
    tagDisplay.style.display = "block";
    tagInput.style.display = "none";

    // Reset buttons
    resetButtons(card);
}

//helper
    
function resetButtons(card) {
    card.querySelector(".edit-btn").style.display = "inline";
    card.querySelector(".save-btn").style.display = "none";
    card.querySelector(".cancel-btn").style.display = "none";
    card.querySelector(".delete-btn").style.display = "none";
    card.querySelector(".duplicate-btn").style.display = "none";
}

// Delete function
function deleteSnippet(btn) {
    const confirmed = confirm("Are you sure you want to delete this snippet?");
    if (!confirmed) return;

    const card = btn.closest(".card");
    const textarea = card.querySelector("textarea");

    const id = textarea.dataset.id;

    fetch("/delete-snippet", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Deleted:", data);

        // Remove from UI immediately
        card.remove();
    });
}

// Duplicate function
function duplicateSnippet(btn) {
    const card = btn.closest(".card");
    const textarea = card.querySelector("textarea");

    const id = textarea.dataset.id;

    fetch("/duplicate-snippet", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Duplicated:", data);

        // Easiest approach for now:
        location.reload();
    });
}