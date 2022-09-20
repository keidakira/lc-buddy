const getAllRemindersToday = () => {
    const reminders = JSON.parse(localStorage.getItem("reminders"));
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
let popupDIV = document.createElement("DIV");

if (navBar === undefined) {
    navBar = document.getElementById("navbar-root");
}

let problems = getAllRemindersToday();

if (problems.length !== 0) {
    reminderPara.innerHTML = `
    Reminding you to solve ${problems.length} problems today!
    <a href="#" id="view-problems">View Problems</a>
    `;
    reminderBanner.style.background = 'red';
} else {
    reminderPara.innerText = "You don't have any reminders today!";
    reminderBanner.style.background = 'green';
}

reminderBanner.appendChild(reminderPara);

reminderBanner.style.padding = '12px';

reminderPara.style.textAlign = 'center';
reminderPara.style.color = 'white';
reminderPara.style.margin = '0';

let questionsPopupHTML = `
<div id="lc-buddy-popup" style="background-color: rgba(0,0,0,0.5); display: none; justify-content: center; align-items: center; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: 9999;">
    <div style="position: relative; width: 480px; height: 60vh; padding: 16px; border-radius: 4px; background-color: white; color: black;">
        <p style="text-align: center; color: black; margin: 8px; font-size: 16px;">Problems to do today!</p>
        <hr >
        <ul class="m-0 p-0">
            ${
                getAllRemindersToday().map(r => {
                    let parts = r.split("-");
                    parts = parts.map(p => {
                        return p[0].toUpperCase() + p.substring(1)
                    });
                    
                    let title = parts.join(" ");
                    let url = "https://leetcode.com/problems/" + r;

                    return `<li class="p-2 mt-2">
                        <a href="${url}" target="_blank">${title}</a>
                    </li>`;
                })
            }
        </ul>
        <div style="position: absolute; bottom: 8px; width: calc(100% - 32px);">
            <hr >
            <button id="close-lc-buddy-popup" style="float: right; padding: 6px 16px; border: 1px solid #c1c1c1; border-radius: 4px; margin: 8px 0px;">Close</button>
        </div>
    </div>
</div>
`;

popupDIV.innerHTML = questionsPopupHTML;

reminderBanner.append(popupDIV);

navBar.insertAdjacentElement('afterend', reminderBanner);

let closePopupButton = document.getElementById("close-lc-buddy-popup");
let viewProblems = document.getElementById("view-problems");

closePopupButton.addEventListener('click', (event) => {
    document.getElementById("lc-buddy-popup").style.display = 'none';
});

viewProblems.addEventListener('click', (event) => {
    event.preventDefault();

    document.getElementById("lc-buddy-popup").style.display = 'flex';
});