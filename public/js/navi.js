// navi.js
import axiosInstance from "./axiosInstance.js";

window.addNewNote = async function addNewNote(parent) {
  const response = await axiosInstance.post("/documents", {
    title: "새 문서",
    parent,
  });

  const data = await response.data;

  location = `/app/${data.id}`;
};

window.deleteNote = async function deleteNote(id) {
  const response = await axiosInstance.delete(`/documents/${id}`);

  const data = await response.data;

  location = `/app/${data.parent ? data.parent.id : ""}`;
};

function renderMenuList(id, list) {
  let items = "";
  let isOpenCollapse = false;

  list.forEach((e) => {
    const { isOpen, child } = renderMenuList(id, e.documents);
    isOpenCollapse = isOpenCollapse || isOpen || e.id.toString() === id;

    items += `<li onclick="navigater('/app/${e.id}');"
     class="item-container btn btn-outline-light overflow-x-hidden overflow-y-hidden text-black d-block rounded border-0 text-start d-flex justify-content-between pe-1" style="height: 30px;">
      <div>
        <span type="button" id="collapse" data-bs-toggle="collapse" data-bs-target='#collapse${
          e.id
        }' aria-controls='collapse${e.id}' onclick="event.stopPropagation();">
          <i class="fa-regular fa-note-sticky" style="color: #5f5e5b;"></i>
          <i class="fa-solid fa-chevron-down" style="color: #5f5e5b; width: 14px; font-size: small;"></i>
        </span>
        ${e.title}
      </div>
      <div class="d-flex document-control-btn">
        <button class="btn btn-outline-light d-block rounded border-0 py-0 px-1" onclick="event.stopPropagation(); deleteNote(${
          e.id
        })" style="font-size: small;">
          <i class="fa-regular fa-trash-can" style="color: #5f5e5b;"></i>
        </button>
        <button class="btn btn-outline-light d-block rounded border-0 py-0 px-1" onclick="event.stopPropagation(); addNewNote(${
          e.id
        })" style="font-size: small;">
          <i class="fa-solid fa-plus" style="color: #5f5e5b;"></i>
        </button>
      </div>
    </li>
    <div class="collapse ps-2 ${isOpen ? "show" : ""}" id='collapse${
      e.id
    }'>${child}</div>`;
  });

  return { isOpen: isOpenCollapse, child: items };
}

async function render(path, query) {
  const header = `<div>
        <div class="row">
          <div class="col-8">
            <div class="link-body-emphasis text-decoration-none" onclick="navigater('/');" style="cursor:pointer;">
              <i class="fa-solid fa-book me-2"></i>
              <span class="fs-5 fw-semibold">Notepad</span>
            </div>
          </div>
          <div class="col-4">
            <div class="row">
              <button id="close" class="col btn btn-outline-light text-black d-block rounded border-0 " style="font-size: small;">
                <i class="fa-solid fa-angles-left" style="color: #4f4f4f; pointer-events:none"></i>
              </button>
              <button id="write" class="col btn btn-outline-light text-black d-block rounded border-0 " style="font-size: small;">
                <i class="fa-sharp fa-regular fa-pen-to-square" style="color: #4f4f4f; pointer-events:none"></i>
              </button>
            </div>
          </div>
        </div>
        <hr>
        <ul class="list-unstyled ps-0" >`;
  const end = `</ul></div>`;

  const response = await axiosInstance.get("/documents");

  if (response.status !== 200) {
    return header + end;
  }

  const data = await response.data;
  const body = renderMenuList(path.split("/app/")[1], data).child;
  return header + body + end;
}

export default render;
