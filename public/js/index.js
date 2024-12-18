// index.js

import event from "./event.js"
import main from "./main.js"
import welcome from "./welcome.js"
import navi from "./navi.js"

const $navi = document.getElementById('navi');
const $content = document.getElementById('content');
const $path = location.pathname;
const $query = location.search;

const routes = [
  { path: '/', component: welcome },
  { path: '/app', component: main },
];

const render = async (path = "", query= "") => {
  // console('path : ', path, ",query : ", query)
  
  $navi.innerHTML = await navi(path, query);

  try {
    const paths = path.split("/");
    const rootPath = "/" + paths[1];
    const component = routes.find(route => rootPath === route.path)?.component;
    if(component == null){
      $content.innerHTML = "Not found!!"
    }else{
      $content.innerHTML = await component(path, query);
    }
  } catch (err) {
     $content.innerHTML = "Not found!!"
    console.error(err);
  }
};

render($path, $query);
event();