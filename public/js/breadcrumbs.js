function FindPath(current, target) {
  if(current.id == target) return [ current ];
  if(!current.documents) return [];
  let results = [];
  current.documents.some(e => {
    let temp = FindPath(e, target);
    if(temp.length > 0){
      results.push(...temp);
      return true;
    }
  });
  if(results.length > 0) results.unshift(current);
  return results;
}

async function render(data) {
  //TODO: Switch to custom Network API
  const response = await fetch(`http://localhost:3002/documents`);
  const responseJson = await response.json();
  let fakeRoot = { id: -1, documents: responseJson, title: "Home" };
  let traverse = FindPath(fakeRoot, data.id);
  
  let header = `<nav aria-label="breadcrumb"> <ol class="breadcrumb breadcrumb-chevron p-3 rounded-3">`;
  let footer = `</ol> </nav>`;
  let content = ``;
  traverse.slice(0, -1).forEach((e)=>{
    content += `<li class="breadcrumb-item">
                  <div class="pe-auto" onclick="location='${(e.id === -1 ? '/' : '/app/'+e.id)}'">${e.title}</div>
                </li>`;
  });
  content += `<li class="breadcrumb-item active fw-bold" aria-current="page">${traverse.at(-1).title}</li>`;
  return header + content + footer;
}

export default render;