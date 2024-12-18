npm init -y

# 의존성 관련 명령
npm i express 
npm i nodemon --save-dev 
npm i cors
npm i ejs 

# package script에 start로 등록 
nodemon test

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon test"
},