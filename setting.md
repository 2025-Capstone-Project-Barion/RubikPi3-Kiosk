# 🚀 Kiosk 환경 설정 가이드

<키오스크 프로젝트의 환경 설정 간단 정리>



## 1️⃣ Node.js & npm 설치

Node.js를 설치하여 프로젝트의 종속성을 관리합니다.

```sh
NODE_VERSION=18
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
sudo apt install -y nodejs
```

------



## 2️⃣ 프로젝트 종속성 설치

리액트 프로젝트는 GitHub에서 클론한 후, `npm install`을 실행하여 필요한 패키지를 설치합니다.

```sh
npm install
```

------



## 3️⃣ Electron 설치

Electron을 **개발 환경에서만** 사용할 것이므로, `--save-dev` 옵션을 사용하여 `devDependencies`에 추가합니다.

```sh
npm install --save-dev electron
```

> 📌 **Note:** Electron은 실제 배포 시 패키징되어 포함되므로, `dependencies`에 추가할 필요가 없음!

------



## 4️⃣ 개발 모드 실행 (Dev Mode)

`npm start`를 실행하면 React와 Electron이 함께 실행됩니다.

```sh
npm start
```

> React 앱이 먼저 실행되고, Electron이 이를 로드하는 방식입니다.

------



## 5️⃣ 배포 모드 실행 (Build & Package)

### 📍 빌드 과정

1. React 앱을 빌드합니다.
2. Electron을 패키징하여 실행 파일을 생성합니다.

```sh
npm run build && npm run dist
```

> 🔧 아래와 같이 `package.json`에서 `build:dist` 스크립트를 등록하면 더 간편하게 실행할 수 있음. 



```json
"scripts": {
  "build:dist": "npm run build && npm run dist"
}
```

------



## 6️⃣ ⚠️ 실 배포 시 주의할 점

실제 배포된 앱은 `setup.exe`를 통해 설치되므로, `electron-is-dev` 모듈이 문제를 일으킬 수 있습니다.



### 🚨 배포 모드에서 앱이 실행되지 않는 문제

- **문제:** `electron-is-dev`가 `node_modules`에 접근하려 하지만, 배포된 앱에는 모듈 라이브러리가 없습니다.
- **해결책:** `electron-is-dev`를 제거하고, `process.env.NODE_ENV`를 활용합니다.



### ✅ 해결 방법

#### 🔹 변경 전

```json
const isDev = (await import('electron-is-dev')).default;
const startURL = isDev 
  ? 'http://localhost:3000' 
  : `file://${path.join(__dirname, '../build/index.html')}`;
```

#### 🔹 변경 후

```json
const isDev = process.env.NODE_ENV === 'development';
const startURL = isDev 
  ? 'http://localhost:3000' 
  : `file://${path.join(__dirname, '../build/index.html')}`;
```



### ✅ 추가 설정 (Windows / macOS & Linux)

개발 환경에서 `process.env.NODE_ENV` 값을 자동 설정하도록 `package.json`을 수정합니다.

```json
"scripts": {
  "electron:start": "set NODE_ENV=development&& electron .", // Windows
  "electron:start": "export NODE_ENV=development && electron ." // macOS & Linux
}
```

이제 `npm start`를 실행하면 `NODE_ENV=development`가 자동으로 설정되어 문제 없이 개발할 수 있습니다.

------



## 7️⃣ (선택) `wait-on`을 사용한 Electron 실행 순서 보장

Electron은 React가 실행된 후 `localhost:3000`을 로드해야 합니다.
하지만 환경에 따라 React가 늦게 실행될 수 있으므로, `wait-on` 모듈을 사용하여 React 실행을 기다린 후 Electron을 실행할 수도 있습니다.

### 📍 `wait-on` 설치

```sh
npm install --save-dev wait-on
```



### 📍 `package.json` 수정

```json
"scripts": {
  "electron:start": "set NODE_ENV=development&& wait-on http://localhost:3000 && electron ."
}
```

> 🚀 **현재 프로젝트에서는 React가 먼저 실행되므로, `wait-on` 없이도 정상 동작합니다.**
> 하지만 환경이 변경될 경우 `wait-on`을 추가하는 것이 안정적입니다.

------



## 📌 전체과정 요약정리

| **단계**                    | **명령어**                        | **설명**                    |
| --------------------------- | --------------------------------- | --------------------------- |
| **1️⃣ Node.js 설치**          | `sudo apt install -y nodejs`      | Node.js 환경 구축           |
| **2️⃣ 패키지 설치**           | `npm install`                     | 프로젝트 종속성 설치        |
| **3️⃣ Electron 설치**         | `npm install --save-dev electron` | Electron 개발 환경 구성     |
| **4️⃣ 개발 모드 실행**        | `npm start`                       | React & Electron 실행       |
| **5️⃣ 빌드 & 배포**           | `npm run build && npm run dist`   | 실행 파일 패키징            |
| **6️⃣ 배포 시 수정**          | `process.env.NODE_ENV` 사용       | `electron-is-dev` 제거      |
| **7️⃣ 실행 순서 보장 (선택)** | `npm install --save-dev wait-on`  | React 실행 후 Electron 실행 |