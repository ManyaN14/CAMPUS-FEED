// ==========================================
// CAMPUS FEED - PERSON 3
// REPORTS DASHBOARD
// ==========================================


// ------------------------------------------
// LOAD DASHBOARD
// ------------------------------------------

function loadDashboard() {

    const issues = getIssues();


    // --------------------------------------
    // TOTAL ISSUES
    // --------------------------------------

    const totalIssues =
        issues.length;


    // --------------------------------------
    // ACTIVE ISSUES
    // --------------------------------------

    const activeIssues =
        issues.filter(issue => {

            const status =
                String(issue.status || "")
                    .toLowerCase();

            return (
                status === "active" ||
                status === "under review" ||
                status === "open"
            );

        }).length;


    // --------------------------------------
    // RESOLVED ISSUES
    // --------------------------------------

    const resolvedIssues =
        issues.filter(issue => {

            const status =
                String(issue.status || "")
                    .toLowerCase();

            return status === "resolved";

        }).length;


    // --------------------------------------
    // TOTAL SUPPORT
    // --------------------------------------

    const totalSupport =
        issues.reduce((total, issue) => {

            return total +
                Number(issue.supporters || 0);

        }, 0);


    // --------------------------------------
    // DISPLAY STATS
    // --------------------------------------

    document.getElementById("totalIssues")
        .textContent = totalIssues;

    document.getElementById("activeIssues")
        .textContent = activeIssues;

    document.getElementById("resolvedIssues")
        .textContent = resolvedIssues;

    document.getElementById("totalSupport")
        .textContent = totalSupport;


    // --------------------------------------
    // TOP ISSUES
    // --------------------------------------

    displayTopIssues(issues);


    // --------------------------------------
    // CATEGORY STATS
    // --------------------------------------

    displayCategoryStats(issues);
}


// ------------------------------------------
// MOST SUPPORTED ISSUES
// ------------------------------------------

function displayTopIssues(issues) {

    const container =
        document.getElementById("topIssues");

    if (!issues.length) {

        container.innerHTML = `
            <p>No issues reported yet.</p>
        `;

        return;
    }


    const sortedIssues =
        [...issues].sort(
            (a, b) =>
                Number(b.supporters || 0) -
                Number(a.supporters || 0)
        );


    const topIssues =
        sortedIssues.slice(0, 5);


    container.innerHTML =
        topIssues.map(issue => {

            return `

                <div class="report-item">

                    <div>

                        <h3>
                            ${escapeHTML(issue.title)}
                        </h3>

                        <p>
                            ${escapeHTML(
                                issue.category || "Other"
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

            `;

        }).join("");
}


// ------------------------------------------
// CATEGORY STATISTICS
// ------------------------------------------

function displayCategoryStats(issues) {

    const container =
        document.getElementById("categoryStats");


    if (!issues.length) {

        container.innerHTML = `
            <p>No category data available.</p>
        `;

        return;
    }


    const categories = {};


    issues.forEach(issue => {

        const category =
            issue.category || "Other";

        if (!categories[category]) {
            categories[category] = 0;
        }

        categories[category]++;

    });


    const sortedCategories =
        Object.entries(categories)
            .sort((a, b) => b[1] - a[1]);


    const maxValue =
        sortedCategories.length
            ? sortedCategories[0][1]
            : 1;


    container.innerHTML =
        sortedCategories.map(
            ([category, count]) => {

                const percentage =
                    (count / maxValue) * 100;

                return `

                    <div class="category-row">

                        <div class="category-header">

                            <span>
                                ${escapeHTML(category)}
                            </span>

                            <strong>
                                ${count}
                            </strong>

                        </div>

                        <div class="progress">

                            <div
                                class="progress-bar"
                                style="
                                    width: ${percentage}%;
                                ">
                            </div>

                        </div>

                    </div>

                `;

            }
        ).join("");
}


// ------------------------------------------
// SECURITY HELPER
// ------------------------------------------

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ------------------------------------------
// RUN WHEN PAGE LOADS
// ------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);