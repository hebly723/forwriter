let pluginName = "forwriter";
export const commandIds = {
	hello: "helloWorld",
    counts: "counts",
    begin: "begin"
};

export function getCommand(commandName: string) : string {
    let s = pluginName + '.' + commandName;
    console.log(s);
    return s;
}
