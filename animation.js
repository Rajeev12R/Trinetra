document.addEventListener("DOMContentLoaded", () => {
    // Navbar animation
    gsap.to("#navbar", { duration: 1, opacity: 1, y: 0, ease: "power3.out" });

    // Hero section animation
    gsap.to("#hero", { duration: 1, opacity: 1, scale: 1, ease: "power3.out", delay: 0.5 });

    // Chat button animation
    gsap.to("#chatButton", { y: -5, repeat: -1, yoyo: true, duration: 1, ease: "power1.inOut" });
});

// Chatbox Toggle Animation
let chatOpen = false;
const chatButton = document.getElementById("chatButton");
const chatContainer = document.getElementById("chatContainer");
const closeChat = document.getElementById("closeChat");

chatButton.addEventListener("click", function () {
    if (!chatOpen) {
        chatContainer.classList.remove("hidden");
        gsap.to("#chatContainer", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
        chatOpen = true;
    }
});

closeChat.addEventListener("click", function () {
    gsap.to("#chatContainer", {
        opacity: 0, y: 10, duration: 0.3, ease: "power3.in", onComplete: () => {
            chatContainer.classList.add("hidden");
            chatOpen = false;
        }
    });
});