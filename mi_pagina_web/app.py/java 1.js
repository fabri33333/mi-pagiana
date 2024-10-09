let points = 0;
let lastLogin = null;
let consecutiveDays = 0;
let timerInterval;

function createUser() {
    const name = document.getElementById('name').value;
    if (name) {
        localStorage.setItem('userName', name);
        localStorage.setItem('points', 0);
        localStorage.setItem('consecutiveDays', 0);
        lastLogin = new Date();
        localStorage.setItem('lastLogin', lastLogin);
        startApp();
    }
}

function startApp() {
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('user-form').style.display = 'none';
        document.getElementById('points-system').style.display = 'block';
        document.getElementById('greeting').innerText = `Hola, ${userName}`;
        points = parseInt(localStorage.getItem('points'));
        consecutiveDays = parseInt(localStorage.getItem('consecutiveDays'));
        document.getElementById('points').innerText = points;
        lastLogin = new Date(localStorage.getItem('lastLogin'));
        startTimer();
    }
}

function startTimer() {
    const now = new Date();
    const diff = now - new Date(localStorage.getItem('lastLogin'));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));

    if (diffHours < 24) {
        const timeLeft = 24 - diffHours;
        document.getElementById('time-left').innerText = `${timeLeft}:00:00`;
        timerInterval = setInterval(updateTimer, 1000);
    } else {
        givePoints();
    }
}

function updateTimer() {
    // Lógica para actualizar el temporizador visualmente
    const timeLeft = document.getElementById('time-left').innerText.split(':');
    let hours = parseInt(timeLeft[0]);
    let minutes = parseInt(timeLeft[1]);
    let seconds = parseInt(timeLeft[2]);

    if (seconds > 0) {
        seconds--;
    } else {
        seconds = 59;
        if (minutes > 0) {
            minutes--;
        } else {
            minutes = 59;
            if (hours > 0) {
                hours--;
            }
        }
    }

    document.getElementById('time-left').innerText = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function givePoints() {
    const now = new Date();
    const diff = now - new Date(localStorage.getItem('lastLogin'));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));

    if (diffHours >= 24) {
        points += 3;  // Puntos básicos
        consecutiveDays++;
        if (consecutiveDays > 1) {
            points += 1;  // Puntos extra por día consecutivo
        }
        lastLogin = now;
        localStorage.setItem('points', points);
        localStorage.setItem('lastLogin', lastLogin);
        localStorage.setItem('consecutiveDays', consecutiveDays);
        document.getElementById('points').innerText = points;
    } else {
        clearInterval(timerInterval);
        startTimer();
    }
}

function redeemRewards() {
    if (points >= 10) {
        points -= 10;
        alert("¡Canjeaste 10 puntos por una recompensa!");
        localStorage.setItem('points', points);
        document.getElementById('points').innerText = points;
    } else {
        alert("No tienes suficientes puntos para canjear.");
    }
}

// Iniciar la aplicación si ya hay un usuario registrado
window.onload = function() {
    if (localStorage.getItem('userName')) {
        startApp();
    }
};
