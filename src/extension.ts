// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { commandIds, getCommand } from './name';

let charsCountStatusBarItem: vscode.StatusBarItem;
let globalSwitch = false;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "forwriter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(getCommand(commandIds.hello), () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from forwriter!');
	});

	// create a new status bar item that we can now manage
	charsCountStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	charsCountStatusBarItem.command = getCommand(commandIds.counts);
	// subscriptions.push(charsCountStatusBarItem);

	let switchCommand = vscode.commands.registerCommand(getCommand(commandIds.begin), changeSwitch);

	let countChars = vscode.commands.registerCommand(getCommand(commandIds.counts), ()=>{
		const n = getTextCounts(vscode.window.activeTextEditor);
		vscode.window.showInformationMessage(`厉害啊, 你已经写了 ${n} 字了，加油啊！`);
	});

	context.subscriptions.push(disposable, charsCountStatusBarItem,
	countChars,
	vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem),
	vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));
	updateStatusBarItem();
}

function updateStatusBarItem(): void {
	if (!globalSwitch) {
		charsCountStatusBarItem.hide();
		return;
	}
	let n = getTextCounts(vscode.window.activeTextEditor);
	charsCountStatusBarItem.text = `$(notebook-render-output) ${n} 字`;
	charsCountStatusBarItem.show();
}

function getTextCounts(editor: vscode.TextEditor | undefined): number {
	let lines = 0;
	if (editor) {
		lines = getWordCount(editor.document);
	}
	return lines;
}

function changeSwitch(): void {
	globalSwitch = !globalSwitch;
	updateStatusBarItem();
}

// 统计函数
function getWordCount(doc: vscode.TextDocument): number {
	// 当前编辑内容
	const docContent: string = doc.getText();
	const filterStr: string = docContent.replace(/\r\n/g, "\n");
	// 中文字数
	const chineseTotal: Array<string> = filterStr.match(/[\u4e00-\u9fa5]/g) || [];
	// 匹配单字字符
	const englishTotal: Array<string> = filterStr.match(/\b\w+\b/g) || [];
	// 匹配数字
	const letterTotal: Array<string> = filterStr.match(/\b\d+\b/g) || [];
	return (chineseTotal.length + englishTotal.length) || 0;
	// return filterStr.length;
}

// this method is called when your extension is deactivated
export function deactivate() {}
