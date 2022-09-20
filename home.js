const getAllRemindersToday = () => {
    const reminders = localStorage.getItem("reminders");
    const today = new Date();

    if (reminders === null || reminders === undefined) {
        return []
    }

    let problems = []

    for(let problem in reminders) {
        let d = new Date(reminders[problem]);

        if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()) {
            problems.push(problem);
        }
    }

    return problems;
}

let navBar = document.getElementsByTagName("NAV")[0];
let reminderBanner = document.createElement("DIV");
let reminderPara = document.createElement("P");

let problems = getAllRemindersToday();

if (problems.length !== 0) {
    reminderPara.innerText = "Reminding you to solve " + problems.length + " problems today!";
    reminderBanner.style.background = 'red';
} else {
    reminderPara.innerText = "You don't have any reminders today!";
    reminderBanner.style.background = 'green';
}

reminderBanner.appendChild(reminderPara);

reminderBanner.style.padding = '12px';

reminderPara.style.textAlign = 'center';
reminderPara.style.color = 'white';

navBar.insertAdjacentElement('afterend', reminderBanner);