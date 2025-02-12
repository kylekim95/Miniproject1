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
  })
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