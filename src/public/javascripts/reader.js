const text = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, commodi delectus expedita explicabo fugiat fugit harum illo labore maiores necessitatibus nisi, quos rem saepe similique voluptate. Ab incidunt odio soluta.";

function startReading() {
    let splittedText = text.split(/\s/);
    let paragraph = document.getElementById("reading_text");
    let phrase = 0;
    let interval = setInterval(() => {
        if (splittedText[phrase]) {
            paragraph.textContent = splittedText[phrase++];
        } else {
            clearInterval(interval);
        }
    }, (60*1000)/200)
}