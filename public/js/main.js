// main.js
import axiosInstance from "./axiosInstance.js";

async function render(path = "", query) {
  const pathArr = path.split("/");
  const response = await axiosInstance.get(`/documents/${pathArr[2]}`);
  let data;
  try {
    data = await response.data;
  } catch (error) {}

  if (response.status === 200 && data?.id > 0) {
    return body(data);
  } else {
   const response = await axiosInstance.get('/documents');
   const data = await response.data;
   const newId = Number(data[data.length - 1].id) + 1;
   return body({id:newId, title:"새로운 글 제목", content:"내용을 입력 바랍니다."});
  }
}

function body(data) {
  return `
  <div class="flex-shrink-1" >
    <div id="did" class="d-none">${data.id}</div>
    <!-- top menu -->
    <div class="d-flex m-2 align-items-center">
      <div class="me-auto"> document > ${data.title}</div>
      <div id="savingStatus" class="d-none">
        <span class="me-1">저장 중</span>
        <div class="spinner-border spinner-border-md cl" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
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
