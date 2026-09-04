// ==========================================
// CAMPUS FEED - SHARED STORAGE
// Person 3 owns this file
// ==========================================

const ISSUE_KEY = "campusFeedIssues";
const USER_KEY = "campusFeedUser";

// ------------------------------------------
// GET ALL ISSUES
// ------------------------------------------

function getIssues() {
    try {
        const data = localStorage.getItem(ISSUE_KEY);

        if (!data) {
            return [];
        }

        return JSON.parse(data);

    } catch (error) {
        console.error("Error loading issues:", error);
        return [];
    }
}


// ------------------------------------------
// SAVE ALL ISSUES
// ------------------------------------------

function saveIssues(issues) {
    localStorage.setItem(
        ISSUE_KEY,
        JSON.stringify(issues)
    );
}


// ------------------------------------------
// ADD NEW ISSUE
// ------------------------------------------

function addIssue(issue) {

    const issues = getIssues();

    issues.push(issue);

    saveIssues(issues);

    return issue;
}


// ------------------------------------------
// GET ISSUE BY ID
// ------------------------------------------

function getIssueById(id) {

    const issues = getIssues();

    return issues.find(
        issue => String(issue.id) === String(id)
    );
}


// ------------------------------------------
// UPDATE ISSUE
// ------------------------------------------

function updateIssue(id, updates) {

    const issues = getIssues();

    const index = issues.findIndex(
        issue => String(issue.id) === String(id)
    );

    if (index === -1) {
        return false;
    }

    issues[index] = {
        ...issues[index],
        ...updates
    };

    saveIssues(issues);

    return true;
}


// ------------------------------------------
// SUPPORT AN ISSUE
// ------------------------------------------

function supportIssue(id) {

    const issues = getIssues();

    const index = issues.findIndex(
        issue => String(issue.id) === String(id)
    );

    if (index === -1) {
        return false;
    }

    issues[index].supporters =
        Number(issues[index].supporters || 0) + 1;

    saveIssues(issues);

    return true;
}


// ------------------------------------------
// ADD COMMENT
// ------------------------------------------

function addComment(id, comment) {

    const issues = getIssues();

    const index = issues.findIndex(
        issue => String(issue.id) === String(id)
    );

    if (index === -1) {
        return false;
    }

    if (!Array.isArray(issues[index].comments)) {
        issues[index].comments = [];
    }

    issues[index].comments.push({
        text: comment,
        date: new Date().toLocaleString()
    });

    saveIssues(issues);

    return true;
}


// ------------------------------------------
// GET USER
// ------------------------------------------

function getUser() {

    try {

        const user = localStorage.getItem(USER_KEY);

        if (!user) {

            return {
                name: "Student",
                email: "student@college.edu"
            };

        }

        return JSON.parse(user);

    } catch (error) {

        return {
            name: "Student",
            email: "student@college.edu"
        };

    }
}


// ------------------------------------------
// SAVE USER
// ------------------------------------------

function saveUser(user) {

    localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
    );
}