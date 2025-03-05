const { app, BrowserWindow } = require("electron");
const path = require('path');


// 라즈베리파이 및 rubik pi와 같은 저사양 데스크톱에서의 성능 최적화 환경설정
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-software-rasterizer');

// BrowserWindow 객체는 전역으로 관리함.
// 전역이 아닌 경우 자바스크립트 가비지 컬렉팅 발생 시 의도치 않게 browser window가 닫힐 수 있음 
let mainWindow = null;

async function createWindow() {
    // electron-is-dev 대신 process.env.NODE_ENV를 사용하여 애플리케이션이 개발 모드에서 실행 중인지 배포 모드에서 실행 중인지 동기적으로 개발 모드와 배포 모드를 판단.
    // npm start로 실행할 때는 process.env.NODE_ENV가 'development'로 설정되고, npm run build로 빌드한 후에는 process.env.NODE_ENV가 'production'으로 설정됨.(package.json의 scripts에 설정해두었음)
    const isDev = process.env.NODE_ENV === 'development';

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 1200,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
        },
    });

    mainWindow.loadURL(
        //React App은 DevServer(localhost:3000에서 실행중,,)를 통해 개발된 수정사항만을 즉시 build하고 화면에 적용시키는 Hot Reload 기능이 존재한다.
        //때문에, Develop Mode 에서는 DevServer를 띄우고 Election은 이 DevServer와 URL로 연결하여, 해당 DevServer에서 실행중인 리액트 앱을 일렉트론 앱에 로드하여 일렉트론 개발을 진행하고, 실행파일 배포단계인 Production Mode 일때는 Build한 리액트 프로젝트를 Electron 에 탑재(즉 Electron 앱으로 한번 더 패키징)하여 쉽게 개발하고, 배포할 수 있게 된다.

        //개발 모드일 때는 localhost:3000에서 로드하고, 배포 모드일 때는 빌드된 HTML 파일을 로드.
        //즉, npm start로 실행할 때는 localhost:3000에서 로드하고, npm run build로 빌드한 후에는 빌드된 HTML 파일을 로드.
        // isDev 변수가 true일 때는 개발 모드로 간주하여 http://localhost:3000 URL을 로드하고, false일 때는 배포 모드로 간주하여 빌드된 HTML 파일을 로드

        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    mainWindow.on("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.on("ready", createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});