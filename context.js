const convertSecondsToTime = (seconds) => {
  let time = new Date(seconds * 1000).toISOString().split("T")[1];

  return time.substring(0, 8);
};

let counter = 1;
let timer;
let latestSubmission = -1,
  submissionStatus = "";
let submissionTimer;
let problemSlug;

const startTimer = (node) => {
  node.style.background = "none";
  node.style.color = "black";

  timer = setInterval(() => {
    let time = convertSecondsToTime(counter);
    counter += 1;

    node.innerText = time;
  }, 1000);
};

const endTimer = (timerNode) => {
  timerNode.style.backgroundColor = "cornflowerblue";
  timerNode.style.color = "white";
  clearInterval(timer);
};

const resetTimer = (node) => {
  counter = 1;
  node.innerText = "00:00:00";
  node.style.backgroundClip = "cornflowerblue";
  node.style.color = "white";
  clearInterval(timer);
};

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

const checkResult = () => {
  let table = document.querySelector(".ant-table-tbody");
  if (table) {
    return [
      table.children[0].getAttribute("data-row-key"),
      table.children[0].children[1].innerText,
    ];
  }

  return [-1, ""];
};

const addToReminders = (problemSlug, days) => {
  const today = new Date();
  const reminderDay = new Date(today.getTime() + 86_400_000 * days);
  const remindAt = new Date(
    reminderDay.getFullYear(),
    reminderDay.getMonth(),
    reminderDay.getDate()
  );

  let reminders = JSON.parse(localStorage.getItem("reminders"));

  if (reminders === null || reminders === undefined) {
    reminders = {
      [problemSlug]: remindAt,
    };
  } else {
    if (problemSlug in reminders) {
      console.log("Already in reminder!");
    } else {
      reminders[problemSlug] = remindAt;
    }
  }

  localStorage.setItem("reminders", JSON.stringify(reminders));
};

const removeFromReminders = (problemSlug) => {
  let reminders = JSON.parse(localStorage.getItem("reminders"));

  if (problemSlug in reminders) {
    delete reminders[problemSlug];

    localStorage.setItem("reminders", JSON.stringify(reminders));
  }
};

const getRemainingDaysForProblem = (problemSlug) => {
  const reminders = JSON.parse(localStorage.getItem("reminders"));
  const today = new Date();
  const reminderDay = new Date(reminders[problemSlug]);

  return dateDiffInDays(today, reminderDay);
};

const isProblemInReminders = (problemSlug) => {
  const reminders = JSON.parse(localStorage.getItem("reminders"));

  if (reminders === null || reminders === undefined) {
    return false;
  }

  return problemSlug in reminders;
};

window.onload = () => {
  let urlParts = window.location.href.split("/");
  problemSlug = urlParts[4];

  setTimeout(() => {
    let referenceNode = document.querySelector(".css-10o4wqw");
    let reminderTime = document.createElement("P");

    if (isProblemInReminders(problemSlug)) {
      reminderTime.style.margin = "8px 0 0 0";
      reminderTime.style.fontWeight = "bold";

      reminderTime.innerText =
        "Solve this problem after " +
        getRemainingDaysForProblem(problemSlug) +
        " days";

      referenceNode.insertAdjacentElement("afterend", reminderTime);
    }
  }, 2000);

  setTimeout(() => {
    let referenceNode = document.querySelector(".navbar-right-container__COIx");

    let newNode = document.createElement("DIV");
    newNode.setAttribute("id", "lc-buddy-timer");
    newNode.style.display = "flex";
    newNode.style.gap = "1rem";
    newNode.style.justifyContent = "center";
    newNode.style.alignItems = "center";

    let timerNode = document.createElement("DIV");
    let startNode = document.createElement("button");
    let endNode = document.createElement("button");
    let reminder = document.createElement("DIV");

    startNode.classList.add("custom-btn");
    endNode.classList.add("custom-btn");

    startNode.innerText = "Start";
    endNode.innerText = "Reset";
    timerNode.innerText = "00:00:00";

    timerNode.style.background = "cornflowerblue";
    timerNode.style.padding = "4px";
    timerNode.style.color = "white";

    reminder.style.paddingTop = "16px";
    reminder.style.fontSize = "16px";
    reminder.style.fontWeight = "500";

    startNode.addEventListener("click", (event) => {
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

    endNode.addEventListener("click", (event) => {
      startNode.innerText = "Start";
      resetTimer(timerNode);
    });

    timerNode.style.fontWeight = "bold";
    timerNode.style.fontSize = "16px";

    newNode.appendChild(startNode);
    newNode.appendChild(timerNode);
    newNode.appendChild(endNode);

    referenceNode.parentNode.insertBefore(newNode, referenceNode);

    let submitButton = document.querySelector("[data-cy='submit-code-btn']");
    [latestSubmission, submissionStatus] = checkResult();

    submitButton.addEventListener("click", (event) => {
      submissionTimer = setInterval(() => {
        let [submission, status] = checkResult();
        console.log("Checking", submission, status, latestSubmission);

        if (submission !== latestSubmission) {
          latestSubmission = submission;
          submissionStatus = status;
          clearInterval(submissionTimer);

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
                        <div style="border: 1px solid #ccc; padding: 8px;">
                            <p>Yay! You took <span style="font-size: 20px">${timeTaken}</span> to finish this problem!</p>
                            <div>
                                <span>Remind you to solve this problem after</span>
                                <select id="reminder-days">
                                    <option selected disabled>-</option>
                                    <option value="1">1</option>
                                    <option value="3">3</option>
                                    <option value="5">5</option>
                                    <option value="7">7</option>
                                </select>
                                <span>days?</span>
                            </div>
                            <div style="margin-top: 8px">
                                <button id="remind-me" class="custom-btn">Yes, remind me</button>
                                <button id="dont-remind-me" class="custom-btn">No, I'm good at this problem</button>
                            </div>
                        </div>
                        `;

            let successInfo = document.querySelector(".container__nthg");
            successInfo.insertAdjacentElement("afterend", reminder);

            let problemInReminders = isProblemInReminders(problemSlug);

            let remindMeButton = document.getElementById("remind-me");
            let dontRemindMeButton = document.getElementById("dont-remind-me");

            problemInReminders && remindMeButton.classList.add("active");
            remindMeButton.addEventListener("click", () => {
              let reminderDays = document.getElementById("reminder-days").value;
              addToReminders(problemSlug, reminderDays);
              dontRemindMeButton.classList.remove("active");
              remindMeButton.classList.add("active");
            });

            dontRemindMeButton.addEventListener("click", () => {
              removeFromReminders(problemSlug);

              remindMeButton.classList.remove("active");
              dontRemindMeButton.classList.add("active");
            });

            endTimer(timerNode);
          }
        }
      }, 1000);
    });
  }, 2000);
};
