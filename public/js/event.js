// event.js

const event = () => {
  window.addEventListener("click", (e) => {
    console.log(e.target);
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

async function saveEvent() {
  const newid = document.getElementById("did").innerHTML.trim();
  const title = document.getElementById("title").innerHTML.trim();
  const contents = document.getElementById("contents").innerHTML.trim();
  const replaceContents = contents
    .replaceAll("<div>", "")
    .replaceAll("</div>", "<br>");

  const response = await fetch(`http://localhost:3001/document/${newid}`);
  let data;
  try {
    data = await response.json();
  } catch (error) {}

  if (response.ok && data?.id > 0) {
    // update
    const response = await fetch(`http://localhost:3001/document/${newid}`, {
      method: "PUT",
      // headers: {"Content-Type": "application/json",},
      body: JSON.stringify({
        id: newid,
        title: title,
        content: replaceContents,
      }),
    });

    if (response.ok) {
      alert("업데이트 성공!");
      location.href = "http://localhost:3000/app/" + newid;
    } else {
      alert("업데이트에 실패하였습니다.");
    }
  } else {
    // post
    const response = await fetch(`http://localhost:3001/document/`, {
      method: "POST",
      // headers:{"Content-Type": "application/json"},
      body: JSON.stringify({
        id: newid,
        title: title,
        content: replaceContents,
      }),
    });
    if (response.ok) {
      alert("등록 성공!");
      location.href = "http://localhost:3000/app/" + newid;
    } else {
      alert("등록에 실패하였습니다.");
    }
  }
}

async function autoSaveEvent() {
  const savingUI = document.getElementById("savingStatus");

  // UI에 "저장 중" 표시
  savingUI.classList.remove("d-none");

  async function saving(id, obj) {
    try {
      console.log("데이터 업데이트");
      // await axios.put(`http://localhost:3001/document/${id}`, obj);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // ID 없으면 post 요청
        // await axios.post(`http://localhost:3001/document`, obj);
        console.log("새 데이터 저장");
      } else {
        console.error("저장 실패:", err);
      }
    } finally {
      // UI에서 "저장 중" 표시 제거
      setTimeout(() => {
        savingUI.classList.add("d-none");
      }, 600);
    }
  }
  saving();
}

function writeEvent() {
  window.addNewNote(null);
}

async function deleteEvent() {
  const deleteId = document.getElementById("did").innerHTML.trim();

  const response = await fetch(`http://localhost:3001/document/${deleteId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("삭제 되었습니다.");
    location.href = "http://localhost:3000/app/";
  } else {
    alert("삭제에 실패하였습니다.");
  }
}

export default event;
