const text = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, commodi delectus expedita explicabo fugiat fugit harum illo labore maiores necessitatibus nisi, quos rem saepe similique voluptate. Ab incidunt odio soluta.";
const msInMinute = 60 * 1000;
const minWPM = 100;

let interval;
let changeTimeout;
let wordsPerMinute = 100;
let prevWordsPerMinute = 100;
let splittedText = text.split(/\s/);
let phrase = 0;
let paragraph;
let changedWPM = false;
let restart = false;
let pause = false;
let firstStart = true;
let prevDate;

function checkPhrase() {
    if (!splittedText[phrase + 1]) {
        phrase = 0;
    }
}

function checkInterval() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
}

function logDateDifference() {
    if (prevDate) {
        console.log(new Date().getTime() - prevDate.getTime());
    }
    prevDate = new Date();
}

function handler() {
    // logDateDifference();
    if (pause) {
        return
    }
    if (restart) {
        startReadingInterval();
    }
    if (splittedText[phrase]) {
        paragraph.textContent = splittedText[phrase++];
    } else {
        checkInterval();
    }
}

function startReadingInterval() {
    checkInterval();
    checkPhrase();
    restart = false;
    interval = setInterval(handler, msInMinute / wordsPerMinute)
}

function startReading() {
    if (!paragraph) {
        paragraph = document.getElementById("text");
    }
    if (!interval) {
        startReadingInterval();
    } else {
        if (changedWPM) {
            changedWPM = false;
            restart = true;
        }
    }

}

function changeButtonText() {
    document.getElementById("start_button").textContent = pause ? "Start" : "Pause"
}

function startStop() {
    if (firstStart) {
        firstStart = false;
        startReading();
    } else {
        pause = !pause;
    }
    changeButtonText();
}

/**
 * @param target{HTMLInputElement}
 */
function changeWPM(target) {
    if (changeTimeout) {
        clearTimeout(changeTimeout);
        changeTimeout = null;
    }
    changeTimeout = setTimeout(() => {
        let wpmValue = target.value;
        if (!wpmValue || wpmValue < minWPM) {
            target.value = prevWordsPerMinute;
            wpmValue = prevWordsPerMinute;
        }
        wordsPerMinute = wpmValue;
        prevWordsPerMinute = wpmValue;
        changedWPM = true;
        startReading();
    }, 1000);
}

document.onkeyup = (event) => {
    if (event.code === "Space" || event.code === "Enter") {
        startStop();
    }
};