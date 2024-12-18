// event.js
import axiosInstance from "./axiosInstance.js";

const event = () => {
  window.addEventListener("click", (e) => {
    if (e.target.matches("#save")) {
      saveEvent();
    } else if (e.target.matches("#write") || e.target.matches("#write1")) {
      writeEvent();
    } else if (e.target.matches("#delete")) {
      deleteEvent();
    } else if (e.target.matches("#close")) {
      navCollapse();
    } else if (e.target.matches("#nav-expand")) {
      navExpand();
    } else if (e.target.matches("#welcomeContents .list")){
      navigater(`/app/${e.target.dataset.id}`);
    }
  });

  window.addEventListener("input", (e) => {
    if (e.target.matches("#title")) {
      changeTitle(e)
    }
  })

  const writeObserver = new MutationObserver(() => {
    const contents = document.querySelectorAll("blockquote");
    if (contents) {
      contents.forEach((content) => {
        content.addEventListener("blur", () => {
          console.log("observing");
          autoSaveEvent();
        });
      });
    }
  });
  writeObserver.observe(document.body, { childList: true, subtree: true });
};

function navCollapse() {
  const navi = document.getElementById("navi");
  navi.classList.add("d-none");
  const navExpand = document.getElementById("nav-expand");
  navExpand.classList.remove("d-none");
  navExpand.classList.add("d-block");
}
function navExpand() {
  const navi = document.getElementById("navi");
  navi.classList.remove("d-none");
  const navExpand = document.getElementById("nav-expand");
  navExpand.classList.add("d-none");
  navExpand.classList.remove("d-block");
}

function changeTitle(e) {
  const breadcrumbTitle = document.getElementById("breadcrumbTitle");
  const currentId = document.getElementById("did").innerHTML.trim();
  const navTitle = document.getElementById(`${currentId}`);
  const text = document.getElementById("text");
  navTitle.textContent = e.target.textContent;
  breadcrumbTitle.textContent = e.target.textContent;
}

async function autoSaveEvent() {
  const savingUI = document.getElementById('savingStatus');

  // UI에 "저장 중" 표시
  savingUI.classList.remove('d-none');

  const currentId = document.getElementById("did").innerHTML.trim();
  const title = document.getElementById("title").innerHTML.trim();
  const contents = document.getElementById("contents").innerHTML.trim();
  const replaceContents = contents.replaceAll("<div>","").replaceAll("</div>","<br>");
  const jsonData = JSON.stringify({id:currentId,title:title,content:replaceContents});
  try{
    await axiosInstance.put(`/documents/${currentId}`,jsonData);
  } catch (error) {
    console.log(error);
  } finally {
    // UI에서 "저장 중" 표시 제거
    setTimeout(() => {
      savingUI.classList.add('d-none');
    }, 600);
  }
}

function writeEvent() {
  window.addNewNote(null);
}

async function deleteEvent(){
  const deleteId = document.getElementById("did").innerHTML.trim();
  const response = await axiosInstance.delete(`/documents/${deleteId}`);
  const data = response.data;

  if (response.status === 200 && data?.id > 0) {
    alert("삭제 되었습니다.");
    location.href = "http://localhost:3000";
  }else{
    alert("삭제에 실패하였습니다.");
  }
}

export default event;