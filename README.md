# Campus Feed - Person 3

Person 3 is responsible for:

- Reports Dashboard
- Monthly Report
- Student Profile
- Activity statistics
- Issue statistics
- Category breakdown

## Files

reports.html
monthly-report.html
profile.html
person3.css
person3.js

## How to Run

Open the Campus Feed project in VS Code.

Install the Live Server extension.

Right-click:

reports.html

and select:

Open with Live Server

You can also test:

monthly-report.html

profile.html

## LocalStorage

No API is used.

The project uses browser localStorage.

Issues:

campusFeedIssues

User:

campusFeedUser

## Person 2 Integration

Person 2 should use the same:

campusFeedIssues

localStorage key.

Then issues created by Person 2 can appear in Person 3's dashboard.

## Recommended Folder Structure

Campus-Feed/

    index.html

    person1/

        home.html
        home.css
        home.js

    person2/

        report.html
        duplicate.html
        issue-details.html
        comments.html
        report.css
        report.js

    person3/

        reports.html
        monthly-report.html
        profile.html
        person3.css
        person3.js
