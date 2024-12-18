// navi.js
import axiosInstance from "./axiosInstance.js";

window.addNewNote = async function addNewNote(parent) {
  console.log(parent);
  const data = await (
    await fetch(`https://kdt-api.fe.dev-cos.com/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-username": "sajotuna",
      },
      body: JSON.stringify({
        title: "새 문서",
        parent,
      }),
    })
  ).json();

  location = `/app/${data.id}`;
};

function renderMenuList(id, list) {
  let items = "";
  let isOpenCollapse = false;

  list.forEach((e) => {
    const { isOpen, child } = renderMenuList(id, e.documents);
    isOpenCollapse = isOpenCollapse || isOpen || e.id.toString() === id;

    items += `<li onclick="location='/app/${
      e.id
    }'" class="btn btn-outline-light overflow-x-hidden overflow-y-hidden text-black d-block rounded border-0 text-start d-flex justify-content-between" style="height: 30px;">
      <div><span type="button" id="collapse" data-bs-toggle="collapse" data-bs-target='#collapse${
        e.id
      }' aria-controls='collapse${e.id}' onclick="event.stopPropagation();">
        <i class="fa-regular fa-note-sticky" style="color: #4f4f4f;"></i>
      </span>
      ${e.title}
      </div>
      <button class="btn btn-outline-light d-block rounded border-0 p-0" onclick="event.stopPropagation(); addNewNote(${
        e.id
      })" style="font-size: small;">
        <i class="fa-solid fa-plus" style="color: #4f4f4f;"></i>
      </button>
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
            <a href="/" class="link-body-emphasis text-decoration-none">
              <i class="fa-solid fa-book me-2"></i>
              <span class="fs-5 fw-semibold">Notepad</span>
            </a>
          </div>
          <div class="col-4">
            <div class="row">
              <button id="close" class="col btn btn-outline-light text-black d-block rounded border-0 " style="font-size: small;">
                <i class="fa-solid fa-angles-left" style="color: #4f4f4f;"></i>
              </button>
              <button id="write" class="col btn btn-outline-light text-black d-block rounded border-0 " style="font-size: small;">
                <i class="fa-sharp fa-regular fa-pen-to-square" style="color: #4f4f4f;"></i>
              </button>
            </div>
          </div>
          <div class="col-1 ">
            <button id="nav-collapse" class="btn btn-outline-light text-black d-block rounded border-0 " style="font-size: small;">
              <<
            </button>
          </div>
        </div>
        <hr>
        <ul class="list-unstyled ps-0" >`;
  const end = `</ul></div>`;

  const response = await axiosInstance.get('/documents');

  if(response.status !== 200) {
    return header + end;    
  }

  const data = await response.data;
  const body = renderMenuList(path.split("/app/")[1], data).child;
  return header + body + end;
}

export default render;
