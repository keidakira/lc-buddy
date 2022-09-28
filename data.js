const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "csrftoken=lJgSuPoBz9QCAKavbvC2KyFBtgmTNskE5sKpZEa7Kwfl5lj6VXEGePoftbfxmRDu");

const getLoggedInUser = JSON.stringify({
    query: `
    query globalData {
        userStatus {
            userId
            isSignedIn
            isPremium
            isVerified
            username
            avatar
        }
    }    
    `
})

const getUserSubmissionCount = (username) => {
    return JSON.stringify({
        query: `
            query userProblemsSolved($username: String!) {
                allQuestionsCount {
                    difficulty
                    count
                }
                
                matchedUser(username: $username) {
                    problemsSolvedBeatsStats {
                        difficulty
                        percentage
                    }
                    submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                        }
                    }
                }
            }
        `,
        variables: {
            "username": username
        }
    });
}

const getUserLastNSubmission = (N, username) => {
    return JSON.stringify({
        query: `
    query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
            id
            title
            titleSlug
            timestamp
        }
    }
    `,
        variables: {
            "username": username,
            "limit": N
        }
    });
}

const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
};

(async () => {
    let response = await fetch("https://leetcode.com/graphql", {
        ...requestOptions,
        body: getLoggedInUser
    })
        .then(response => response.json())
        .catch(error => console.log('error', error));

    const username = response.data.userStatus.username;

    response = await fetch("https://leetcode.com/graphql", {
        ...requestOptions,
        body: getUserSubmissionCount(username)
    }).then(res => res.json());

    const submissions = response.data.matchedUser.submitStatsGlobal.acSubmissionNum;
    const allQuestions = response.data.allQuestionsCount;

    const submissionsDIV = document.getElementsByClassName("submission-count")[0];

    submissions.forEach((s, index) => {
        let d = document.createElement("DIV");
        d.innerHTML = `
        <div class="info">
            <div>
                <span>${s.difficulty}</span>
                <span>${s.count} / ${allQuestions[index].count}</span>
            </div>
            <div class="meter ${s.difficulty.toLowerCase()}">
                <p style="width: ${s.count * 100 / allQuestions[index].count}%"></p>            
            </div>
        </div>
        `;

        submissionsDIV.appendChild(d);
    });

    let recentSubmissions = []

    response = await fetch(`https://leetcode.com/api/submissions/?offset=0&limit=20`, {
        ...requestOptions,
        method: "GET"
    }).then(res => res.json());

    recentSubmissions = response.submissions_dump;

    let todaySubmissions = [];
    let todaySubmissionsHTML = ``;
    let seenSubmissions = new Set();
    let today = new Date();
    let todayDate = `${today.getMonth()}-${today.getDate()}-${today.getFullYear()}`;

    recentSubmissions.forEach(s => {
        if (s.status_display === "Accepted") {
            let date = new Date(s.timestamp * 1000);
            let currDate = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;

            if (currDate === todayDate && !(seenSubmissions.has(s.title_slug))) {
                todaySubmissions.push(s)
                seenSubmissions.add(s.title_slug);

                todaySubmissionsHTML += `
                <div class="recent-submission">
                    <div class="name">
                        <a href="https://leetcode.com/problems/${s.title_slug}" target="_blank">
                            <h3>${s.title}</h3>
                        </a>
                        <small>${s.time} ago</small>
                    </div>                
                    <div class="link">
                        <a href="https://leetcode.com${s.url}" target="_blank">View</a>                    
                    </div>
                </div>
                `;
            }
        }
    });

    console.log(todaySubmissions);
    const problemsSolvedH2 = document.getElementById("problems-solved-today");
    problemsSolvedH2.innerText = `${todaySubmissions.length}`;

    const latestSubmissionsDIV = document.getElementsByClassName("latest-submissions")[0];
    latestSubmissionsDIV.innerHTML = todaySubmissionsHTML;

    document.getElementById("spinner").style.display = 'none';
    document.getElementsByClassName("main")[0].style.display = 'grid';
})();