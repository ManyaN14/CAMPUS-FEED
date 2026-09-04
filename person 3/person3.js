const esc3 = value =>
  String(value || "")
    .replace(/[&<>"']/g, match => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[match]));


/* MY REPORTS */

if (document.getElementById("reportStats")) {

  const user =
    CF.getUser();

  const issues =
    CF.getIssues().filter(
      issue =>
        issue.createdBy === user.username ||
        CF.isSupported(issue.id)
    );


  document.getElementById("reportStats").innerHTML = [

    [
      "Your issues",
      CF.getIssues()
        .filter(
          issue =>
            issue.createdBy === user.username
        )
        .length
    ],

    [
      "Supported",
      CF.getIssues()
        .filter(
          issue =>
            CF.isSupported(issue.id)
        )
        .length
    ],

    [
      "Active",
      issues.filter(
        issue =>
          issue.status === "Active"
      ).length
    ],

    [
      "Resolved",
      issues.filter(
        issue =>
          issue.status !== "Active"
      ).length
    ]

  ]
  .map(item => `

    <div class="stat-card">

      <small>
        ${item[0]}
      </small>

      <strong>
        ${item[1]}
      </strong>

    </div>

  `)
  .join("");


  document.getElementById("myRows").innerHTML =
    issues.length

      ? issues.map(issue => `

          <tr>

            <td>

              <b>
                ${esc3(issue.title)}
              </b>

              <br>

              <span class="muted">
                ${issue.location}
              </span>

            </td>

            <td>
              ${issue.category}
            </td>

            <td>
              ♥ ${issue.supports}
            </td>

            <td>

              <span
                class="badge ${
                  issue.status === "Resolved"
                    ? "badge-resolved"
                    : issue.status === "Community Verified"
                      ? "badge-verified"
                      : "badge-active"
                }"
              >
                ${issue.status}
              </span>

            </td>

            <td>

              <a
                class="text-link"
                href="../person2/issue-details.html?id=${issue.id}"
              >
                View
              </a>

            </td>

          </tr>

        `).join("")

      :

      `
        <tr>
          <td colspan="5">
            No activity yet.
          </td>
        </tr>
      `;
}


/* MONTHLY INSIGHTS */

if (document.getElementById("monthlyStats")) {

  const issues =
    CF.getIssues();

  const totalSupport =
    issues.reduce(
      (total, issue) =>
        total + issue.supports,
      0
    );

  const active =
    issues.filter(
      issue =>
        issue.status === "Active"
    ).length;

  const resolved =
    issues.filter(
      issue =>
        issue.status === "Resolved"
    ).length;


  document.getElementById("monthlyStats").innerHTML = [

    ["Total issues", issues.length],

    ["Total support", totalSupport],

    ["Active", active],

    ["Resolved", resolved]

  ]
  .map(item => `

    <div class="stat-card">

      <small>
        ${item[0]}
      </small>

      <strong>
        ${item[1]}
      </strong>

    </div>

  `)
  .join("");


  const counts = {};

  issues.forEach(issue => {

    counts[issue.category] =
      (counts[issue.category] || 0) + 1;

  });


  const max =
    Math.max(...Object.values(counts));


  document.getElementById("categoryBars").innerHTML =
    Object.entries(counts)

      .sort(
        (a, b) =>
          b[1] - a[1]
      )

      .map(([category, count]) => `

        <div style="margin:15px 0">

          <div
            style="
              display:flex;
              justify-content:space-between;
              font-size:13px
            "
          >

            <b>
              ${category}
            </b>

            <span>
              ${count}
            </span>

          </div>

          <div
            style="
              height:9px;
              background:#edf2ef;
              border-radius:99px;
              margin-top:6px
            "
          >

            <div
              style="
                width:${count / max * 100}%;
                height:100%;
                background:#087f45;
                border-radius:99px
              "
            ></div>

          </div>

        </div>

      `)
      .join("");


  const topIssue =
    [...issues].sort(
      (a, b) =>
        b.supports - a.supports
    )[0];


  document.getElementById("topIssue").innerHTML = `

    <h2>
      ${esc3(topIssue.title)}
    </h2>

    <p class="muted">
      ${topIssue.category}
      ·
      ${topIssue.location}
    </p>

    <div class="side-stat">

      <strong>
        ${topIssue.supports}
      </strong>

      <span class="muted">
        students affected
      </span>

    </div>

  `;
}


/* PROFILE */

if (document.getElementById("username")) {

  const user =
    CF.getUser();


  document.getElementById("username").textContent =
    user.username;

  document.getElementById("email").textContent =
    user.email;

  document.getElementById("usernameInput").value =
    user.username;


  document.getElementById("activity").innerHTML = `

    <div class="list-row">

      <span>
        Verified identity
      </span>

      <b>
        ✓
      </b>

    </div>


    <div class="list-row">

      <span>
        Issues supported
      </span>

      <b>
        ${
          CF.getIssues()
            .filter(
              issue =>
                CF.isSupported(issue.id)
            )
            .length
        }
      </b>

    </div>


    <div class="list-row">

      <span>
        Issues reported
      </span>

      <b>
        ${
          CF.getIssues()
            .filter(
              issue =>
                issue.createdBy === user.username
            )
            .length
        }
      </b>

    </div>

  `;


  document.getElementById("saveProfile").onclick =
    function() {

      const username =
        document
          .getElementById("usernameInput")
          .value
          .trim() ||
        "CampusExplorer";

      CF.setUser({
        username
      });

      location.reload();
    };


  document.getElementById("resetDemo").onclick =
    function() {

      if (
        confirm(
          "Reset all local demo data?"
        )
      ) {
        CF.reset();
      }

    };
}