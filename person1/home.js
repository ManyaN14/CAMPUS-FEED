const feed =
  document.getElementById("feed");

const search =
  document.getElementById("search");

const category =
  document.getElementById("category");

const status =
  document.getElementById("status");


function badge(issue) {

  const categoryClass =
    issue.category === "Safety Hazard"
      ? "badge-safety"
      : "badge-info";

  const statusClass =
    issue.status === "Resolved"
      ? "badge-resolved"
      : issue.status === "Community Verified"
        ? "badge-verified"
        : "badge-active";

  return `
    <span class="badge ${categoryClass}">
      ${issue.category}
    </span>

    <span class="badge ${statusClass}">
      ${issue.status}
    </span>
  `;
}


function render() {

  const q =
    search.value.toLowerCase();

  const cat =
    category.value;

  const st =
    status.value;

  const items =
    CF.getIssues().filter(issue =>

      (
        !q ||
        (
          issue.title +
          issue.location +
          issue.category
        )
        .toLowerCase()
        .includes(q)
      )

      &&

      (!cat || issue.category === cat)

      &&

      (!st || issue.status === st)
    );


  feed.innerHTML =
    items.length

      ? items.map(issue => `

        <article class="issue-card">

          <div class="issue-card-top">

            <div>
              ${badge(issue)}
            </div>

            <span class="muted">
              ${issue.createdAt}
            </span>

          </div>

          <h2 class="issue-title">
            ${issue.title}
          </h2>

          <div class="issue-meta">
            <span>⌖ ${issue.location}</span>
            <span>▣ ${issue.evidence} evidence</span>
          </div>

          <p class="muted">
            ${issue.description}
          </p>

          <div class="card-actions">

            <span class="support-count">
              ♥ ${issue.supports} students affected
            </span>

            <div>

              <button
                class="support-btn ${
                  CF.isSupported(issue.id)
                    ? "supported"
                    : ""
                }"
                data-support="${issue.id}"
              >
                ${
                  CF.isSupported(issue.id)
                    ? "Supported"
                    : "I'm Also Affected"
                }
              </button>

              <a
                class="btn btn-ghost"
                href="../person2/issue-details.html?id=${issue.id}"
              >
                View
              </a>

            </div>

          </div>

        </article>

      `).join("")

      :

      `
        <div
          class="empty"
          style="grid-column:1/-1"
        >
          No issues match your filters.
        </div>
      `;


  document
    .querySelectorAll("[data-support]")
    .forEach(button => {

      button.onclick = () => {

        CF.support(button.dataset.support);

        render();
      };

    });

}


function stats() {

  const issues =
    CF.getIssues();

  document.getElementById("stats").innerHTML = [

    [
      "Active Issues",
      issues.filter(
        i => i.status === "Active"
      ).length
    ],

    [
      "Students Supported",
      issues.reduce(
        (n, i) => n + i.supports,
        0
      )
    ],

    [
      "Community Verified",
      issues.filter(
        i => i.status === "Community Verified"
      ).length
    ],

    [
      "Resolved",
      issues.filter(
        i => i.status === "Resolved"
      ).length
    ]

  ]
  .map(item => `
    <div class="stat-card">
      <small>${item[0]}</small>
      <strong>${item[1]}</strong>
    </div>
  `)
  .join("");
}


[search, category, status]
  .forEach(element => {

    element.oninput = () => {
      render();
      stats();
    };

  });


document.getElementById("navName").textContent =
  CF.getUser().username || "Student";


render();
stats();
