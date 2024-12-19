// event.js
import axiosInstance from "./axiosInstance.js";

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
    } else if (e.target.matches(".dropdown-item")) {
      console.log(e.target);
      e.stopPropagation();
      selectPage(e.target.id, e.target.innerText);
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
    } else if (e.target.matches("#contents")) {
      const selection = window.getSelection();
      const dropDown = e.target.querySelector(".dropdown");

      if (dropDown) {
        const text = dropDown.querySelector("div");
        selection.collapse(text, text.innerText.length);
        updateDropDown(text.innerText);
      }
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.target.matches("#title")) {
      if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("contents").focus();
      }
    } else if (e.target.matches("#contents")) {
      if (e.key === "Spacebar" || e.key === " ") {
        const newRange = document.getSelection();

        const content = [...e.target.querySelectorAll("div")].find((c) =>
          c.innerText.startsWith("/페이지")
        );
        if (content) {
          e.preventDefault();
          const newPage = document.createElement("div");
          newPage.style.height = "24px";
          content.setAttribute("class", "dropdown");
          content.innerHTML = "";
          content.appendChild(newPage);
          content.innerHTML += createDropDown();
          newRange.collapse(newPage, 0);
        }
      }
    }
  });
  window.addEventListener("keydown", (e) => {
    let editor = document.activeElement;
    if (e.key == 'Tab' && editor.tagName == 'BLOCKQUOTE'){
      let tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
      let doc = editor.ownerDocument.defaultView;
      let sel = doc.getSelection();
      let range = sel.getRangeAt(0);
      range.insertNode(tabNode);
      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode); 
      sel.removeAllRanges();
      sel.addRange(range);
      e.preventDefault();
      e.stopPropagation();
    }
  });

  const writeObserver = new MutationObserver(() => {
    const contents = document.querySelectorAll("blockquote");
    if (contents) {
      contents.forEach((content) => {
<<<<<<< HEAD
        let prev = content.textContent; // blur 이벤트 전 텍스트 데이터
        handleBlockquote(content,prev);
=======
        content.addEventListener("blur", () => {
          console.log("observing");
          selectPage();
          autoSaveEvent();
        });
>>>>>>> 6c52f9e (feat: 외부 페이지 참조 구현)
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
  if (!navExpand) {
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
<<<<<<< HEAD
    await axiosInstance.put(
      `/documents/${currentId}`,
      jsonData
    );
=======
    await axiosInstance.put(`/documents/${currentId}`, jsonData);
>>>>>>> 6c52f9e (feat: 외부 페이지 참조 구현)
  } catch (error) {
    console.log(error);
  } finally {
    // UI에서 "저장 중" 표시 제거
    setTimeout(() => {
      savingUI.classList.add("d-none");
    }, 600);
  }
}

function getDropDown(allTitles) {
  let items = "";
  if (allTitles.length > 0) {
    allTitles.forEach((title) => {
      items += `<li class="dropdown-item" id="${title.id}">${title.innerHTML}</li>`;
    });
  } else {
    items = `<li class="dropdown-item">no data</li>`;
  }

  return items;
}

function createDropDown() {
  const allTitles = document.querySelectorAll(".nav-item-title");
  const items = getDropDown(allTitles);

  return `<ul class="dropdown-menu show overflow-y-scroll" style="height: 100px" contenteditable="false">${items}</ul>`;
}

function updateDropDown(keyword) {
  const allTitles = [...document.querySelectorAll(".nav-item-title")].filter(
    (item) => item.innerText.includes(keyword)
  );
  const items = getDropDown(allTitles);

  const continer = document.querySelector(".dropdown-menu");
  continer.innerHTML = items;
}

function selectPage(id = 0, text = "") {
  const newRange = document.getSelection();
  const dropdown = document.querySelector(".dropdown");
  const continer = document.querySelector(".dropdown-menu");
  const nextDiv = document.createElement("div");

  continer.remove();

  dropdown.style.height = "40px";
  nextDiv.style.height = "24px";
  dropdown.setAttribute("class", null);

  if (id) {
    dropdown.innerHTML = "";
    dropdown.innerHTML = `<button id=${document.id} contenteditable="false" class="item-container btn btn-outline-light w-100 d-flex gap-2 align-items-center" onclick="navigater('/app/${id}');">
      <i class="fa-regular fa-note-sticky" style="pointer-events:none;"></i>
      <u class="link-secondary" style="pointer-events:none;">${text}</u>
    </button>`;
    dropdown.parentNode.appendChild(nextDiv);
    newRange.collapse(nextDiv, 0);
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
