const { app, BrowserWindow, Menu, protocol } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");
const Ipc = require("./ipc");
const TouchBar = require("./touch-bar");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: "#F7F7F7",
    minWidth: 880,
    show: false,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + "/preload.js",
    },
    height: 860,
    width: 1280,
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`,
  );

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    } = require("electron-devtools-installer");

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`);
      })
      .catch(err => {
        console.log("An error occurred: ", err);
      });

    installExtension(REDUX_DEVTOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`);
      })
      .catch(err => {
        console.log("An error occurred: ", err);
      });
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
};

const generateMenu = () => {
  const template = [
    {
      label: "File",
      submenu: [{ role: "about" }, { role: "quit" }],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "pasteandmatchstyle" },
        { role: "delete" },
        { role: "selectall" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      role: "window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
    {
      role: "help",
      submenu: [
        {
          click() {
            require("electron").shell.openExternal(
              "https://getstream.io/winds",
            );
          },
          label: "Learn More",
        },
        {
          click() {
            require("electron").shell.openExternal(
              "https://github.com/GetStream/Winds/issues",
            );
          },
          label: "File Issue on GitHub",
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  Ipc.register(mainWindow);
  TouchBar.register(mainWindow);
};

app.on("ready", () => {
  // Monkey patch for loading assets without changing "homepage" into package.json
  // didn't find anything about this on search so....
  protocol.interceptFileProtocol('file', (request, callback) => {
      const url = request.url.substr(7);

      if (url.indexOf("/static/") !== -1) {
        const newPath = `${__dirname}/static/${url.split("/static/")[1]}`;
        callback({ path: newPath });
      } else {
        callback({ path: url });
      }
    }, (err) => {
      if (err) console.error('Failed to register protocol')
    });

  createWindow();
  generateMenu();
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
