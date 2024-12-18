import breadcrumb from "./breadcrumbs.js";

async function render(data){
  let _breadcrumb = await breadcrumb(data);

  return `
  <!-- top menu -->
  <div id="mainHeader" class="container-fluid align-items-center d-flex">
    <button id="nav-expand" class="btn btn-outline-light text-black rounded border-0 " style="font-size: small; display:none;">
      >>
    </button>
    ${_breadcrumb}
    <div id="save" class="btn btn-outline-light text-black ms-auto">
      <i class="fa-regular fa-floppy-disk"></i>
    </div>
    <div id="delete" class="btn btn-outline-light text-black me-1">
      <i class="fa-solid fa-trash"></i>
    </div>
  </div>`;
}

export default render;