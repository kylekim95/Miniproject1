
function addLine(){
  let lineElement = document.createElement("hr");
  return lineElement;
}

function addList(){
  let ulElement = document.createElement("ul");
  let liElement = document.createElement("li");
  ulElement.appendChild(liElement);
  return ulElement;
}

export default {
  '.*---$' : addLine,
  'asdfasdfasdf' : addList,
}