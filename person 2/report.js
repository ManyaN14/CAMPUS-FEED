const params =
  new URLSearchParams(location.search);

const id = params.get("id");


const esc = value =>
  String(value || "")
    .replace(/[&<>"']/g, match => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[match]));


function similarity(a, b) {

  const words = value =>
    new Set(
      value
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(x => x.length > 2)
    );

  const A = words(a);
  const B = words(b);

  let matches = 0;

  A.forEach(word => {
    if (B.has(word)) {
      matches++;
    }
  });

  return A.size
    ? Math.round(matches / A.size * 100)
    : 0;
}


/* REPORT FORM */

if (document.getElementById("reportForm")) {

  document.getElementById("reportForm").onsubmit =
    function(e) {

      e.preventDefault();

      const draft = {
        title:
          document.getElementById("title").value,

        category:
          document.getElementById("category").value,

        location:
          document.getElementById("location").value,

        description:
          document.getElementById("description").value,

        evidence:
          document.getElementById("evidence").value
      };

      sessionStorage.setItem(
        "cf_draft",
        JSON.stringify(draft)
      );

      location.href = "duplicate.html";
    };
}


/* CREATE NEW ISSUE */

if (document.getElementById("newIssue")) {

  document.getElementById("newIssue").onclick =
    function() {

      const draft =
        JSON.parse(
          sessionStorage.getItem("cf_draft")
        );

      const issue =
        CF.addIssue(draft);

      sessionStorage.removeItem("cf_draft");

      location.href =
        "issue-details.html?id=" + issue.id;
    };
}


/* DUPLICATE CHECK */

if (document.getElementById("duplicateList")) {

  const draft =
    JSON.parse(
      sessionStorage.getItem("cf_draft") || "{}"
    );

  const matches =
    CF.getIssues()
      .map(issue => ({
        ...issue,

        score: Math.max(
          similarity(
            draft.title || "",
            issue.title
          ),

          similarity(
            (draft.location || "") +
            " " +
            (draft.category || ""),

            issue.location +
            " " +
            issue.category
          )
        )
      }))

      .filter(issue => issue.score >= 25)

      .sort((a, b) =>
        b.score - a.score
      )

      .slice(0, 3);


  document.getElementById("duplicateList").innerHTML =
    matches.length

      ? matches.map(issue => `

        <article class="issue-card">

          <div>
            ${issue.category}
            ·
            ${issue.location}
          </div>

          <h2 class="issue-title">
            ${esc(issue.title)}
          </h2>

          <p class="muted">
            ${esc(issue.description)}
          </p>

          <div class="card-actions">

            <span class="support-count">
              ♥ ${issue.supports} affected
            </span>

            <div>

              <button
                class="support-btn ${
                  CF.isSupported(issue.id)
                    ? "supported"
                    : ""
                }"
                data-s="${issue.id}"
              >
                ${
                  CF.isSupported(issue.id)
                    ? "Supported"
                    : "I'm Also Affected"
                }
              </button>

              <a
                class="btn btn-ghost"
                href="issue-details.html?id=${issue.id}"
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
          No close matches found.
          You can create a new issue.
        </div>
      `;


  document
    .querySelectorAll("[data-s]")
    .forEach(button => {

      button.onclick = () => {

        CF.support(button.dataset.s);

        button.classList.toggle("supported");

        button.textContent =
          CF.isSupported(button.dataset.s)
            ? "Supported"
            : "I'm Also Affected";

        location.reload();
      };

    });
}


/* ISSUE DETAILS */

function renderDetail() {

  const element =
    document.getElementById("detail");

  if (!element) return;

  const issue =
    CF.getIssue(id);

  if (!issue) {

    element.innerHTML =
      '<div class="empty">Issue not found.</div>';

    return;
  }


  element.innerHTML = `

    <div class="page-head">

      <div>

        <span class="eyebrow">
          ISSUE DETAILS
        </span>

        <h1>
          ${esc(issue.title)}
        </h1>

        <p class="muted">
          ${issue.category}
          ·
          ${issue.location}
          ·
          reported ${issue.createdAt}
        </p>

      </div>

      <a
        class="btn btn-ghost"
        href="../person1/home.html"
      >
        ← Back to feed
      </a>

    </div>


    <div class="detail-layout">

      <section class="card detail-main">

        <div>

          ${
            issue.status === "Resolved"

              ? `
                <span class="badge badge-resolved">
                  Resolved
                </span>
              `

              : issue.status === "Community Verified"

                ? `
                  <span class="badge badge-verified">
                    Community Verified
                  </span>
                `

                : `
                  <span class="badge badge-active">
                    Active
                  </span>
                `
          }

        </div>


        <p class="description">
          ${esc(issue.description)}
        </p>


        <div class="evidence">

          ${
            Array.from(
              {
                length:
                  Math.max(1, issue.evidence)
              },
              (_, n) => `
                <div>
                  Evidence ${n + 1}
                </div>
              `
            ).join("")
          }

        </div>


        <div class="card-actions">

          <span class="support-count">
            ♥ ${issue.supports} students affected
          </span>

          <button
            id="supportDetail"
            class="support-btn ${
              CF.isSupported(issue.id)
                ? "supported"
                : ""
            }"
          >
            ${
              CF.isSupported(issue.id)
                ? "You're supporting this"
                : "I'm Also Affected"
            }
          </button>

        </div>


        <hr
          style="
            border:0;
            border-top:1px solid #e6ece8;
            margin:22px 0
          "
        >


        <h3>
          Community comments
        </h3>


        <div id="commentList">

          ${
            CF.getComments(issue.id)
              .map(comment => `

                <div class="comment">

                  <strong>
                    ${esc(comment.name)}
                  </strong>

                  <span class="muted">
                    ${comment.time}
                  </span>

                  <p>
                    ${esc(comment.text)}
                  </p>

                </div>

              `)
              .join("")

            ||

            '<p class="muted">No comments yet.</p>'
          }

        </div>


        <form
          id="commentForm"
          style="
            display:flex;
            gap:8px;
            margin-top:15px
          "
        >

          <input
            class="search"
            id="commentInput"
            placeholder="Add a comment anonymously..."
            required
          >

          <button class="btn btn-primary">
            Post
          </button>

        </form>

      </section>


      <aside class="card side-stat">

        <span class="eyebrow">
          COMMUNITY SUPPORT
        </span>

        <strong>
          ${issue.supports}
        </strong>

        <p class="muted">
          students affected
        </p>

        <a
          class="btn btn-secondary"
          style="width:100%"
          href="comments.html?id=${issue.id}"
        >
          Comments & evidence
        </a>


        <div class="timeline">

          <div class="timeline-item">

            <b>Issue reported</b>

            <div class="muted">
              ${issue.createdAt}
            </div>

          </div>


          <div class="timeline-item">

            <b>Community support</b>

            <div class="muted">
              ${issue.supports} students
            </div>

          </div>


          <div class="timeline-item">

            <b>Status</b>

            <div class="muted">
              ${issue.status}
            </div>

          </div>

        </div>

      </aside>

    </div>
  `;


  document.getElementById("supportDetail").onclick =
    function() {

      CF.support(issue.id);

      renderDetail();
    };


  document.getElementById("commentForm").onsubmit =
    function(e) {

      e.preventDefault();

      const input =
        document.getElementById("commentInput");

      CF.addComment(
        issue.id,
        input.value
      );

      renderDetail();
    };
}


/* COMMENTS PAGE */

function renderComments() {

  const element =
    document.getElementById("commentsPage");

  if (!element) return;

  const issue =
    CF.getIssue(id);

  if (!issue) {

    element.innerHTML =
      '<div class="empty">Issue not found.</div>';

    return;
  }


  element.innerHTML = `

    <div class="page-head">

      <div>

        <span class="eyebrow">
          COMMUNITY EVIDENCE
        </span>

        <h1>
          Comments & evidence
        </h1>

        <p class="muted">
          ${esc(issue.title)}
        </p>

      </div>

      <a
        class="btn btn-ghost"
        href="issue-details.html?id=${issue.id}"
      >
        ← Issue details
      </a>

    </div>


    <div class="detail-layout">

      <section class="card">

        <h3>
          Student comments
        </h3>

        ${
          CF.getComments(issue.id)
            .map(comment => `

              <div class="comment">

                <strong>
                  ${esc(comment.name)}
                </strong>

                <span class="muted">
                  · ${comment.time}
                </span>

                <p>
                  ${esc(comment.text)}
                </p>

              </div>

            `)
            .join("")

          ||

          `
            <div class="empty">
              No comments yet.
            </div>
          `
        }

      </section>


      <aside class="card">

        <h3>
          Evidence
        </h3>

        <div class="evidence">

          ${
            Array.from(
              {
                length:
                  Math.max(1, issue.evidence)
              },
              (_, n) => `
                <div>
                  Evidence ${n + 1}
                </div>
              `
            ).join("")
          }

        </div>

      </aside>

    </div>
  `;
}


renderDetail();
renderComments();