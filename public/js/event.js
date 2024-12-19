// event.js
import axiosInstance from "./axiosInstance.js";
import matchPattern from "./matchPattern.js";

const event = () => {
  window.addEventListener("click", (e) => {
    if (e.target.matches("#write") || e.target.matches("#write1")) {
      writeEvent();
    } else if (e.target.matches("#delete")) {
      deleteEvent();
    } else if (e.target.matches("#close")) {
      navCollapse();
    } else if (e.target.matches("#nav-expand")) {
      navExpand();
    } else if (e.target.matches("#welcomeContents .list")) {
      window.navigater(`/app/${e.target.dataset.id}`);
    }
  });

  window.addEventListener("mousedown", (e)=>{
    if(e.target.matches("#resizer")) {
      let left = document.getElementById('navi');
      e.preventDefault();
      e.stopPropagation();
      function mousemoveHandler(e){
        let limit = Math.min(Math.max(e.clientX, 180), 360);
        document.body.style.cursor = 'ew-resize';
        left.style.setProperty('width', `${limit}px`);
        e.preventDefault();
        e.stopPropagation();
      }
      window.addEventListener("mousemove", mousemoveHandler);
      window.addEventListener("mouseup", (e)=>{
        window.removeEventListener("mousemove", mousemoveHandler);
        document.body.style.removeProperty('cursor');
        e.preventDefault();
        e.stopPropagation();
      });
    }
  });

  window.addEventListener("input", (e) => {
    if (e.target.matches("#title")) {
      changeTitle(e);
    }
  });
  window.addEventListener("keydown", (e) => {
    if (e.target.matches("#title")) {
      if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("contents").focus();
      }
    }
  });

  let string = "";
  window.addEventListener("keyup", (e)=>{
    let theRealContent = document.getElementById("theRealContent");
    let focusedElement = document.activeElement;
    if(focusedElement.tagName !== 'BLOCKQUOTE') return;
    string += (e.key);
    for(let [key, values] of Object.entries(matchPattern)){
      if(string.match(key)){
        let createdElement = values();
        theRealContent.appendChild(createdElement);
        focusedElement.innerText = focusedElement.innerText.slice(0, -string.length);
        
        let newBlockQuote = document.createElement("blockquote");
        newBlockQuote.classList.add("p-1", "fw-medium");
        newBlockQuote.setAttribute("contenteditable", "true");
        theRealContent.appendChild(newBlockQuote);

        string = "";
      }
    }
    if(e.key == 'Backspace' || e.key == 'Space' || e.key == 'Enter') string = "";
    if(string.length > 10) string = "";
  });

  const writeObserver = new MutationObserver(() => {
    const contents = document.querySelectorAll("blockquote");
    if (contents) {
      contents.forEach((content) => {
        let prev = content.textContent; // blur 이벤트 전 텍스트 데이터
        handleBlockquote(content,prev);
      });
    }
  });
  writeObserver.observe(document.body, { childList: true, subtree: true });
};

function handleBlockquote (content,prev) {
  // blur 이벤트 리스너를 한번만 등록하도록
  if(!content.dataset.observed){
    content.dataset.observed = 'true';
    content.addEventListener("blur", () => {
      // blur 이벤트 전,후 비교
      if(prev !== content.textContent) {
        prev = content.textContent;
        autoSaveEvent();
      }
    })
  }
}

function navCollapse() {
  const navi = document.getElementById("navi");
  navi.classList.add("d-none");

  let navExpand = document.getElementById("nav-expand");
  if(!navExpand){
    let navExpandHTML = `
      <button id="nav-expand" class="col btn btn-outline-light text-black d-block rounded border-0 position-fixed" style="font-size: small; top:10px; left:10px;">
        <i class="fa-solid fa-angles-left" style="color: #4f4f4f; pointer-events:none; transform:scaleX(-1);"></i>
      </button>`;
    const content = document.getElementById("content");
    content.innerHTML += navExpandHTML;
  }
  navExpand = document.getElementById("nav-expand");
  navExpand.classList.remove("d-none");
}
function navExpand() {
  const navi = document.getElementById("navi");
  navi.classList.remove("d-none");
  const navExpand = document.getElementById("nav-expand");
  navExpand.classList.add("d-none");
}

function changeTitle(e) {
  const breadcrumbTitle = document.getElementById("breadcrumbTitle");
  const currentId = document.getElementById("did").innerHTML.trim();
  const navTitle = document.getElementById(`${currentId}`);
  navTitle.textContent = e.target.textContent;
  breadcrumbTitle.textContent = e.target.textContent;
}

async function autoSaveEvent() {
  const savingUI = document.getElementById("savingStatus");

  // UI에 "저장 중" 표시
  savingUI.classList.remove("d-none");

  const currentId = document.getElementById("did").innerHTML.trim();
  const title = document.getElementById("title").innerHTML.trim();
  const contents = document.getElementById("contents").innerHTML.trim();
  const replaceContents = contents
    .replaceAll("<div>", "")
    .replaceAll("</div>", "<br>");
  const jsonData = JSON.stringify({
    id: currentId,
    title: title,
    content: replaceContents,
  });
  try {
    await axiosInstance.put(
      `/documents/${currentId}`,
      jsonData
    );
  } catch (error) {
    console.log(error);
  } finally {
    // UI에서 "저장 중" 표시 제거
    setTimeout(() => {
      savingUI.classList.add("d-none");
    }, 600);
  }
}

function writeEvent() {
  window.addNewNote(null);
}

async function deleteEvent() {
  const deleteId = document.getElementById("did").innerHTML.trim();
  const response = await axiosInstance.delete(`/documents/${deleteId}`);
  const data = response.data;

  if (response.status === 200 && data?.id > 0) {
    alert("삭제 되었습니다.");
    navigater("/");
  } else {
    alert("삭제에 실패하였습니다.");
  }
}

export default event;
