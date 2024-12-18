// welcome.js

async function render(path, query){
  return `<div class="px-4 py-5 my-5 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" height="80" width="80" viewBox="0 0 448 512"><path fill="#74C0FC" d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>
        <h1 class="display-5 fw-bold text-body-emphasis">Notepad App!!</h1>
        <div class="col-lg-6 mx-auto">
          <p class="lead mb-4">간편하게 작성가능한 메모장 어플리케이션입니다.<br> 하루의 일상의 기록을 남기고 저장하세요! 일기장으로도 사용할수 있습니다. 그리고 이건 노션이 아닙니다. 오리지널 노트패드입니다. 노션의 클론코딩 아닙니다. 그냥 참고만하세요.</p>
          <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button id="write1" type="button" class="btn btn-primary btn-lg px-4 gap-3">글쓰기</button>
          </div>
        </div>
      </div>`;
}

export default render;