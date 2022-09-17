const convertSecondsToTime = (seconds) => {
    let time = new Date(seconds * 1000).toISOString().split("T")[1]

    return time.substring(0, 8);
}

let counter = 1;
let timer;
let latestSubmission = -1, submissionStatus = "";
let submissionTimer;

const startTimer = (node) => {
    node.style.background = 'none';
    node.style.color = 'black';

    timer = setInterval(() =>
    {
        let time = convertSecondsToTime(counter);
        counter += 1;

        node.innerText = time;
    }, 1000);
}

const endTimer = (timerNode) => {
    timerNode.style.backgroundColor = 'cornflowerblue';
    timerNode.style.color = 'white';
    clearInterval(timer);
}

const resetTimer = (node) => {
    counter = 1;
    node.innerText = "00:00:00";
    node.style.backgroundClip = 'cornflowerblue';
    node.style.color = 'white';
    clearInterval(timer);
}

const checkResult = () => {
    let table = document.querySelector(".ant-table-tbody");
    if (table) {
        return [
            table.children[0].getAttribute("data-row-key"),
            table.children[0].children[1].innerText
        ]
    }

    return -1;
}

window.onload = () => {
    setTimeout(() => {
        let referenceNode = document.querySelector(".navbar-right-container__COIx");
        console.log(referenceNode);

        let newNode = document.createElement("DIV");
        newNode.setAttribute("id", "lc-buddy-timer");
        newNode.style.display = 'flex';
        newNode.style.gap = '1rem';
        newNode.style.justifyContent = 'center';
        newNode.style.alignItems = 'center';

        let timerNode = document.createElement("DIV");
        let startNode = document.createElement("button");
        let endNode = document.createElement("button");
        let reminder = document.createElement("DIV");

        startNode.innerText = "Start";
        endNode.innerText = "Reset";
        timerNode.innerText = "00:00:00";

        timerNode.style.background = 'cornflowerblue';
        timerNode.style.padding = '4px';
        timerNode.style.color = 'white';

        reminder.style.paddingTop = '16px';
        reminder.style.fontSize = '16px';
        reminder.style.fontWeight = '500';

        startNode.addEventListener('click', (event) => {
            if (startNode.innerText === "Start") {
                startNode.innerText = "Pause";
                startTimer(timerNode);
            } else {
                if (startNode.innerText === "Pause") {
                    startNode.innerText = "Resume";
                    endTimer(timerNode);
                } else {
                    startNode.innerText = "Pause";
                    startTimer(timerNode);
                }
            }
        });

        endNode.addEventListener('click', (event) => {
            startNode.innerText = "Start";
            resetTimer(timerNode);
        })

        timerNode.style.fontWeight = 'bold';
        timerNode.style.fontSize = '16px';

        newNode.appendChild(startNode);
        newNode.appendChild(timerNode);
        newNode.appendChild(endNode);

        referenceNode.parentNode.insertBefore(newNode, referenceNode);

        let submitButton = document.querySelector("[data-cy='submit-code-btn']");
        latestSubmission = checkResult();

        submitButton.addEventListener('click', (event) => {
            submissionTimer = setInterval(() => {
                let [submission, status] = checkResult();
                console.log("Checking");

                if (submission !== latestSubmission) {
                    latestSubmission = submission;
                    submissionStatus = status;

                    if (status === "Accepted") {
                        let [h, m, s] = convertSecondsToTime(counter).split(":");
                        let timeTaken = "";

                        if (h !== "00") {
                            timeTaken += h + " hrs ";
                        }

                        if (h !== "00" || m !== "00") {
                            timeTaken += m + " mins ";
                        }

                        if (m !== "00" || h !== "00" || s !== "00") {
                            timeTaken += s + " s";
                        }

                        reminder.innerHTML = `
                            <p>Yay! You took <span style="font-size: 20px">${timeTaken}</span> to finish this problem!</p>
                        `;

                        let successInfo = document.querySelector(".container__nthg");
                        console.log(successInfo);
                        successInfo.insertAdjacentElement('afterend', reminder);

                        endTimer(timerNode);
                    }

                    clearInterval(submissionTimer);
                }
            }, 1000);
        });
    }, 2000);
}

