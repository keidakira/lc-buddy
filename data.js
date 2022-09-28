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

    response = await fetch("https://leetcode.com/graphql", {
        ...requestOptions,
        body: getUserLastNSubmission(10, username)
    }).then(res => res.json());

    console.log(response);
})();