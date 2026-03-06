import * as vscode from 'vscode';

let timer: NodeJS.Timeout | undefined;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {

	// Crea icona nella status bar
	statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100
	);
	statusBarItem.text = "💧";
	statusBarItem.command = 'waterReminder.openSettings';
	statusBarItem.show();

	// Comando per aprire le impostazioni
	context.subscriptions.push(
		vscode.commands.registerCommand('waterReminder.openSettings', () => {
			vscode.commands.executeCommand(
				'workbench.action.openSettings',
				'waterReminder'
			);
		})
	);

	// Avvia il timer
	startTimer();

	// Riavvia il timer se cambiano le impostazioni
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('waterReminder')) {
				startTimer();
				updateStatusBar();
			}
		})
	);

	updateStatusBar();
}

function startTimer() {
	if (timer) clearInterval(timer);

	const config = vscode.workspace.getConfiguration('waterReminder');
	const enabled = config.get<boolean>('enabled', true);
	const interval = config.get<number>('intervalMinutes', 30);

	if (!enabled) {
		updateStatusBar();
		return;
	}

	timer = setInterval(() => {
		vscode.window.showInformationMessage(
			'💧 Time to drink water! Stay hydrated!',
			'Thanks! 👍'
		);
	}, interval * 60 * 1000);
}

function updateStatusBar() {
	const config = vscode.workspace.getConfiguration('waterReminder');
	const enabled = config.get<boolean>('enabled', true);
	const interval = config.get<number>('intervalMinutes', 30);

	if (enabled) {
		statusBarItem.text = "💧";
		statusBarItem.tooltip = `Water Reminder — Every ${interval} min`;
		statusBarItem.color = undefined;
	} else {
		statusBarItem.text = "💧";
		statusBarItem.tooltip = "Water Reminder — Disabled";
		statusBarItem.color = new vscode.ThemeColor('statusBar.foreground');
	}
}

export function deactivate() {
	if (timer) clearInterval(timer);
}