const text = "Утро было тихое, город, окутанный тьмой, мирно нежился в постели. Пришло лето, и ветер был летний — теплое дыхание мира, неспешное и ленивое. Стоит лишь встать, высунуться в окошко, и тотчас поймешь: вот она начинается, настоящая свобода и жизнь, вот оно, первое утро лета.\n"
             + "\n"
             + "Дуглас Сполдинг, двенадцати лет от роду, только что открыл глаза и, как в теплую речку, погрузился в предрассветную безмятежность. Он лежал в сводчатой комнатке на четвертом этаже — во всем городе не было башни выше, — и оттого, что он парил так высоко в воздухе вместе с июньским ветром, в нем рождалась чудодейственная сила. По ночам, когда вязы, дубы и клены сливались в одно беспокойное море, Дуглас окидывал его взглядом, пронзавшим тьму, точно маяк. И сегодня… — Вот здорово! — шепнул он. Впереди целое лето, несчетное множество дней — чуть не полкалендаря. Он уже видел себя многоруким, как божество Шива из книжки про путешествия: только поспевай рвать еще зеленые яблоки, персики, черные как ночь сливы. Его не вытащить из лесу, из кустов, из речки. А как приятно будет померзнуть, забравшись в заиндевелый ледник, как весело жариться в бабушкиной кухне заодно с тысячью цыплят!";
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
    if (splittedText[phrase]!==undefined) {
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