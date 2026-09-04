/* Shared localStorage data layer for the whole prototype. */

const CF = (() => {

  const KEY = "campus_feed_data_v1";

  const seed = {
    user: {
      email: "student@igdtuw.ac.in",
      username: "CampusExplorer",
      verified: true
    },

    issues: [
      {
        id: "i1",
        title: "Broken Water Cooler — Block C",
        category: "Safety Hazard",
        location: "Block C",
        status: "Active",
        supports: 248,
        description:
          "The water cooler near Block C has been out of service for more than one week. Students are forced to walk to another block for drinking water.",
        createdBy: "Student_22",
        createdAt: "2 days ago",
        evidence: 2
      },

      {
        id: "i2",
        title: "Wi-Fi not working in Library",
        category: "Infrastructure",
        location: "Library",
        status: "Active",
        supports: 63,
        description:
          "Wi-Fi connectivity has been unreliable in the library, especially on the second floor. Online classes and research are affected.",
        createdBy: "Student_08",
        createdAt: "3 days ago",
        evidence: 1
      },

      {
        id: "i3",
        title: "Washroom Hygiene — AC Block",
        category: "Cleanliness",
        location: "AC Block",
        status: "Active",
        supports: 128,
        description:
          "Washrooms on the ground floor need regular cleaning and soap refills.",
        createdBy: "Anonymous",
        createdAt: "1 day ago",
        evidence: 3
      },

      {
        id: "i4",
        title: "Lighting Repair — Parking Area",
        category: "Safety Hazard",
        location: "Parking Area",
        status: "Active",
        supports: 97,
        description:
          "Several lights near the parking entrance are not working after sunset.",
        createdBy: "Student_14",
        createdAt: "5 days ago",
        evidence: 1
      },

      {
        id: "i5",
        title: "Mess Water Supply Restored",
        category: "Water",
        location: "Main Mess",
        status: "Community Verified",
        supports: 84,
        description:
          "The intermittent water supply at the mess has been fixed and verified by students.",
        createdBy: "Anonymous",
        createdAt: "12 days ago",
        evidence: 2
      },

      {
        id: "i6",
        title: "Hostel Lift Repair",
        category: "Hostel",
        location: "Hostel A",
        status: "Resolved",
        supports: 112,
        description:
          "The lift was repaired and is operational again.",
        createdBy: "Student_03",
        createdAt: "18 days ago",
        evidence: 2
      }
    ],

    comments: {
      i1: [
        {
          name: "Student_22",
          text: "Water is still not working.",
          time: "2 days ago"
        },
        {
          name: "Anonymous_101",
          text: "Same here, even the second cooler is damaged.",
          time: "1 day ago"
        },
        {
          name: "CampusBuddy",
          text:
            "I informed the warden. They said a technician is scheduled.",
          time: "1 day ago"
        }
      ],

      i2: [
        {
          name: "Anonymous",
          text:
            "Second floor has almost no signal during afternoons.",
          time: "2 days ago"
        }
      ],

      i3: [
        {
          name: "Student_51",
          text:
            "Soap dispenser was empty this morning.",
          time: "1 day ago"
        }
      ]
    },

    supported: ["i2"],

    reports: []
  };

  function load() {

    let raw = localStorage.getItem(KEY);

    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return structuredClone(seed);
    }

    try {
      return JSON.parse(raw);
    } catch {
      return structuredClone(seed);
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
  }

  function getIssues() {
    return load().issues;
  }

  function getIssue(id) {
    return getIssues().find(x => x.id === id);
  }

  function addIssue(issue) {

    const d = load();

    issue.id = "i" + Date.now();
    issue.supports = 1;

    issue.createdBy =
      d.user.username || "Anonymous";

    issue.createdAt = "just now";
    issue.evidence = 0;
    issue.status = "Active";

    d.issues.unshift(issue);
    d.reports.unshift(issue.id);

    save(d);

    return issue;
  }

  function support(id) {

    const d = load();

    const i =
      d.issues.find(x => x.id === id);

    if (!i) return;

    d.supported = d.supported || [];

    if (d.supported.includes(id)) {

      d.supported =
        d.supported.filter(x => x !== id);

      i.supports =
        Math.max(0, i.supports - 1);

      save(d);

      return false;
    }

    d.supported.push(id);

    i.supports++;

    save(d);

    return true;
  }

  function isSupported(id) {
    return (load().supported || []).includes(id);
  }

  function getComments(id) {
    return load().comments[id] || [];
  }

  function addComment(id, text) {

    const d = load();

    d.comments[id] =
      d.comments[id] || [];

    d.comments[id].push({
      name: "CampusExplorer",
      text,
      time: "just now"
    });

    save(d);
  }

  function setStatus(id, status) {

    const d = load();

    const i =
      d.issues.find(x => x.id === id);

    if (i) {
      i.status = status;
    }

    save(d);
  }

  function setUser(user) {

    const d = load();

    d.user = {
      ...d.user,
      ...user
    };

    save(d);
  }

  function getUser() {
    return load().user;
  }

  function reset() {
    localStorage.removeItem(KEY);
    location.reload();
  }

  return {
    load,
    save,
    getIssues,
    getIssue,
    addIssue,
    support,
    isSupported,
    getComments,
    addComment,
    setStatus,
    setUser,
    getUser,
    reset
  };

})();