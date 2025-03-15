function checkCapsuleAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const capsuleId = urlParams.get("capsule");

    if (!capsuleId) {
        document.body.innerHTML = "<h2>Capsule not found</h2>";
        return;
    }

    const savedCapsule = localStorage.getItem(capsuleId);
    if (!savedCapsule) {
        document.body.innerHTML = "<h2>Capsule not found</h2>";
        return;
    }

    const { unlockDate, message, fileData, fileType, link } = JSON.parse(savedCapsule);
    const countdownElement = document.getElementById("countdown");

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = unlockDate - now;

        if (timeLeft <= 0) {
            clearInterval(interval);
            countdownElement.innerHTML = "🎉 Time Capsule Unlocked! 🎉";
            showCapsuleContent(message, fileData, fileType, link);
        } else {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `Unlocks in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
}

function showCapsuleContent(message, fileData, fileType, link) {
    document.getElementById("saved-message").innerText = message;
    const mediaContainer = document.getElementById("saved-media");
    mediaContainer.innerHTML = "";

    if (fileData && fileType) {
        if (fileType.startsWith("image/")) {
            mediaContainer.innerHTML = `<img src="${fileData}" alt="Capsule Image">`;
        } else if (fileType.startsWith("video/")) {
            mediaContainer.innerHTML = `<video controls><source src="${fileData}" type="${fileType}">Your browser does not support the video tag.</video>`;
        }
    }

    if (link) {
        const linkElement = document.createElement("a");
        linkElement.href = link;
        linkElement.target = "_blank";
        linkElement.innerText = "Click here";
        mediaContainer.appendChild(linkElement);
    }

    document.getElementById("capsule-content").classList.remove("hidden");
}

// Run check on page load
checkCapsuleAccess();
