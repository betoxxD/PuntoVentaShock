const {app, BrowserWindow} = require('electron');

let appWin, vendedor;

createWindow = () => {
	appWin = new BrowserWindow({
		title: 'Angular and Electron',
		resizable: true,
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
		},
	});

	appWin.loadURL(`file://${__dirname}/dist/index.html`);

	appWin.setMenu(null);

	appWin.maximize();

	appWin.on('closed', () => {
		appWin = null;
	});
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
