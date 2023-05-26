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
				if (lib.version != lib.config.version || _status.extensionChangeLog) return;

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
				var nodeHostName = document.createElement("INPUT");
				nodeHostName.value = lib.config.last_ip || "";
				nodeHostName.classList.add('tractor-connect-input');
				nodeHostName.style.top = 'calc(16%)';
				nodeHostName.setAttribute("type", "text");
				nodeHostName.setAttribute("placeholder", "访问密钥");
				ui.window.appendChild(nodeHostName);
				ui.ipnode = nodeHostName;

				// 用户名
				var nodePlayerName = document.createElement("INPUT");
				nodePlayerName.value = lib.config.last_player_name || "";
				nodePlayerName.classList.add('tractor-connect-input');
				nodePlayerName.style.top = 'calc(26%)';
				nodePlayerName.setAttribute("type", "text");
				nodePlayerName.setAttribute("maxlength", "10");
				nodePlayerName.setAttribute("placeholder", "用户名-不超过10个字符");
				nodePlayerName.contentEditable = true;
				ui.window.appendChild(nodePlayerName);
				ui.playernamenode = nodePlayerName;


				// 密码
				var nodePassword = document.createElement("INPUT");
				nodePassword.value = lib.config.NickNameOverridePass || lib.config.last_password || "";
				nodePassword.classList.add('tractor-connect-input');
				nodePassword.style.top = 'calc(36%)';
				nodePassword.setAttribute("type", "password");
				nodePassword.setAttribute("placeholder", "密码");
				ui.window.appendChild(nodePassword);
				ui.passwordnode = nodePassword;

				// 邮箱
				// var textEmail = ui.create.div('', '邮箱');
				// textEmail.style.width = '400px';
				// textEmail.style.height = '30px';
				// textEmail.style.lineHeight = '30px';
				// textEmail.style.fontFamily = 'xinwei';
				// textEmail.style.fontSize = '30px';
				// textEmail.style.padding = '10px';
				// textEmail.style.left = 'calc(50% - 200px)';
				// textEmail.style.top = 'calc(56%)';
				// textEmail.style.textAlign = 'center';
				// ui.window.appendChild(textEmail);
				// ui.emailtext = textEmail;

				var nodeEmail = document.createElement("INPUT");
				nodeEmail.value = "";
				nodeEmail.classList.add('tractor-connect-input');
				nodeEmail.style.top = 'calc(46%)';
				nodeEmail.setAttribute("type", "text");
				nodeEmail.setAttribute("placeholder", "邮箱-正常登录时无需填写");
				ui.window.appendChild(nodeEmail);
				ui.emailnode = nodeEmail;

				var connect = function (e) {
					var isEnterHallDisabled = ui.ipbutton.classList.contains('disabled');
					var isEnterHall = e.target.innerText === '进入大厅';
					var isDoReplay = e.target.innerText === '录像回放';
					if (isEnterHall && isEnterHallDisabled) return;

					clearTimeout(event.timeout);
					game.clearConnect();

					if (isEnterHall) {
						var textEmail = ui.create.div('', '连接中...');
						textEmail.style.width = '400px';
						textEmail.style.height = '30px';
						textEmail.style.lineHeight = '30px';
						textEmail.style.fontFamily = 'xinwei';
						textEmail.style.fontSize = '30px';
						textEmail.style.padding = '10px';
						textEmail.style.left = 'calc(50% - 200px)';
						textEmail.style.top = 'calc(56%)';
						textEmail.style.textAlign = 'center';
						ui.window.appendChild(textEmail);
						ui.emailtext = textEmail;
					}

					import('../game/tractor/out/game_scene.js')
						.then((GameScene) => {
							var gameScene = new GameScene.GameScene(isDoReplay, nodeHostName.value, nodePlayerName.value, nodePassword.value, nodeEmail.value, game, lib, ui, get);
						})
						.catch(error => {
							document.body.innerHTML = `<div>!!! 尝试加载页面失败！</div>`
							console.log(error);
						});

					if (e) e.preventDefault();
					game.saveConfig('last_ip', nodeHostName.value);
					game.saveConfig('last_player_name', nodePlayerName.value);
					game.saveConfig('last_password', nodePassword.value);
					game.saveConfig('last_email', nodeEmail.value);
				};

				var button = ui.create.div('.menubutton.highlight.large.pointerdiv.disabled', '进入大厅', connect);
				button.style.left = 'calc(50% - 70px)';
				button.style.top = 'calc(56%)';
				ui.window.appendChild(button);
				ui.ipbutton = button;

				var buttonReplay = ui.create.div('.menubutton.highlight.large.pointerdiv', '录像回放', connect);
				buttonReplay.style.left = 'calc(50% - 70px)';
				buttonReplay.style.top = 'calc(64%)';
				ui.window.appendChild(buttonReplay);
				ui.buttonReplay = buttonReplay;

				updateButtonStatus = function () {
					if (nodeHostName.value && nodePlayerName.value && nodePassword.value && nodeEmail.value) {
						button.innerHTML = "注册用户";
						button.classList.remove('disabled');
					}
					else if (nodeHostName.value && nodePlayerName.value && nodePassword.value && !nodeEmail.value) {
						button.innerHTML = "进入大厅";
						button.classList.remove('disabled');
					}
					else if (nodeHostName.value && nodePlayerName.value && !nodePassword.value && nodeEmail.value) {
						button.innerHTML = "找回密码";
						button.classList.remove('disabled');
					}
					else if (nodeHostName.value && !nodePlayerName.value && !nodePassword.value && nodeEmail.value) {
						button.innerHTML = "找回用户";
						button.classList.remove('disabled');
					}
					else {
						button.innerHTML = "进入大厅";
						if (!button.classList.contains('disabled')) button.classList.add('disabled');
					}
				}
				updateButtonStatus();

				nodeHostName.addEventListener('keyup', function (e) {
					updateButtonStatus();
					if (e.keyCode == 13) {
						connect(e);
					}
				});
				nodePlayerName.addEventListener('keyup', function (e) {
					updateButtonStatus();
					if (e.keyCode == 13) {
						connect(e);
					}
				});
				nodePassword.addEventListener('keyup', function (e) {
					updateButtonStatus();
					if (e.keyCode == 13) {
						connect(e);
					}
				});
				nodeEmail.addEventListener('keyup', function (e) {
					updateButtonStatus();
					if (e.keyCode == 13) {
						connect(e);
					}
				});

				// user notes
				var userNotes = ui.create.div(".userNotes", ui.window);
				userNotes.innerHTML = '初次访问？忘记用户名或密码？<br/>请点击<a href="javascript:void(0)" id="userManualLink">使用手册</a>查看如何注册新用户、找回用户名、密码';
				userNotes.style.fontFamily = 'xinwei';
				userNotes.style.fontSize = '20px';
				userNotes.style.padding = '10px';
				userNotes.style.width = 'calc(100%)';
				userNotes.style.top = 'calc(72%)';
				userNotes.style.textAlign = 'center';
				ui.userNotes = userNotes;

				var nodeUserManualLink = document.getElementById("userManualLink");
				nodeUserManualLink.addEventListener('click', function (e) {
					window.open("https://docs.google.com/document/d/12rgDuEzwhc8OZXU5Whygjwnqqz4xacm0BCqrLF5AsGY/edit?usp=sharing");
				});

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
