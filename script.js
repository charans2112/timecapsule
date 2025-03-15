function saveCapsule() {
    const capsuleName = document.getElementById("capsule-name").value.trim();
    const unlockDate = new Date(document.getElementById("unlock-date").value).getTime();
    const message = document.getElementById("message").value;
    const fileInput = document.getElementById("file-upload");
    const linkInput = document.getElementById("capsule-link").value.trim();
    const editingCapsuleId = document.getElementById("editing-capsule-id").value;

    if (!capsuleName || !unlockDate || !message) {
        alert("Please provide a capsule name, set an unlock date, and write a message.");
        return;
    }

    let capsuleId = editingCapsuleId || `capsule-${Date.now()}`;
    let fileData = null;
    let fileType = null;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            fileData = e.target.result;
            fileType = file.type;
            storeCapsule(capsuleId, capsuleName, unlockDate, message, fileData, fileType, linkInput);
        };
        reader.readAsDataURL(file);
    } else {
        storeCapsule(capsuleId, capsuleName, unlockDate, message, null, null, linkInput);
    }
}

function storeCapsule(capsuleId, capsuleName, unlockDate, message, fileData = null, fileType = null, link = "") {
    const capsuleData = { capsuleName, unlockDate, message, fileData, fileType, link };
    localStorage.setItem(capsuleId, JSON.stringify(capsuleData));

    let history = JSON.parse(localStorage.getItem("capsuleHistory")) || [];
    if (!history.some(capsule => capsule.capsuleId === capsuleId)) {
        history.push({ capsuleId, capsuleName, unlockDate });
    } else {
        history = history.map(capsule => capsule.capsuleId === capsuleId ? { capsuleId, capsuleName, unlockDate } : capsule);
    }
    localStorage.setItem("capsuleHistory", JSON.stringify(history));

    resetForm();
    loadCapsuleHistory();
}

function loadCapsuleHistory() {
    const historyContainer = document.getElementById("capsule-history");
    historyContainer.innerHTML = "";

    const history = JSON.parse(localStorage.getItem("capsuleHistory")) || [];
    if (history.length === 0) {
        historyContainer.innerHTML = "<p>No capsules created yet.</p>";
        return;
    }

    history.forEach(({ capsuleId, capsuleName, unlockDate }) => {
        const unlockDateFormatted = new Date(unlockDate).toLocaleString();
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${capsuleName}</strong> (Unlocks: ${unlockDateFormatted})
            <a href="capsule.html?capsule=${capsuleId}" target="_blank">Open</a>
            <button onclick="editCapsule('${capsuleId}')">Edit</button>
            <button onclick="deleteCapsule('${capsuleId}')">Delete</button>
        `;
        historyContainer.appendChild(listItem);
    });
}

function editCapsule(capsuleId) {
    const savedCapsule = localStorage.getItem(capsuleId);
    if (!savedCapsule) {
        alert("Capsule not found.");
        return;
    }

    const { capsuleName, unlockDate, message, link, fileData, fileType } = JSON.parse(savedCapsule);
    document.getElementById("editing-capsule-id").value = capsuleId;
    document.getElementById("capsule-name").value = capsuleName;
    document.getElementById("unlock-date").value = new Date(unlockDate - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    document.getElementById("message").value = message;
    document.getElementById("capsule-link").value = link;

    if (fileData) {
        document.getElementById("file-upload").setAttribute("data-file-name", "File previously uploaded");
    }
    
    document.getElementById("cancel-edit-btn").classList.remove("hidden");
}

function resetForm() {
    document.getElementById("capsule-name").value = "";
    document.getElementById("unlock-date").value = "";
    document.getElementById("message").value = "";
    document.getElementById("capsule-link").value = "";
    document.getElementById("file-upload").value = "";
    document.getElementById("editing-capsule-id").value = "";
    document.getElementById("cancel-edit-btn").classList.add("hidden");
}

function deleteCapsule(capsuleId) {
    localStorage.removeItem(capsuleId);

    let history = JSON.parse(localStorage.getItem("capsuleHistory")) || [];
    history = history.filter(capsule => capsule.capsuleId !== capsuleId);
    localStorage.setItem("capsuleHistory", JSON.stringify(history));

    loadCapsuleHistory();
}

function cancelEdit() {
    resetForm();
}

window.onload = loadCapsuleHistory;
