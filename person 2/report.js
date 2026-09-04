const ISSUE_KEY="campusFeedIssues",USER_KEY="campusFeedUser",DRAFT_KEY="campusFeedDraftIssue",SELECTED_KEY="campusFeedSelectedIssue";

const defaultIssues=[
{id:1,title:"Broken Water Cooler – Block C",description:"The water cooler near Block C has been out of service for more than 1 week.",category:"Infrastructure",severity:"Safety Hazard",location:"Block C",supporters:248,status:"active",icon:"🚰",comments:[{username:"Student_22",text:"Water is still not working.",createdAt:"2 days ago"},{username:"Anonymous_101",text:"Same here, even the filter is damaged.",createdAt:"1 day ago"}],evidence:[]},
{id:2,title:"Wi-Fi not working in Library",description:"Students are unable to connect to the Wi-Fi properly inside the library.",category:"Wi-Fi / Technology",severity:"Inconvenience",location:"Library",supporters:173,status:"active",icon:"📶",comments:[],evidence:[]}
];

function getIssues(){try{const s=localStorage.getItem(ISSUE_KEY);if(s)return JSON.parse(s);localStorage.setItem(ISSUE_KEY,JSON.stringify(defaultIssues));return JSON.parse(JSON.stringify(defaultIssues));}catch(e){return JSON.parse(JSON.stringify(defaultIssues));}}
function saveIssues(x){localStorage.setItem(ISSUE_KEY,JSON.stringify(x));}
function getUser(){try{return JSON.parse(localStorage.getItem(USER_KEY)||"null")}catch(e){return null}}
function saveUser(x){localStorage.setItem(USER_KEY,JSON.stringify(x));}
function goHome(){window.location.href="index.html";}

document.addEventListener("DOMContentLoaded",()=>{
 const form=document.getElementById("issueForm");
 if(form){setupPhotoPreview();form.addEventListener("submit",e=>{e.preventDefault();prepareIssueForDuplicateCheck();});}
 if(document.getElementById("issueDetails"))renderIssueDetails();
 if(document.getElementById("commentsList"))renderCommentsPage();
});

let selectedPhotos=[];
function setupPhotoPreview(){
 const input=document.getElementById("photoInput");if(!input)return;
 input.addEventListener("change",()=>{
  selectedPhotos=[];
  Array.from(input.files).slice(0,3).forEach(file=>{
   const r=new FileReader();r.onload=e=>{selectedPhotos.push({name:file.name,data:e.target.result});renderPhotoPreview();};r.readAsDataURL(file);
  });
 });
}
function renderPhotoPreview(){const p=document.getElementById("photoPreview");if(p)p.innerHTML=selectedPhotos.map(x=>`<div class="photo-item"><img src="${x.data}" alt="Evidence photo"></div>`).join("");}

function prepareIssueForDuplicateCheck(){
 const category=document.getElementById("category").value,severity=document.getElementById("severity").value;
 const location=document.getElementById("location").value.trim(),title=document.getElementById("title").value.trim(),description=document.getElementById("description").value.trim();
 const err=document.getElementById("formError");
 if(!category||!severity||!location||!title||!description){err.textContent="Please fill all required fields.";return;}
 const user=getUser();
 localStorage.setItem(DRAFT_KEY,JSON.stringify({title,description,category,severity,location,photos:selectedPhotos,reporterUsername:user?.username||"Anonymous Student",createdAt:new Date().toLocaleString()}));
 window.location.href="duplicate.html";
}

function createNewIssueFromDraft(){
 const draft=JSON.parse(localStorage.getItem(DRAFT_KEY)||"null");if(!draft){alert("No issue draft found.");return;}
 const issues=getIssues(),user=getUser()||{username:"Anonymous Student",supported:[],reported:[],comments:[]};
 const issue={id:Date.now(),title:draft.title,description:draft.description,category:draft.category,severity:draft.severity,location:draft.location,supporters:1,status:"active",icon:getCategoryIcon(draft.category),reporter:user.username||"Anonymous Student",comments:[],evidence:draft.photos||[],createdAt:draft.createdAt};
 issues.push(issue);saveIssues(issues);user.reported=user.reported||[];user.reported.push(issue.id);saveUser(user);localStorage.removeItem(DRAFT_KEY);localStorage.setItem(SELECTED_KEY,String(issue.id));window.location.href="issue-details.html";
}
function getCategoryIcon(c){return{"Infrastructure":"🏗️","Cleanliness":"🧹","Safety":"⚠️","Academic":"📚","Hostel":"🏠","Transport":"🚌","Food":"🍱","Wi-Fi / Technology":"📶","Other":"💡"}[c]||"📌";}

function supportSelectedIssue(){
 const id=Number(localStorage.getItem(SELECTED_KEY)),issues=getIssues(),issue=issues.find(i=>i.id===id);if(!issue)return;
 const user=getUser()||{username:"Anonymous Student",supported:[],reported:[],comments:[]};user.supported=user.supported||[];
 if(user.supported.includes(id)){user.supported=user.supported.filter(x=>x!==id);issue.supporters=Math.max(0,issue.supporters-1);}
 else{user.supported.push(id);issue.supporters++;}
 saveUser(user);saveIssues(issues);renderIssueDetails();
}

function renderIssueDetails(){
 const box=document.getElementById("issueDetails");if(!box)return;
 const id=Number(localStorage.getItem(SELECTED_KEY)),issue=getIssues().find(i=>i.id===id);
 if(!issue){box.innerHTML="<div class='empty-card'><h2>Issue not found</h2><button class='primary-btn' onclick='goHome()'>Go Home</button></div>";return;}
 const user=getUser(),supported=user?.supported?.includes(issue.id),photos=issue.evidence||[];
 box.innerHTML=`<div class="issue-image-large">${issue.icon||"📌"}</div>
 <div class="badges"><span class="badge">${escapeHTML(issue.category)}</span><span class="badge severity">${escapeHTML(issue.severity)}</span><span class="badge ${issue.status==="resolved"?"resolved":"active"}">${issue.status==="resolved"?"Resolved":"Active"}</span></div>
 <h2 class="issue-title">${escapeHTML(issue.title)}</h2><p class="location">📍 ${escapeHTML(issue.location)}</p>
 <div class="reporter">Reported by <strong>${escapeHTML(issue.reporter||"Anonymous")}</strong></div>
 <p class="description">${escapeHTML(issue.description)}</p>
 ${photos.length?`<h3>Evidence</h3><div class="evidence-grid">${photos.map(p=>`<img src="${p.data}" alt="Evidence">`).join("")}</div>`:""}
 <div class="support-box"><div><strong>${issue.supporters}</strong><span>students support this issue</span></div>
 <button class="support-btn ${supported?"supported":""}" onclick="supportSelectedIssue()">${supported?"✓ Supported":"Support this Issue"}</button></div>
 <div class="action-row"><button class="secondary-btn" onclick="openComments(${issue.id})">💬 Comments (${issue.comments?.length||0})</button><button class="secondary-btn" onclick="openComments(${issue.id})">📷 Add Evidence</button></div>`;
}
function openComments(id){localStorage.setItem(SELECTED_KEY,String(id));window.location.href="comments.html";}

function renderCommentsPage(){
 const id=Number(localStorage.getItem(SELECTED_KEY)),issue=getIssues().find(i=>i.id===id),summary=document.getElementById("commentIssueSummary"),list=document.getElementById("commentsList");
 if(!issue){summary.innerHTML="<p>Issue not found.</p>";return;}
 summary.innerHTML=`<div class="summary-icon">${issue.icon||"📌"}</div><div><strong>${escapeHTML(issue.title)}</strong><p>${issue.supporters} supporters</p></div>`;
 const comments=issue.comments||[];
 list.innerHTML=comments.length?comments.map(c=>`<div class="comment"><div class="avatar">♙</div><div class="comment-content"><div class="comment-head"><strong>${escapeHTML(c.username)}</strong><span>${escapeHTML(c.createdAt)}</span></div><p>${escapeHTML(c.text)}</p></div></div>`).join(""):"<div class='empty-comments'>No comments yet. Be the first to share your experience.</div>";
}
function addComment(){
 const input=document.getElementById("commentInput"),text=input.value.trim();if(!text){alert("Please write a comment first.");return;}
 const id=Number(localStorage.getItem(SELECTED_KEY)),issues=getIssues(),issue=issues.find(i=>i.id===id);if(!issue)return;
 issue.comments=issue.comments||[];const user=getUser()||{username:"Anonymous Student",supported:[],reported:[],comments:[]};
 issue.comments.push({username:user.username||"Anonymous Student",text,createdAt:"Just now"});saveIssues(issues);
 user.comments=user.comments||[];user.comments.push({issueId:id,text});saveUser(user);input.value="";renderCommentsPage();
}
function shareIssue(){const id=Number(localStorage.getItem(SELECTED_KEY)),issue=getIssues().find(i=>i.id===id);if(!issue)return;const text=issue.title+" - "+issue.location;if(navigator.share)navigator.share({title:"Campus Feed Issue",text}).catch(()=>{});else{navigator.clipboard?.writeText(text);alert("Issue information copied.");}}
function escapeHTML(x){return String(x??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
