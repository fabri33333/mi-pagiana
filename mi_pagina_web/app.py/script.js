let points = 0;
let lastLogin = null;
let timerInterval;

// Función para crear el usuario
function createUser() {
    const name = document.getElementById('name').value;
    if (name) {
        localStorage.setItem('userName', name);
        localStorage.setItem('points', points);
        lastLogin = new Date();
        localStorage.setItem('lastLogin', lastLogin);
        localStorage.setItem('timeRemaining', 5 * 60 * 60); // 5 horas en segundos
        startApp();
    }
}

// Función para iniciar la aplicación
function startApp() {
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('user-form').style.display = 'none';
        document.getElementById('points-system').style.display = 'block';
        document.getElementById('greeting').innerText = `Hola, ${userName}`;
        points = parseInt(localStorage.getItem('points')) || 0;
        document.getElementById('points').innerText = points;
        lastLogin = new Date(localStorage.getItem('lastLogin'));
        startTimer();
        showRewardsSection();
    }
}

// Función para iniciar el temporizador
function startTimer() {
    let timeRemaining = parseInt(localStorage.getItem('timeRemaining')) || (5 * 60 * 60); // 5 horas en segundos

    // Iniciar el temporizador solo si hay tiempo restante
    if (timeRemaining > 0) {
        timerInterval = setInterval(function () {
            if (timeRemaining > 0) {
                timeRemaining--;
                localStorage.setItem('timeRemaining', timeRemaining);
                const hours = Math.floor(timeRemaining / 3600);
                const minutes = Math.floor((timeRemaining % 3600) / 60);
                const seconds = timeRemaining % 60;
                document.getElementById('time-left').innerText = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            } else {
                clearInterval(timerInterval);
                givePoints();
            }
        }, 1000);
    } else {
        givePoints(); // Si el tiempo ya pasó, otorgar los puntos
    }
}

// Función para otorgar puntos
function givePoints() {
    points += 3; // Se otorgan 3 puntos por cada 5 horas
    localStorage.setItem('points', points);
    localStorage.setItem('lastLogin', new Date());
    document.getElementById('points').innerText = points;
    document.getElementById('redeem-button').style.display = 'block'; // Mostrar botón para reclamar puntos
    localStorage.setItem('timeRemaining', 5 * 60 * 60); // Reiniciar el temporizador a 5 horas
    startTimer(); // Reiniciar el temporizador
    showRewardsSection(); // Asegurarse de que la sección de recompensas se muestre
}

// Función para reclamar puntos
function redeemPoints() {
    document.getElementById('redeem-button').style.display = 'none'; // Ocultar el botón una vez se reclamen los puntos
}

// Función para canjear recompensas
function redeemReward(cost) {
    if (points >= cost) {
        points -= cost;
        alert(`¡Canjeaste ${cost} puntos!`);
        localStorage.setItem('points', points);
        document.getElementById('points').innerText = points;
        showRewardsSection(); // Volver a verificar la sección de recompensas
    } else {
        alert("No tienes suficientes puntos para canjear.");
    }
}

// Función para mostrar la sección de recompensas
function showRewardsSection() {
    document.getElementById('rewards-section').style.display = points > 0 ? 'block' : 'none';
}

// Iniciar la aplicación si ya hay un usuario registrado
window.onload = function() {
    if (localStorage.getItem('userName')) {
        startApp();
    }
};
