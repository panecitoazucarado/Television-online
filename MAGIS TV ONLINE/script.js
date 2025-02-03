document.addEventListener("DOMContentLoaded", function () {
    const videoPlayer = document.getElementById("video-player");
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    const channelList = document.getElementById("channel-list");
    const preloadVideo = (videoUrl) => {
        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.preload = 'auto'; // Indica al navegador que cargue el video en segundo plano
        videoElement.load();
    };
    
    // Pre-cargar el video cuando el usuario esté navegando
    preloadVideo('https://path/to/your/video.m3u8');
    // Cargar canales desde JSON
    fetch("channels.json")
        .then(response => response.json())
        .then(data => {
            data.channels.forEach(channel => {
                let listItem = document.createElement("li");
                listItem.textContent = channel.name;
                listItem.addEventListener("click", () => loadChannel(channel.url, listItem));
                channelList.appendChild(listItem);
            });

            // Cargar el primer canal al iniciar
            if (data.channels.length > 0) {
                loadChannel(data.channels[0].url, channelList.querySelector('li')); // Resalta el primer canal
            }
        })
        .catch(error => console.error("Error cargando canales:", error));

    // Función para cargar y reproducir el canal en vivo
    function loadChannel(url, listItem) {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(videoPlayer);
            hls.on(Hls.Events.MANIFEST_PARSED, () => videoPlayer.play());
        } else if (videoPlayer.canPlayType("application/vnd.apple.mpegurl")) {
            videoPlayer.src = url;
            videoPlayer.play();
        } else {
            alert("Tu navegador no soporta la reproducción de video en vivo.");
        }

        // Resaltar el canal activo
        const allChannels = document.querySelectorAll('#channel-list li');
        allChannels.forEach(channel => channel.classList.remove('active')); // Remover clase 'active' de todos
        listItem.classList.add('active'); // Agregar clase 'active' al canal actual
    }

    // Botón de pantalla completa
    fullscreenBtn.addEventListener("click", function () {
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        } else if (videoPlayer.mozRequestFullScreen) {
            videoPlayer.mozRequestFullScreen();
        } else if (videoPlayer.webkitRequestFullscreen) {
            videoPlayer.webkitRequestFullscreen();
        } else if (videoPlayer.msRequestFullscreen) {
            videoPlayer.msRequestFullscreen();
        }
    });
});