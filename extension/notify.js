(function () {
    const notification = document.createElement("div");
    notification.textContent = "Session ending in 5 seconds...";
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";
    notification.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    notification.style.color = "white";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "5px";
    notification.style.fontSize = "16px";
    notification.style.zIndex = "9999";
    notification.style.boxShadow = "0px 0px 10px rgba(255, 255, 255, 0.5)";

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
})();
