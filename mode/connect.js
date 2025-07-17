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

			var storageFileForCardsKey = "storageFileForCards"
			var cardsStyles = ["cardsclassic", "cards", "toolbar"];
			var cardsBounds = [54, 64, 9];
			var totalResourceCount = 0;
			var imageResourceCount = 0;
			for (var i = 0; i < cardsStyles.length; i++) {
				imageResourceCount += (cardsBounds[i] + 1); // zero-based cardsBounds, hence add 1 to account for tile000.png
			}
			totalResourceCount += imageResourceCount;
			ui.storageFileForImages = JSON.parse(localStorage.getItem(storageFileForCardsKey)) || {};
			ui.avatarResourcesChanged = false;
			ui.avatarResources = {};

			ui.audioResources = {
				"liangpai_m_shelie1": ["effect", "liangpai_m_shelie1"],
				"liangpai_f_biyue1": ["effect", "liangpai_f_biyue1"],
				"shuaicuo_m_fankui2": ["effect", "shuaicuo_m_fankui2"],
				"shuaicuo_f_guose2": ["effect", "shuaicuo_f_guose2"],
				"equip1": ["effect", "equip1"],
				"equip2": ["effect", "equip2"],
				"zhu_junlve": ["effect", "zhu_junlve"],
				"zhu_lijian2": ["effect", "zhu_lijian2"],
				"sha": ["effect", "sha"],
				"f_sha": ["effect", "f_sha"],
				"sha_fire": ["effect", "sha_fire"],
				"f_sha_fire": ["effect", "f_sha_fire"],
				"sha_thunder": ["effect", "sha_thunder"],
				"f_sha_thunder": ["effect", "f_sha_thunder"],
				"recover": ["effect", "recover"],
				"draw": ["effect", "draw"],
				"drawx": ["effect", "drawx"],
				"tie": ["effect", "tie"],
				"win": ["effect", "win"],
				"game_start": ["effect", "game_start"],
				"enter_hall_click": ["effect", "enter_hall_click"],
				"enter_room_kongcheng11": ["effect", "enter_room_kongcheng11"],
				"enter_room_kongcheng12": ["effect", "enter_room_kongcheng12"],
				"countdown_8_sec": ["effect", "countdown_8_sec"],
			}
			var audioResourceCount = Object.keys(ui.audioResources).length;
			totalResourceCount += audioResourceCount;
			ui.audioResourceObjects = {};
			var loadedAudioCount = 0;

			var loadResourcesAsync = function () {
				var textLoadingCards = ui.create.div('', '加载卡牌');
				textLoadingCards.style.width = '200px';
				textLoadingCards.style.height = '30px';
				textLoadingCards.style.lineHeight = '30px';
				textLoadingCards.style.fontFamily = 'xinwei';
				textLoadingCards.style.fontSize = '30px';
				textLoadingCards.style.padding = '10px';
				textLoadingCards.style.left = 'calc(43% - 100px)';
				textLoadingCards.style.top = 'calc(0%)';
				textLoadingCards.style.textAlign = 'center';
				textLoadingCards.style.zIndex = 100;
				ui.window.appendChild(textLoadingCards);
				ui.textLoadingCards = textLoadingCards;

				var timerLoadingCards = ui.create.div('.timerbar', ui.window);
				timerLoadingCards.style.left = 'calc(43% - 50px)';
				timerLoadingCards.style.top = 'calc(0% + 50px)';
				timerLoadingCards.style.zIndex = 100;
				var tdivLoadingCards = ui.create.div(timerLoadingCards);
				tdivLoadingCards.style.left = '0px';
				tdivLoadingCards.style.top = '0px';
				var barLoadingCards = ui.create.div(timerLoadingCards);
				barLoadingCards.style.left = '0px';
				barLoadingCards.style.top = '0px';
				barLoadingCards.style.transition = `0s`;
				ui.timerLoadingCards = timerLoadingCards;
				ui.barLoadingCards = barLoadingCards;
				barLoadingCards.style.width = 0;
				ui.refresh(barLoadingCards);

				var tractorCard = ui.create.div('');
				tractorCard.style.width = '90px';
				// tractorCard.style.height = '120px';
				tractorCard.style.left = 'calc(43% - 50px)';
				tractorCard.style.top = 'calc(0% + 70px)';
				tractorCard.style['background-size'] = '100% 100%';
				tractorCard.style['background-repeat'] = 'no-repeat';
				tractorCard.style.zIndex = 100;
				ui.window.appendChild(tractorCard);
				ui.tractorCard = tractorCard;

				loadCardResources(0, 0, 0, tractorCard);

				var textLoadingAudio = ui.create.div('', '加载音效');
				textLoadingAudio.style.width = '200px';
				textLoadingAudio.style.height = '30px';
				textLoadingAudio.style.lineHeight = '30px';
				textLoadingAudio.style.fontFamily = 'xinwei';
				textLoadingAudio.style.fontSize = '30px';
				textLoadingAudio.style.padding = '10px';
				textLoadingAudio.style.left = 'calc(57% - 100px)';
				textLoadingAudio.style.top = 'calc(0%)';
				textLoadingAudio.style.textAlign = 'center';
				textLoadingAudio.style.zIndex = 100;
				ui.window.appendChild(textLoadingAudio);
				ui.textLoadingAudio = textLoadingAudio;

				var timerLoadingAudio = ui.create.div('.timerbar', ui.window);
				timerLoadingAudio.style.left = 'calc(57% - 50px)';
				timerLoadingAudio.style.top = 'calc(0% + 50px)';
				timerLoadingAudio.style.zIndex = 100;
				var tdivLoadingAudio = ui.create.div(timerLoadingAudio);
				tdivLoadingAudio.style.left = '0px';
				tdivLoadingAudio.style.top = '0px';
				var barLoadingAudio = ui.create.div(timerLoadingAudio);
				barLoadingAudio.style.left = '0px';
				barLoadingAudio.style.top = '0px';
				barLoadingAudio.style.transition = `0s`;
				ui.timerLoadingAudio = timerLoadingAudio;
				ui.barLoadingAudio = barLoadingAudio;
				barLoadingAudio.style.width = 0;
				ui.refresh(barLoadingAudio);
			}

			var storeCardToDataURL = function (imageObj, imageStyle, imageIndex) {
				var imgCanvas = document.createElement("canvas"),
					imgContext = imgCanvas.getContext("2d");

				// Make sure canvas is as big as the picture
				imgCanvas.width = imageObj.width;
				imgCanvas.height = imageObj.height;

				// Draw image into canvas element
				imgContext.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);

				// Save image as a data URL
				ui.storageFileForImages[`${imageStyle}${imageIndex}`] = imgCanvas.toDataURL("image/png");
			}

			var loadCardResources = function (styleIndex, cardIndex, loadedCount, tractorCard) {
				if (cardIndex == cardsBounds[styleIndex]) {
					cardIndex = 0;
					styleIndex++;
					if (styleIndex == cardsBounds.length) {
						ui.textLoadingCards.innerText = "加载皮肤";
						ui.barLoadingCards.style.width = `0px`;
						localStorage.setItem(storageFileForCardsKey, JSON.stringify(ui.storageFileForImages));
						loadAvatarResources(tractorCard);
						return;
					}
				}

				if (ui.storageFileForImages[`${cardsStyles[styleIndex]}${cardIndex}`]) {
					loadedCount++;
					ui.barLoadingCards.style.width = `${100 * (loadedCount / imageResourceCount)}px`
					// tractorCard.setBackgroundImage(ui.storageFileForImages[`${cardsStyles[styleIndex]}${cardIndex}`]);
					loadCardResources(styleIndex, cardIndex + 1, loadedCount, tractorCard);
					return;
				}

				imgURL = `image/tractor/${cardsStyles[styleIndex]}/tile0${cardIndex.toString().padStart(2, '0')}.png`;
				var img = new Image();
				img.onload = (e) => {
					loadedCount++;
					ui.barLoadingCards.style.width = `${100 * (loadedCount / imageResourceCount)}px`

					storeCardToDataURL(img, cardsStyles[styleIndex], cardIndex);

					// tractorCard.setBackgroundImage(ui.storageFileForImages[`${cardsStyles[styleIndex]}${cardIndex}`]);
					loadCardResources(styleIndex, cardIndex + 1, loadedCount, tractorCard);
				}
				img.src = imgURL;
			}

			var loadAvatarResources = function (tractorCard) {
				import('../game/tractor/out/idb_helper.js')
					.then((IDBHelperClass) => {
						IDBHelperClass.IDBHelper.InitIDB(() => {
							IDBHelperClass.IDBHelper.ReadAvatarResources((avatarResourcesObj) => {
								ui.avatarResources = avatarResourcesObj || {};

								fetch('image/tractor/skin/skininfo.json')
									.then(response => {
										if (!response.ok) {
											console.error("failed to load image/tractor/skin/skininfo.json!")
										}
										return response.json();
									})
									.then(skinInfo => {
										var skinInfoKeys = Object.getOwnPropertyNames(skinInfo);
										var skinCount = skinInfoKeys.length;
										loadAvatarResourcesWorker(IDBHelperClass.IDBHelper, skinInfo, skinInfoKeys, skinCount, 0, 0, tractorCard);
									})
									.catch(error => {
										console.log("尝试加载skininfo.json失败！");
										console.log(error);
									});
							});
						});
					})
					.catch(error => {
						console.log("尝试加载idb_helper失败！");
						console.log(error);
					});
			}

			var loadAvatarResourcesWorker = function (IDBHelper, skinInfo, skinInfoKeys, skinCount, skinKeyIndex, loadedCount, tractorCard) {
				if (skinKeyIndex == skinCount) {
					ui.textLoadingCards.remove();
					delete ui.textLoadingCards;
					ui.tractorCard.remove();
					delete ui.tractorCard;
					ui.timerLoadingCards.remove();
					delete ui.timerLoadingCards;
					if (ui.avatarResourcesChanged) {
						IDBHelper.CleanupAvatarResources(() => {
							IDBHelper.SaveAvatarResources(ui.avatarResources, () => { });
						});
					}
					return;
				}

				var curSkinInfo = skinInfo[skinInfoKeys[skinKeyIndex]]
				var skinExtention = curSkinInfo.skinType === 0 ? "webp" : "gif";

				if (ui.avatarResources[`${curSkinInfo.skinName}.${skinExtention}`]) {
					loadedCount++;
					ui.barLoadingCards.style.width = `${100 * (loadedCount / skinCount)}px`
					tractorCard.setBackgroundImage(ui.avatarResources[`${curSkinInfo.skinName}.${skinExtention}`]);
					loadAvatarResourcesWorker(IDBHelper, skinInfo, skinInfoKeys, skinCount, skinKeyIndex + 1, loadedCount, tractorCard);
					return;
				}

				ui.avatarResourcesChanged = true;
				var skinURL = `image/tractor/skin/${curSkinInfo.skinName}.${skinExtention}`;
				fetch(skinURL)
					.then(response => response.arrayBuffer())
					.then(buffer => {
						loadedCount++;
						ui.barLoadingCards.style.width = `${100 * (loadedCount / skinCount)}px`

						// Convert the buffer to a Base64 encoded string
						var base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

						// Create the Data URL
						var dataURL = `data:image/gif;base64,${base64}`;
						ui.avatarResources[`${curSkinInfo.skinName}.${skinExtention}`] = dataURL;

						tractorCard.setBackgroundImage(ui.avatarResources[`${curSkinInfo.skinName}.${skinExtention}`]);
						loadAvatarResourcesWorker(IDBHelper, skinInfo, skinInfoKeys, skinCount, skinKeyIndex + 1, loadedCount, tractorCard);
					});
			}

			var loadAudioPool = function () {
				for (const [key, value] of Object.entries(ui.audioResources)) {
					var audioTemp = document.createElement('audio');
					audioTemp.volume = lib.config.volumn_audio / 8;
					audioTemp.src = `${lib.assetURL}audio/${value[0]}/${value[1]}.mp3`;
					audioTemp.onloadeddata = function () {
						loadedAudioCount++;
						ui.barLoadingAudio.style.width = `${100 * (loadedAudioCount / audioResourceCount)}px`

						if (loadedAudioCount === audioResourceCount) {
							ui.textLoadingAudio.remove();
							delete ui.textLoadingAudio;
							ui.timerLoadingAudio.remove();
							delete ui.timerLoadingAudio;
						}
					};
					audioTemp.muted = true;
					audioTemp.currentTime = 0;
					audioTemp.play().catch((e) => { });
					audioTemp.pause();
					audioTemp.muted = false;
					ui.audioResourceObjects[`${value[0]}${value[1]}`] = audioTemp;
				}
			}

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
				nodeHostName.style.display = 'none';
				nodeHostName.style.top = 'calc(16%)';
				nodeHostName.setAttribute("type", "text");
				nodeHostName.setAttribute("placeholder", "访问密钥");
				ui.window.appendChild(nodeHostName);
				ui.ipnode = nodeHostName;

				var nodeEmail = document.createElement("INPUT");
				nodeEmail.value = "";
				nodeEmail.classList.add('tractor-connect-input');
				nodeEmail.style.display = 'none';
				nodeEmail.style.top = 'calc(26%)';
				nodeEmail.setAttribute("type", "text");
				nodeEmail.setAttribute("placeholder", "邮箱");
				ui.window.appendChild(nodeEmail);
				ui.emailnode = nodeEmail;

				// 用户名
				var nodePlayerName = document.createElement("INPUT");
				nodePlayerName.value = lib.config.last_player_name || "";
				nodePlayerName.classList.add('tractor-connect-input');
				nodePlayerName.style.top = 'calc(36%)';
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
				nodePassword.style.top = 'calc(46%)';
				nodePassword.setAttribute("type", "password");
				nodePassword.setAttribute("placeholder", "密码");
				ui.window.appendChild(nodePassword);
				ui.passwordnode = nodePassword;

				var connect = function (e) {
					loadAudioPool();

					var isEnterHallDisabled = ui.ipbutton.classList.contains('disabled');
					var isEnterHall = e.target.innerText === '进入大厅';
					var isDoReplay = e.target.innerText === '录像回放';
					var isRegister = e.target.innerText === '注册用户';
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
							var gameScene = new GameScene.GameScene(isDoReplay, nodeHostName.value.trim(), nodePlayerName.value.trim(), nodePassword.value.trim(), nodeEmail.value.trim(), game, lib, ui, get, _status);
						})
						.catch(error => {
							document.body.innerHTML = `<div>!!! 尝试加载页面失败！</div>`
							console.log(error);
						});

					if (e) e.preventDefault();
					if (!isDoReplay) {
						game.saveConfig('last_ip', nodeHostName.value.trim());
						game.saveConfig('last_player_name', nodePlayerName.value.trim());
						if (!isRegister) {
							game.saveConfig('last_password', nodePassword.value.trim());
						}
						game.saveConfig('last_email', nodeEmail.value.trim());
					}
				};

				var button = ui.create.div('.menubutton.highlight.large.pointerdiv.disabled', '进入大厅', connect);
				button.style.left = 'calc(50% - 70px)';
				button.style.top = 'calc(56%)';
				ui.window.appendChild(button);
				ui.ipbutton = button;

				// var buttonReplay = ui.create.div('.menubutton.highlight.large.pointerdiv', '录像回放', connect);
				// buttonReplay.style.left = 'calc(50% - 70px)';
				// buttonReplay.style.top = 'calc(64%)';
				// ui.window.appendChild(buttonReplay);
				// ui.buttonReplay = buttonReplay;

				// user choices
				var userChoices = ui.create.div(".userChoices", ui.window);
				userChoices.innerHTML = `<a href="javascript:void(0)" id="loginLink">返回首页</a>
											<a href="javascript:void(0)" id="registerLink">注册用户</a>
											<a href="javascript:void(0)" id="findPasswordLink">找回密码</a>
											<a href="javascript:void(0)" id="findUsernameLink">找回用户名</a>
											<a href="javascript:void(0)" id="doReplayLink">录像回放</a>
											<a href="javascript:void(0)" id="inputAccessKeyLink">旧版</a>`;
				userChoices.style.fontSize = '20px';
				userChoices.style.padding = '10px';
				userChoices.style.width = 'calc(100%)';
				userChoices.style.top = 'calc(64%)';
				userChoices.style.textAlign = 'center';
				ui.userChoices = userChoices;
				const links = document.querySelectorAll('.userChoices a');
				links.forEach(link => {
					link.style.color = "white";
				});

				document.getElementById("loginLink").style.display = 'none';

				var specialLinks = ["registerLink", "findPasswordLink", "findUsernameLink"];
				toggleButton = function (eleID) {
					if (specialLinks.includes(eleID)) {
						const links = document.querySelectorAll('.userChoices a');
						links.forEach(link => {
							link.style.display = 'none';
						});
						document.getElementById("loginLink").style.display = 'inline-block';
					} else if (eleID == "loginLink") {
						const links = document.querySelectorAll('.userChoices a');
						links.forEach(link => {
							link.style.display = 'inline-block';
						});
						document.getElementById("loginLink").style.display = 'none';
					}
				}

				displayButton = function (event) {
					nodePassword.setAttribute("placeholder", "密码");
					const id = event.target.id;
					toggleButton(id);
					switch (id) {
						case 'loginLink':
							nodePlayerName.style.display = 'inline-block';
							nodePlayerName.value = lib.config.last_player_name || "";
							nodePassword.style.display = 'inline-block';
							nodePassword.value = lib.config.NickNameOverridePass || lib.config.last_password || "";
							nodeEmail.style.display = 'none';
							nodeEmail.value = '';
							button.innerHTML = "进入大厅";
							break;
						case 'registerLink':
							nodePlayerName.style.display = 'inline-block';
							nodePlayerName.value = '';
							nodePassword.style.display = 'inline-block';
							nodePassword.value = '';
							nodePassword.setAttribute("placeholder", "邀请码");
							nodeEmail.style.display = 'inline-block';
							nodeEmail.value = '';
							button.innerHTML = "注册用户";
							break;
						case 'findPasswordLink':
							nodePlayerName.style.display = 'inline-block';
							nodePlayerName.value = lib.config.last_player_name || "";
							nodePassword.style.display = 'none';
							nodePassword.value = '';
							nodeEmail.style.display = 'inline-block';
							nodeEmail.value = '';
							button.innerHTML = "找回密码";
							break;
						case 'findUsernameLink':
							nodePlayerName.style.display = 'none';
							nodePlayerName.value = '';
							nodePassword.style.display = 'none';
							nodePassword.value = '';
							nodeEmail.style.display = 'inline-block';
							nodeEmail.value = '';
							button.innerHTML = "找回用户名";
							break;
						case 'inputAccessKeyLink':
							if (nodeHostName.style.display === 'none') {
								nodeHostName.style.display = 'inline-block';
								nodeHostName.value = lib.config.last_ip || "";
							} else {
								nodeHostName.style.display = 'none';
							}
							break;
						default:
							console.log('Unknown link clicked');
					}
					updateButtonStatus();
				}

				document.getElementById("loginLink").addEventListener('click', displayButton);
				document.getElementById("registerLink").addEventListener('click', displayButton);
				document.getElementById("findPasswordLink").addEventListener('click', displayButton);
				document.getElementById("findUsernameLink").addEventListener('click', displayButton);
				document.getElementById("doReplayLink").addEventListener('click', connect);
				document.getElementById("inputAccessKeyLink").addEventListener('click', displayButton);

				updateButtonStatus = function () {
					switch (button.innerHTML) {
						case '进入大厅':
							if (!nodePlayerName.value || !nodePassword.value) {
								button.classList.add('disabled');
							} else {
								button.classList.remove('disabled');
							}
							break;
						case '注册用户':
							if (!nodePlayerName.value || !nodePassword.value || !nodeEmail.value) {
								button.classList.add('disabled');
							} else {
								button.classList.remove('disabled');
							}
							break;
						case '找回密码':
							if (!nodePlayerName.value || !nodeEmail.value) {
								button.classList.add('disabled');
							} else {
								button.classList.remove('disabled');
							}
							break;
						case '找回用户名':
							if (!nodeEmail.value) {
								button.classList.add('disabled');
							} else {
								button.classList.remove('disabled');
							}
							break;
						default:
							break;
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
				userNotes.innerHTML = '欢迎来到西村升级小馆！<br/>注册新用户前，请先从管理员处获取一个邀请码';
				userNotes.style.fontFamily = 'xinwei';
				userNotes.style.fontSize = '20px';
				userNotes.style.padding = '10px';
				userNotes.style.width = 'calc(100%)';
				userNotes.style.top = 'calc(72%)';
				userNotes.style.textAlign = 'center';
				ui.userNotes = userNotes;

				// friend websites
				var friendWebsites = ui.create.div(".friendWebsites", ui.window);
				friendWebsites.innerHTML = `友站链接：
				<a href="javascript:void(0)" class="popup-link" id="friendWebsites_newmitbbs" data-address="https://newmitbbs.com">新未名空间<span class="popup-icon">🔗</span></a>
				<a href="javascript:void(0)" class="popup-link" id="friendWebsites_freeblueplanet" data-address="https://www.freeblueplanet.com">自由蓝星<span class="popup-icon">🔗</span></a>
				`;
				friendWebsites.style.fontSize = '20px';
				friendWebsites.style.padding = '10px';
				friendWebsites.style.width = 'calc(100%)';
				friendWebsites.style.top = 'calc(80%)';
				friendWebsites.style.textAlign = 'center';
				ui.friendWebsites = friendWebsites;
				let friendWebsitesLinks = document.querySelectorAll('.friendWebsites a');
				friendWebsitesLinks.forEach(link => {
					link.style.color = "white";
				});

				document.querySelectorAll('.popup-link').forEach(link => {
					link.addEventListener('click', function (event) {
						event.preventDefault();
						const address = this.dataset.address;
						window.open(address, '_blank');
					});
				});

				// var nodeUserManualLink = document.getElementById("userManualLink");
				// nodeUserManualLink.addEventListener('click', function (e) {
				// 	window.open("https://docs.google.com/document/d/12rgDuEzwhc8OZXU5Whygjwnqqz4xacm0BCqrLF5AsGY/edit?usp=sharing");
				// });

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
				loadResourcesAsync();
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
