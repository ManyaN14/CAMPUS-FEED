const ISSUE_KEY = "campusFeedIssues";
const USER_KEY = "campusFeedUser";


/*
    Demo issues

    These appear automatically if no issues
    have been created by Person 2 yet.
*/

const demoIssues = [

    {
        id: 1,

        title: "Broken Water Cooler – Block C",

        category: "Infrastructure",

        location: "Block C",

        severity: "High",

        description:
            "Water cooler is not working.",

        supporters: 248,

        status: "Active",

        comments: []
    },


    {
        id: 2,

        title: "Wi-Fi not working in Library",

        category: "Wi-Fi / Technology",

        location: "Library",

        severity: "Medium",

        description:
            "Students are unable to connect reliably.",

        supporters: 173,

        status: "Active",

        comments: []
    }

];



/* =========================
   GET ISSUES
========================= */

function getIssues() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(ISSUE_KEY)
            );


        if (
            Array.isArray(saved) &&
            saved.length > 0
        ) {

            return saved;

        }

    }

    catch (error) {

        console.log(
            "Could not read issues",
            error
        );

    }


    localStorage.setItem(
        ISSUE_KEY,
        JSON.stringify(demoIssues)
    );


    return [...demoIssues];
}



/* =========================
   SAVE ISSUES
========================= */

function saveIssues(issues) {

    localStorage.setItem(
        ISSUE_KEY,
        JSON.stringify(issues)
    );

}



/* =========================
   GET USER
========================= */

function getUser() {

    try {

        return (
            JSON.parse(
                localStorage.getItem(USER_KEY)
            )
            ||
            {
                name: "Student",
                email: "student@college.edu"
            }
        );

    }

    catch (error) {

        return {
            name: "Student",
            email: "student@college.edu"
        };

    }

}



/* =========================
   SECURITY HELPER
========================= */

function esc(value) {

    return String(value ?? "")
        .replace(
            /[&<>"']/g,
            function (character) {

                return {

                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;"

                }[character];

            }
        );

}



/* =========================
   STAT CARD
========================= */

function statCard(
    label,
    value,
    note
) {

    return `

        <article class="stat-card">

            <span>
                ${esc(label)}
            </span>

            <strong>
                ${esc(value)}
            </strong>

            <small>
                ${esc(note)}
            </small>

        </article>

    `;

}



/* =========================
   REPORT DASHBOARD
========================= */

function renderReports() {

    const issues = getIssues();


    const totalSupport =
        issues.reduce(
            (sum, issue) =>
                sum +
                Number(
                    issue.supporters || 0
                ),
            0
        );


    const active =
        issues.filter(
            issue =>
                String(issue.status)
                    .toLowerCase()
                !==
                "resolved"
        ).length;


    const resolved =
        issues.filter(
            issue =>
                String(issue.status)
                    .toLowerCase()
                ===
                "resolved"
        ).length;



    const summaryCards =
        document.getElementById(
            "summaryCards"
        );


    if (!summaryCards) {

        return;

    }



    summaryCards.innerHTML = [

        statCard(
            "Total Issues",
            issues.length,
            "All submitted issues"
        ),

        statCard(
            "Active Issues",
            active,
            "Need attention"
        ),

        statCard(
            "Resolved",
            resolved,
            "Marked as resolved"
        ),

        statCard(
            "Total Support",
            totalSupport,
            "Student support votes"
        )

    ].join("");



    /* Sort issues by support */

    const topIssues =
        [...issues]
            .sort(
                (a, b) =>
                    Number(b.supporters || 0)
                    -
                    Number(a.supporters || 0)
            )
            .slice(0, 5);



    const topIssuesElement =
        document.getElementById(
            "topIssues"
        );



    topIssuesElement.innerHTML =
        topIssues.length

        ?

        topIssues
            .map(
                (issue, index) => `

                <div class="issue-row">

                    <div class="rank">

                        ${index + 1}

                    </div>


                    <div class="issue-main">

                        <h3>
                            ${esc(issue.title)}
                        </h3>

                        <p>
                            ${esc(
                                issue.category
                                || "General"
                            )}

                            ·

                            ${esc(
                                issue.location
                                || "Campus"
                            )}
                        </p>

                    </div>


                    <strong>

                        ${Number(
                            issue.supporters || 0
                        )}

                        supporters

                    </strong>

                </div>

            `
            )
            .join("")

        :

        `
            <p class="empty">
                No issues found yet.
            </p>
        `;



    renderBars(
        document.getElementById(
            "categoryChart"
        ),
        issues
    );

}



/* =========================
   CATEGORY COUNTS
========================= */

function categoryCounts(issues) {

    const counts = {};


    issues.forEach(
        issue => {

            const category =
                issue.category
                ||
                "General";


            counts[category] =
                (
                    counts[category]
                    ||
                    0
                )
                +
                1;

        }
    );


    return Object.entries(counts)
        .sort(
            (a, b) =>
                b[1] - a[1]
        );

}



/* =========================
   CATEGORY BARS
========================= */

function renderBars(
    container,
    issues
) {

    if (!container) {

        return;

    }


    const entries =
        categoryCounts(issues);


    const max =
        Math.max(
            ...entries.map(
                item => item[1]
            ),
            1
        );



    container.innerHTML =
        entries.length

        ?

        entries
            .map(
                ([name, count]) => `

                <div class="bar-row">

                    <div class="bar-label">

                        <span>
                            ${esc(name)}
                        </span>

                        <strong>
                            ${count}
                        </strong>

                    </div>


                    <div class="bar-track">

                        <div
                            class="bar-fill"
                            style="
                                width:
                                ${(count / max) * 100}%;
                            "
                        >
                        </div>

                    </div>

                </div>

            `
            )
            .join("")

        :

        `
            <p class="empty">
                No category data available.
            </p>
        `;

}



/* =========================
   MONTHLY REPORT
========================= */

function renderMonthly() {

    const issues = getIssues();


    const summary =
        document.getElementById(
            "monthlySummary"
        );


    if (!summary) {

        return;

    }


    const totalSupport =
        issues.reduce(
            (sum, issue) =>
                sum +
                Number(
                    issue.supporters || 0
                ),
            0
        );


    const resolved =
        issues.filter(
            issue =>
                String(issue.status)
                    .toLowerCase()
                ===
                "resolved"
        ).length;


    const categories =
        categoryCounts(issues);


    const topIssue =
        [...issues]
            .sort(
                (a, b) =>
                    Number(b.supporters || 0)
                    -
                    Number(a.supporters || 0)
            )[0];



    summary.innerHTML = [

        statCard(
            "Issues Reported",
            issues.length,
            "This dashboard period"
        ),

        statCard(
            "Support Received",
            totalSupport,
            "Total support votes"
        ),

        statCard(
            "Resolved",
            resolved,
            "Completed issues"
        ),

        statCard(
            "Categories",
            categories.length,
            "Areas of concern"
        )

    ].join("");



    /* Top issue */

    const topIssueElement =
        document.getElementById(
            "monthlyTopIssue"
        );


    topIssueElement.innerHTML =

        topIssue

        ?

        `

            <div class="highlight">

                <span class="emoji">
                    🔥
                </span>

                <div>

                    <h3>
                        ${esc(
                            topIssue.title
                        )}
                    </h3>

                    <p>

                        ${Number(
                            topIssue.supporters
                            || 0
                        )}

                        students support
                        this issue.

                    </p>

                </div>

            </div>

        `

        :

        `
            <p class="empty">
                No issues yet.
            </p>
        `;



    /* Top category */

    const topCategoryElement =
        document.getElementById(
            "monthlyTopCategory"
        );


    topCategoryElement.innerHTML =

        categories.length

        ?

        `

            <div class="highlight">

                <span class="emoji">
                    📊
                </span>

                <div>

                    <h3>
                        ${esc(
                            categories[0][0]
                        )}
                    </h3>

                    <p>

                        ${categories[0][1]}
                        issue(s) reported.

                    </p>

                </div>

            </div>

        `

        :

        `
            <p class="empty">
                No categories yet.
            </p>
        `;



    renderBars(

        document.getElementById(
            "monthlyCategories"
        ),

        issues

    );

}



/* =========================
   PROFILE
========================= */

function renderProfile() {

    const user =
        getUser();


    const issues =
        getIssues();


    const name =
        user.name
        ||
        user.username
        ||
        "Student";



    document.getElementById(
        "profileName"
    ).textContent = name;


    document.getElementById(
        "profileEmail"
    ).textContent =
        user.email
        ||
        "student@college.edu";



    /* Avatar */

    document.getElementById(
        "avatar"
    ).textContent =

        name
            .split(/\s+/)
            .map(
                word =>
                    word[0]
            )
            .join("")
            .slice(0, 2)
            .toUpperCase();



    /* Reported issues */

    const reported =
        issues.filter(
            issue =>

                issue.reportedBy
                ===
                user.name

                ||

                issue.reportedBy
                ===
                user.email

                ||

                issue.userId
                ===
                user.id
        );



    /* Supported issues */

    const supported =
        issues.filter(
            issue => {

                if (
                    Array.isArray(
                        issue.supportedBy
                    )
                ) {

                    return (

                        issue.supportedBy.includes(
                            user.name
                        )

                        ||

                        issue.supportedBy.includes(
                            user.email
                        )

                        ||

                        issue.supportedBy.includes(
                            user.id
                        )

                    );

                }

                return false;

            }
        );



    /* Comments */

    const comments =
        issues.flatMap(
            issue =>

                (
                    issue.comments
                    ||
                    []
                )
                .map(
                    comment => ({

                        issue:
                            issue.title,

                        text:
                            typeof comment
                            ===
                            "string"

                            ?

                            comment

                            :

                            comment.text,

                        date:
                            typeof comment
                            ===
                            "object"

                            ?

                            comment.date

                            :

                            null

                    })
                )

        ).filter(
            comment =>
                comment.text
        );



    /* Statistics */

    document.getElementById(
        "profileStats"
    ).innerHTML = [

        statCard(
            "Reported",
            reported.length,
            "Issues you submitted"
        ),

        statCard(
            "Supported",
            supported.length,
            "Issues you backed"
        ),

        statCard(
            "Comments",
            comments.length,
            "Comments added"
        )

    ].join("");



    /* Lists */

    document.getElementById(
        "reportedIssues"
    ).innerHTML =
        listIssues(reported);


    document.getElementById(
        "supportedIssues"
    ).innerHTML =
        listIssues(supported);



    /* Comments */

    document.getElementById(
        "recentComments"
    ).innerHTML =

        comments.length

        ?

        comments
            .slice(-8)
            .reverse()
            .map(
                comment => `

                <div class="activity-item">

                    <strong>
                        ${esc(
                            comment.issue
                        )}
                    </strong>

                    <p>
                        ${esc(
                            comment.text
                        )}
                    </p>

                    ${
                        comment.date
                        ?

                        `<small>
                            ${esc(
                                comment.date
                            )}
                        </small>`

                        :

                        ""
                    }

                </div>

            `
            )
            .join("")

        :

        `
            <p class="empty">
                No comments yet.
            </p>
        `;

}



/* =========================
   LIST ISSUES
========================= */

function listIssues(items) {

    if (!items.length) {

        return `
            <p class="empty">
                Nothing here yet.
            </p>
        `;

    }


    return items
        .map(
            issue => `

            <div class="activity-item">

                <strong>
                    ${esc(issue.title)}
                </strong>

                <p>

                    ${esc(
                        issue.category
                        ||
                        "General"
                    )}

                    ·

                    ${esc(
                        issue.location
                        ||
                        "Campus"
                    )}

                </p>

                <small>

                    ${Number(
                        issue.supporters
                        ||
                        0
                    )}

                    supporters

                    ·

                    ${esc(
                        issue.status
                        ||
                        "Active"
                    )}

                </small>

            </div>

        `
        )
        .join("");

}



/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderReports();

        renderMonthly();

        renderProfile();

    }
);