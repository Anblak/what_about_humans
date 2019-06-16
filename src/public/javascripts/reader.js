const text = "Утро было тихое, город, окутанный тьмой, мирно нежился в постели. Пришло лето, и ветер был летний — теплое дыхание мира, неспешное и ленивое. Стоит лишь встать, высунуться в окошко, и тотчас поймешь: вот она начинается, настоящая свобода и жизнь, вот оно, первое утро лета.\n"
    + "\n"
    + "Дуглас Сполдинг, двенадцати лет от роду, только что открыл глаза и, как в теплую речку, погрузился в предрассветную безмятежность. Он лежал в сводчатой комнатке на четвертом этаже — во всем городе не было башни выше, — и оттого, что он парил так высоко в воздухе вместе с июньским ветром, в нем рождалась чудодейственная сила. По ночам, когда вязы, дубы и клены сливались в одно беспокойное море, Дуглас окидывал его взглядом, пронзавшим тьму, точно маяк. И сегодня… — Вот здорово! — шепнул он. Впереди целое лето, несчетное множество дней — чуть не полкалендаря. Он уже видел себя многоруким, как божество Шива из книжки про путешествия: только поспевай рвать еще зеленые яблоки, персики, черные как ночь сливы. Его не вытащить из лесу, из кустов, из речки. А как приятно будет померзнуть, забравшись в заиндевелый ледник, как весело жариться в бабушкиной кухне заодно с тысячью цыплят!";
const msInMinute = 60 * 1000;
const minWPM = 100;

let interval;
let changeTimeout;
let wordsPerMinute = 100;
let prevWordsPerMinute = 100;
let splittedText;
let phrase = 0;
let prevPhrase;
let paragraph;
let changedWPM = false;
let restart = false;
let pause = true;
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

function selectSpan(id) {
    document.getElementById(getSpanPhraseId(id)).setAttribute('class', 'current_phrase');
}

function deselectSpan(id) {
    if (id !== undefined) {
        document.getElementById(getSpanPhraseId(id)).removeAttribute('class');
    }
}

function handler() {
    // logDateDifference();
    if (pause) {
        return
    }
    if (restart) {
        startReadingInterval();
    }
    if (splittedText[phrase] !== undefined) {
        deselectSpan(prevPhrase);
        selectSpan(phrase);
        paragraph.textContent = splittedText[phrase];
        prevPhrase = phrase++;
    } else {
        deselectSpan(prevPhrase);
        startStop();
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
    }
    pause = !pause;
    startReading();
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
        startStop();
    }, 1000);
}

function processOwnText() {
    let textAreaElement = document.getElementById("my_text");
    if (textAreaElement.value === "") {
        processText(text);
    } else {
        processText(textAreaElement.value);
    }
}

function getSpanPhraseId(lastPhraseIdx) {
    return `phrase-${lastPhraseIdx}`;
}

/**
 * @param text{string}
 */
function processText(text) {
    splittedText = text.split(/\s/).filter(value => value !== "");
    let paragraphs = text.split('\n').map(value => value.split(/\s/).filter(value => value !== ""));
    phrase = 0;
    prevPhrase = undefined;
    let textSearcher = document.getElementsByClassName('text_searcher').item(0);
    while (textSearcher.firstChild) {
        textSearcher.removeChild(textSearcher.firstChild);
    }
    let lastPhraseIdx = 0;
    for (let one of paragraphs) {
        for (let i = 0; i < one.length; lastPhraseIdx++, i++) {
            let chars = one[i];
            let span = document.createElement('span');
            span.id = getSpanPhraseId(lastPhraseIdx);
            span.innerText = chars;
            span.onclick = (e) => selectPhrase(e.target);
            textSearcher.appendChild(span);
        }
        let div = document.createElement('div');
        div.style.width = 'inherit';
        div.style.height = '.3vw';
        textSearcher.appendChild(div);
    }
    restart = true;
}

function selectPhrase(target) {
    phrase = +target.id.split('-')[1];
    selectSpan(phrase);
    deselectSpan(prevPhrase);
}

document.onkeyup = (event) => {
    if (!(event.target instanceof HTMLTextAreaElement) && (event.code === "Space" || event.code === "Enter")) {
        startStop();
    }
};
setTimeout(() => {
    processText(text);
}, 1);