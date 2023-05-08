'use strict';
game.import('mode', function (lib, game, ui, get, ai, _status) {
	return {
		name: 'connect',
		start: function () {
			"step 0"
			lib.config.mode_config['identity']['double_character'] = true;
			lib.config.mode_config['identity']['connect_double_character'] = true;
			game.showChangeLog();
			"step 1"
			var directstartmode = lib.config.directstartmode;
			ui.create.menu(true);
			var createNode = function () {
				if (event.created) return;
				if (directstartmode && lib.node) {
					ui.exitroom = ui.create.system('退出房间', function () {
						game.saveConfig('directstartmode');
						game.reload();
					}, true);
					game.switchMode(directstartmode);
					return;
				}
				if (lib.node && window.require) {
					ui.startServer = ui.create.system('启动服务器', function (e) {
						e.stopPropagation();
						ui.click.connectMenu();
					}, true);
				}
				event.created = true;

				// 访问密钥
				var textHostName = ui.create.div('', '输入访问密钥');
				textHostName.style.width = '400px';
				textHostName.style.height = '30px';
				textHostName.style.lineHeight = '30px';
				textHostName.style.fontFamily = 'xinwei';
				textHostName.style.fontSize = '30px';
				textHostName.style.padding = '10px';
				textHostName.style.left = 'calc(50% - 200px)';
				textHostName.style.top = 'calc(50% - 320px)';
				textHostName.style.textAlign = 'center';
				ui.window.appendChild(textHostName);
				ui.iptext = textHostName;

				var nodeHostName = ui.create.div('.shadowed');
				nodeHostName.style.width = '400px';
				nodeHostName.style.height = '30px';
				nodeHostName.style.lineHeight = '30px';
				nodeHostName.style.fontFamily = 'xinwei';
				nodeHostName.style.fontSize = '30px';
				nodeHostName.style.padding = '10px';
				nodeHostName.style.left = 'calc(50% - 210px)';
				nodeHostName.style.top = 'calc(50% - 260px)';
				nodeHostName.style.whiteSpace = 'nowrap';
				nodeHostName.innerHTML = lib.config.last_ip || "";
				nodeHostName.contentEditable = true;
				nodeHostName.style.webkitUserSelect = 'text';
				nodeHostName.style.textAlign = 'center';
				ui.window.appendChild(nodeHostName);
				ui.ipnode = nodeHostName;
				nodeHostName.addEventListener('focus',function(e){
					window.getSelection().selectAllChildren(e.target);
				});

				// 用户名
				var textPlayerName = ui.create.div('', '输入用户名');
				textPlayerName.style.width = '400px';
				textPlayerName.style.height = '30px';
				textPlayerName.style.lineHeight = '30px';
				textPlayerName.style.fontFamily = 'xinwei';
				textPlayerName.style.fontSize = '30px';
				textPlayerName.style.padding = '10px';
				textPlayerName.style.left = 'calc(50% - 200px)';
				textPlayerName.style.top = 'calc(50% - 200px)';
				textPlayerName.style.textAlign = 'center';
				ui.window.appendChild(textPlayerName);
				ui.playernametext = textPlayerName;

				var nodePlayerName = ui.create.div('.shadowed');
				nodePlayerName.style.width = '400px';
				nodePlayerName.style.height = '30px';
				nodePlayerName.style.lineHeight = '30px';
				nodePlayerName.style.fontFamily = 'xinwei';
				nodePlayerName.style.fontSize = '30px';
				nodePlayerName.style.padding = '10px';
				nodePlayerName.style.left = 'calc(50% - 210px)';
				nodePlayerName.style.top = 'calc(50% - 140px)';
				nodePlayerName.style.whiteSpace = 'nowrap';
				nodePlayerName.innerHTML = lib.config.last_player_name || "";
				nodePlayerName.contentEditable = true;
				nodePlayerName.style.webkitUserSelect = 'text';
				nodePlayerName.style.textAlign = 'center';
				ui.window.appendChild(nodePlayerName);
				ui.playernamenode = nodePlayerName;
				nodePlayerName.addEventListener('focus',function(e){
					window.getSelection().selectAllChildren(e.target);
				});


				// 密码
				var textPassword = ui.create.div('', '输入密码');
				textPassword.style.width = '400px';
				textPassword.style.height = '30px';
				textPassword.style.lineHeight = '30px';
				textPassword.style.fontFamily = 'xinwei';
				textPassword.style.fontSize = '30px';
				textPassword.style.padding = '10px';
				textPassword.style.left = 'calc(50% - 200px)';
				textPassword.style.top = 'calc(50% - 80px)';
				textPassword.style.textAlign = 'center';
				ui.window.appendChild(textPassword);
				ui.passwordtext = textPassword;

				var nodePassword = ui.create.div('.shadowed');
				nodePassword.style.width = '400px';
				nodePassword.style.height = '30px';
				nodePassword.style.lineHeight = '30px';
				nodePassword.style.fontFamily = 'xinwei';
				nodePassword.style.fontSize = '30px';
				nodePassword.style.padding = '10px';
				nodePassword.style.left = 'calc(50% - 210px)';
				nodePassword.style.top = 'calc(50% - 20px)';
				nodePassword.style.whiteSpace = 'nowrap';
				nodePassword.innerHTML = lib.config.last_password || "";
				nodePassword.contentEditable = true;
				nodePassword.style.webkitUserSelect = 'text';
				nodePassword.style.textAlign = 'center';
				ui.window.appendChild(nodePassword);
				ui.passwordnode = nodePassword;
				nodePassword.addEventListener('focus',function(e){
					window.getSelection().selectAllChildren(e.target);
				});

				// 邮箱
				var textEmail = ui.create.div('', '输入邮箱');
				textEmail.style.width = '400px';
				textEmail.style.height = '30px';
				textEmail.style.lineHeight = '30px';
				textEmail.style.fontFamily = 'xinwei';
				textEmail.style.fontSize = '30px';
				textEmail.style.padding = '10px';
				textEmail.style.left = 'calc(50% - 200px)';
				textEmail.style.top = 'calc(50% + 40px)';
				textEmail.style.textAlign = 'center';
				ui.window.appendChild(textEmail);
				ui.emailtext = textEmail;

				var nodeEmail = ui.create.div('.shadowed');
				nodeEmail.style.width = '400px';
				nodeEmail.style.height = '30px';
				nodeEmail.style.lineHeight = '30px';
				nodeEmail.style.fontFamily = 'xinwei';
				nodeEmail.style.fontSize = '30px';
				nodeEmail.style.padding = '10px';
				nodeEmail.style.left = 'calc(50% - 210px)';
				nodeEmail.style.top = 'calc(50% + 100px)';
				nodeEmail.style.whiteSpace = 'nowrap';
				nodeEmail.innerHTML = lib.config.last_email || "";
				nodeEmail.contentEditable = true;
				nodeEmail.style.webkitUserSelect = 'text';
				nodeEmail.style.textAlign = 'center';
				ui.window.appendChild(nodeEmail);
				ui.emailnode = nodeEmail;
				nodeEmail.addEventListener('focus',function(e){
					window.getSelection().selectAllChildren(e.target);
				});

				var connect = function (e) {
					clearTimeout(event.timeout);

					import('../game/tractor/out/game_scene.js')
						.then((GameScene) => {
							var gameScene = new GameScene.GameScene(nodeHostName.innerHTML, nodePlayerName.innerHTML, nodePassword.innerHTML, nodeEmail.innerHTML);
							gameScene.game = game;
							gameScene.lib = lib;
							gameScene.ui = ui;
							gameScene.get = get;
							gameScene.connect();
						})
						.catch(error => {
							console.log(error);
						});

					if (e) e.preventDefault();
					game.saveConfig('last_ip', nodeHostName.innerHTML);
					game.saveConfig('last_player_name', nodePlayerName.innerHTML);
					game.saveConfig('last_password', nodePassword.innerHTML);
					game.saveConfig('last_email', nodeEmail.innerHTML);
				};

				var button = ui.create.div('.menubutton.highlight.large.pointerdiv', '进入大厅', connect);
				button.style.width = '140px';
				button.style.left = 'calc(50% - 70px)';
				button.style.top = 'calc(50% + 180px)';
				ui.window.appendChild(button);
				ui.ipbutton = button;

				// ui.hall_button=ui.create.system('联机大厅',function(){
				// 	node.innerHTML=get.config('hall_ip')||lib.hallURL;
				// 	connect();
				// },true);
				// if(!get.config('hall_button')){
				// 	ui.hall_button.style.display='none';
				// }
				// ui.recentIP=ui.create.system('最近连接',null,true);
				// var clickLink=function(){
				// 	node.innerHTML=this.innerHTML;
				// 	connect();
				// };
				// lib.setPopped(ui.recentIP,function(){
				// 	if(!lib.config.recentIP.length) return;
				// 	var uiintro=ui.create.dialog('hidden');
				// 	uiintro.listen(function(e){
				// 		e.stopPropagation();
				// 	});
				// 	var list=ui.create.div('.caption');
				// 	for(var i=0;i<lib.config.recentIP.length;i++){
				// 		ui.create.div('.text.textlink',list,clickLink).innerHTML=get.trimip(lib.config.recentIP[i]);
				// 	}
				// 	uiintro.add(list);
				// 	var clear=uiintro.add('<div class="text center">清除</div>');
				// 	clear.style.paddingTop=0;
				// 	clear.style.paddingBottom='3px';
				// 	clear.listen(function(){
				// 		lib.config.recentIP.length=0;
				// 		game.saveConfig('recentIP',[]);
				// 		uiintro.delete();
				// 	});
				// 	return uiintro;
				// },220);
				lib.init.onfree();
			}
			if (window.isNonameServer) {
				game.connect(window.isNonameServerIp || 'localhost');
			}
			else if (lib.config.reconnect_info) {
				// var info = lib.config.reconnect_info;
				// game.onlineID = info[1];
				// game.roomId = info[2];
				// if (typeof game.roomId == 'number') {
				// 	game.roomIdServer = true;
				// }
				// var n = 5;
				// var connect = function () {
				// 	event.textnode.innerHTML = '正在连接...';

				// 	const { GameScene } = require('../game/tractor/src/game_scene');
				// 	var gameScene = new GameScene();
				// 	gameScene.game = game;
				// 	gameScene.lib = lib;
				// 	gameScene.ui = ui;
				// 	gameScene.get = get;

				// 	gameScene.connect(info[0], function (success) {
				// 		if (!success && n--) {
				// 			createNode();
				// 			event.timeout = setTimeout(connect, 1000);
				// 		}
				// 		else {
				// 			event.textnode.innerHTML = '输入联机地址';
				// 		}
				// 	});
				// };
				// event.timeout = setTimeout(connect, 500);
				// _status.createNodeTimeout = setTimeout(createNode, 2000);
			}
			else {
				createNode();
			}
			if (!game.onlineKey) {
				game.onlineKey = localStorage.getItem(lib.configprefix + 'key');
				if (!game.onlineKey) {
					game.onlineKey = get.id();
					localStorage.setItem(lib.configprefix + 'key', game.onlineKey);
				}
			}
			_status.connectDenied = createNode;
			for (var i in lib.element.event) {
				event.parent[i] = lib.element.event[i];
			}
			event.parent.custom = {
				add: {},
				replace: {}
			};
			setTimeout(lib.init.onfree, 1000);
		}
	};
});
