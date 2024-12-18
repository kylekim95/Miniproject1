// main.js
import breadcrumb from "./breadcrumbs.js";
import mainHeader from "./mainHeader.js";

async function render(path = "", query) {
  const pathArr = path.split("/");
  const response = await fetch(`http://localhost:3001/document/` + pathArr[2]);
  let data;
  try {
    data = await response.json();
  } catch (error) {}

  // console.log(data);

  if (response.ok && data?.id > 0) {
    return await body(data);
  } else {
   const response = await fetch(`http://localhost:3001/document/`);
   const data = await response.json();
   const newId = Number(data[data.length - 1].id) + 1;
   return await body({id:newId, title:"새로운 글 제목", content:"내용을 입력 바랍니다."});
  }
}

async function body(data) {
  let pre_main = `<div class="flex-shrink-1" > <div id="did" class="d-none">${data.id}</div>`;
  let post_main = `
  <div class="m-3 mt-5 ps-5 pe-5" style="overflow-y: auto; height: 100%;">
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
  let header = await mainHeader(data);

  return pre_main + header + post_main;
}

export default render;
