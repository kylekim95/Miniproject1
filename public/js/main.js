// main.js

async function render(path = "", query) {
  const pathArr = path.split("/");
  const response = await fetch(`http://localhost:3001/document/` + pathArr[2]);
  let data;
  try {
    data = await response.json();
  } catch (error) {}

  if (response.ok && data?.id > 0) {
    return body(data);
  } else {
   const response = await fetch(`http://localhost:3001/document/`);
   const data = await response.json();
   const newId = Number(data[data.length - 1].id) + 1;
   return body({id:newId, title:"새로운 글 제목", content:"내용을 입력 바랍니다."});
  }
}

function body(data) {
  return `
  <div class="flex-shrink-1" >
    <div id="did" class="d-none">${data.id}</div>
    <!-- top menu -->
    <div class="d-flex m-2">
      <div> document > ${data.title}</div>
      <div id="save" class="btn btn-outline-light text-black ms-auto">
        <i class="fa-regular fa-floppy-disk"></i> 저장
      </div>
      <div id="delete" class="btn btn-outline-light text-black me-1">
        <i class="fa-solid fa-trash"></i> 삭제
      </div>
    </div>
    <div class="m-3 mt-5 ps-5 pe-5" style="overflow-y: auto; height: 100%;"  >
      <!-- 제목 -->
      <div class="mb-3">
        <blockquote id="title" class="h2 p-1 fw-semibold" contenteditable="true">
          ${data.title}
        </blockquote>
      </div>
      <!-- 컨텐츠 -->
      <div>
        <blockquote id="contents"  class="p-1 fw-medium" contenteditable="true">
        ${data.content}
        </blockquote>
      </div>
      </div>
    </div>
   </div>`;
}

export default render;
