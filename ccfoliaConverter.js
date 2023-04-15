function openjson() {
	let url_id = document.getElementById("sheet_id").value;

	let request = new XMLHttpRequest();

	request.open('GET', "https://lhrpg.com/lhz/api/" + url_id + ".json");
	request.responseType = 'json';
	request.send();

	request.onload = function () {
		let data = request.response;
		let tmpdata = JSON.parse(JSON.stringify(data));
		ConvertToCcfolia(tmpdata);
	}
}

function ConvertToCcfolia(currentData) {
	if (currentData == null) {
		alert("無効な入力、もしくは指定されたIDの冒険者は存在しません");
		return;
	}
	let jsonData =
	{
		"kind": "character",
		"data": {
			"name": "",
			"memo": "",
			"initiative": 0,
			"externalUrl": "",
			"status": [],
			"params": [],
			"iconUrl": "",
			"faces": [],
			"x": 0,
			"y": 0,
			"angle": 0,
			"width": 4,
			"height": 0,
			"active": true,
			"secret": false,
			"invisible": false,
			"hideStatus": false,
			"color": "#888888",
			"commands": "",
			"owner": ""
		}
	};


	/* 名稱 name */
	{
		jsonData.data.name = currentData["name"];
	}

	/* 角色備註 memo */
	{
		jsonData.data.memo = currentData["remarks"];
	}

	/* 行動力 initiative */
	{
		jsonData.data.initiative = currentData["action"];
	}

	/* 參考網址 externalUrl */
	{
		var sheetURL = currentData["sheet_url"];
		var splitUrl = sheetURL.toString().split('/');
		var id = splitUrl[splitUrl.length - 1].substr(0, splitUrl[splitUrl.length - 1].length - 5);
		var characterURL = "https://lhrpg.com/lhz/pc?id=".concat(id);

		jsonData.data.externalUrl = characterURL;
	}

	/* 變動屬性 status */
	{
		let statusArray = Array();

		var MaxHp = currentData["max_hitpoint"];
		let HP_status = {
			"label": "HP",
			"value": MaxHp,
			"max": MaxHp
		};
		statusArray.push(HP_status);

		let fatigueStatus = {
			"label": "疲労",
			"value": 0,
			"max": 0
		};
		statusArray.push(fatigueStatus);

		let barrierStatus = {
			"label": "障壁",
			"value": 0,
			"max": 0
		};
		statusArray.push(barrierStatus);

		var fatePoint = currentData["effect"];
		let fateStatus = {
			"label": "因果力",
			"value": fatePoint,
			"max": 0
		};

		statusArray.push(fateStatus);

		jsonData.data.status = statusArray;
	}

	/* 固定屬性 params */
	{
		let paramsArray = Array();

		let keys = ["character_rank/CR","physical_attack/攻撃力","magic_attack/魔力","heal_power/回復力	", "physical_defense/物理防御力", "magic_defense/魔法防御力",
			"str_value/STR", "dex_value/DEX", "pow_value/POW", "int_value/INT"];

		keys.forEach(key => {
			let keyAndLabel = key.split('/');

			let label = keyAndLabel[1];
			let value = currentData[keyAndLabel[0]].toString();

			let params = {
				"label": label,
				"value": value,
			};

			paramsArray.push(params);
		});

		jsonData.data.params = paramsArray;
	}

	/* 角色圖像 iconUrl */
	{

	}

	/* 立繪差分 faces */
	{

	}

	/* x座標 x ※目前無效 */
	{

	}

	/* y座標 y ※目前無效 */
	{

	}

	/* 角度 angle ※因為不好取得，所以保持預設 */
	{

	}

	/* 寬度(圖示大小) width ※檯面上的角色會根據這個數值縮放 */
	{

	}

	/* 高度 height ※會根據角色大小變化 */
	{

	}

	/* 啟用 active ※目前無效 */
	{

	}

	/* 不公開角色狀態 secret */
	{

	}

	/* 發言時不顯示角色立繪 invisible */
	{

	}

	/* 不要在盤面的角色清單中顯示 hideStatus */
	{

	}

	/* 角色顏色 color ※因為不好取得，所以保持預設 */
	{

	}

	/* 常用對話表 commands */
	{
		var commands = "";

		/*命中判定*/
		let hitLabel = "命中判定";
		let value = ConvertToBCDiceCommand(currentData["abl_hit"]);

		let command = value.concat("　").concat(hitLabel).concat('\n');
		commands = commands.concat(command);

		/*防禦判定*/
		let defKeys = ["abl_avoid/回避判定", "abl_resist/抵抗判定"];

		defKeys.forEach(key => {
			let keyAndLabel = key.split('/');
			let value = ConvertToBCDiceCommand(currentData[keyAndLabel[0]]);
			let label = keyAndLabel[1];

			let command1 = value.concat("　").concat(label).concat("(ヘイトトップ)\n");
			let command2 = value.concat("+2　").concat(label).concat("(ヘイトアンダー)\n");

			commands = commands.concat(command1).concat(command2);
		});

		/*技能判定*/
		let keys = ["abl_motion/運動判定", "abl_durability/耐久判定", "abl_dismantle/解除判定", "abl_operate/操作判定",
			"abl_sense/知覚判定", "abl_negotiate/交渉判定", "abl_knowledge/知識判定", "abl_analyze/解析判定"];

		keys.forEach(key => {
			let keyAndLabel = key.split('/');
			let value = ConvertToBCDiceCommand(currentData[keyAndLabel[0]]);
			let label = keyAndLabel[1];

			let command = value.concat("　").concat(label).concat('\n');

			commands = commands.concat(command);
		});

		commands = commands.concat("2LH+{STR}　STR判定\n2LH+{DEX}　DEX判定\n2LH+{POW}　POW判定\n2LH+{INT}　INT判定\n");
		commands = commands.concat("PCT{CR}　体力消耗表\nECT{CR}　気力消耗表\nGCT{CR}　物品消耗表\nCCT{CR}　金銭消耗表\nCTRS{CR}　金銭財宝表\nMTRS{CR}　魔法素材財宝表\nITRS{CR}　換金アイテム財宝表");

		jsonData.data.commands = commands;
	}

	/* 持有者 owner ※空欄 */
	{

	}

	let jsonText = JSON.stringify(jsonData);
	copyToClipboard(jsonText);
}

/* 將輸入的字串複製到剪貼簿上的函式 */
function copyToClipboard(text) {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(text).then(function () {
			alert("キャラシートをクリップボードにコピーしました");
		});
	}
	else {
		alert("出力に失敗しました、クリップボードにアクセスできない");
	}
	return;
}

function ConvertToBCDiceCommand(command) {
	let bcdiceCommand = command;

	/*D轉LH*/
	let diceRegex = /(d|D)/;
	bcdiceCommand = bcdiceCommand.replace(diceRegex, "LH");

	let bcdiceRegex = /^(\d+)(lh|LH)(\+\d+)*$/;
	let result = bcdiceCommand.match(bcdiceRegex);
	if (result != null) {
		return bcdiceCommand;
	}

	/*前後對調*/
	let regex = /^((\d+)(\+))?(\d+)(lh|LH)$/;
	result = bcdiceCommand.match(regex);
	if (result != null) {
		let bcdiceCommand = "";
		let concatIndex = [4, 5, 3, 2];
		concatIndex.forEach(index => {
			if (index < result.length && result[index] != null && result[index] != undefined) {
				bcdiceCommand = bcdiceCommand.concat(result[index]);
			}

		});
		return bcdiceCommand;
	}

	return bcdiceCommand;
}