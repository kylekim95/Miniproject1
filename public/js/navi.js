// navi.js

async function render(path, query) {
  const header = `<div>
        <div class="row">
          <div class="col-7 ">
            <a href="/" class="link-body-emphasis text-decoration-none">
              <i class="fa-solid fa-book me-2"></i>
              <span class="fs-5 fw-semibold">Notepad</span>
            </a>
          </div>
          <div class="col-5 ">
            <button id="write" class="btn btn-outline-light text-black d-block rounded border-0 " style="font-size: small;">
              <i class="fa-sharp fa-regular fa-pen-to-square" style="color: #4f4f4f;"></i>
              쓰기
            </button>
          </div>
        </div>
        <hr>
        <ul class="list-unstyled ps-0" >`;
  const end = `</ul></div>`;

  const response = await fetch(`http://localhost:3001/document/`);
  if(!response.ok){
    return header + end;    
  }
  const data = await response.json();
  
  let body = "";
  data.forEach(e => {
    body += 
    `<div onclick="location='/app/${e.id}'" class="btn btn-outline-light overflow-x-hidden overflow-y-hidden text-black d-block rounded border-0 text-start" style="height: 30px;">
      <i class="fa-regular fa-note-sticky" style="color: #4f4f4f;"></i>
      ${e.title}
    </div>`;
  });
  return header + body + end;
}

export default render;
