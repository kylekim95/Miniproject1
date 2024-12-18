// event.js

const event = ()=> {
  window.addEventListener("click", e =>{
    if(e.target.matches("#save")){
      saveEvent();
    }
    else if(e.target.matches("#write") || e.target.matches("#write1")){
      writeEvent();
    }
    else if(e.target.matches("#delete")){
      deleteEvent();
    }
    else if(e.target.matches("#close")){
      navCollapse();
    }
    else if(e.target.matches("#nav-expand")){
      navExpand();
    }
  })
  window.addEventListener("mousedown", e =>{
    if(e.target.matches("#nav-list>li")){
      window.addEventListener("mouseup", (dest)=>{
        if(dest.target.matches("#nav-list>li")){
          let child = e.target.dataset.docid;
          let parent = dest.target.dataset.docid;
        }
      }, {once: true});
    }
  });
  const writeObserver = new MutationObserver(()=>{
    const contents = document.querySelectorAll('blockquote');
    if(contents){
      contents.forEach((content)=>{
        content.addEventListener("blur",()=>{
          console.log('observing');
          autoSaveEvent();
        });
      })
    }
  });
  writeObserver.observe(document.body,{childList:true, subtree:true});
}

function navCollapse(){
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
function navExpand(){
  const navi = document.getElementById("navi");
  navi.classList.remove("d-none");
  // 내비 열 때 컨텐츠 크기 축소소
  const content = document.getElementById("content");
  content.classList.remove("col-12");
  content.classList.add("col-10");
  const navExpand = document.getElementById("nav-expand");
  content.removeChild(navExpand);
}

async function saveEvent(){
  const newid = document.getElementById("did").innerHTML.trim();
  const title = document.getElementById("title").innerHTML.trim();
  const contents = document.getElementById("contents").innerHTML.trim();
  const replaceContents = contents.replaceAll("<div>","").replaceAll("</div>","<br>");

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
      body:JSON.stringify({id:newid,title:title,content:replaceContents})
    });

    if(response.ok){
      alert("업데이트 성공!");
      location.href = "http://localhost:3000/app/" + newid;
    }else{
      alert("업데이트에 실패하였습니다.");
    }
  } else {
    // post
    const response = await fetch(`http://localhost:3001/document/`,{
      method:"POST",
      // headers:{"Content-Type": "application/json"},
      body:JSON.stringify({id:newid,title:title,content:replaceContents})
    });
    if(response.ok){
      alert("등록 성공!");
      location.href = "http://localhost:3000/app/" + newid;
    }else{
      alert("등록에 실패하였습니다.");
    }
  }
}

async function autoSaveEvent() {

  const savingUI = document.getElementById('savingStatus');

  // UI에 "저장 중" 표시
  savingUI.classList.remove('d-none');

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
        savingUI.classList.add('d-none');
      }, 600);
    }
  }
  saving();

}

function writeEvent(){
  location.href = "/app/";
}

async function deleteEvent(){
  const deleteId = document.getElementById("did").innerHTML.trim();

  const response = await fetch(`http://localhost:3001/document/${deleteId}`, {
      method: "DELETE",
  });

  if (response.ok){
    alert("삭제 되었습니다.");
    location.href = "http://localhost:3000/app/";
  }else{
    alert("삭제에 실패하였습니다.");
  }
}


export default event;