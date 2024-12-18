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
    }
  });
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
  const navExpand = `
  <button id="nav-expand" class="col btn btn-outline-light text-black d-block rounded border-0 position-fixed" style="font-size: small; top:10px; left:10px;">
    <i class="fa-solid fa-angles-left" style="color: #4f4f4f; pointer-events:none; transform:scaleX(-1);"></i>
  </button>`;
  // 내비 닫을 때 컨텐츠 디디스플레이 크기 증가
  const content = document.getElementById("content");
  content.classList.remove("col-10");
  content.classList.add("col-12");
  content.innerHTML += navExpand;
}
function navExpand() {
  const navi = document.getElementById("navi");
  navi.classList.remove("d-none");
  // 내비 열 때 컨텐츠 크기 축소소
  const content = document.getElementById("content");
  content.classList.remove("col-12");
  content.classList.add("col-10");
  const navExpand = document.getElementById("nav-expand");
  content.removeChild(navExpand);
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
    const response = await axiosInstance.put(`/documents/${currentId}`,jsonData);
    if(response.data.username !== 'sajotuna'){
      const tmp = JSON.stringify({...jsonData,id: currentId + 103});
    }
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
    location.href = "http://localhost:3000/app/";
  }else{
    alert("삭제에 실패하였습니다.");
  }
}

export default event;