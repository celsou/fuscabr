/******************************************
 * FUScaBR - Funções úteis para o ScadaBR
 * Versão 1.0 - Licença: MIT
 ******************************************/

var fuscabr = {};

/******************************************
 *         CRIAÇÃO DE GRÁFICOS 
 * ****************************************/
fuscabr.chart = {};
fuscabr.chart.createdCharts = [];

fuscabr.chart.enabled = true;		// Ativar a criação de gráficos
fuscabr.chart.refreshTime = 250;	// Tempo de atualização (milissegundos)

// Loop principal, para gerenciar os gráficos
fuscabr.chart.loop = function() {
	// Atualizar gráficos já criados
	var cont = fuscabr.chart.createdCharts.length;
	for (var i = 0; i < cont; i++) {
		var err = fuscabr.chart.updateCharts(fuscabr.chart.createdCharts[i]);
		if (err == -1) {
			fuscabr.chart.createdCharts.splice(i, 1);
		}
	}
	
	// Criar novos gráficos, se necessário
	var inputData = document.querySelectorAll("div:not(.fuscabr-chart-container) > div > input.fuscabr-chart-data");
	cont = inputData.length;
	for (var i = 0; i < cont; i++) {
		fuscabr.chart.createNewCharts(inputData[i]);
	}
	
}

// Criar novos gráficos
fuscabr.chart.createNewCharts = function(element) {
	// Criar elementos HTML e obter dados para o gráfico
	var container = element.parentElement.parentElement;
	var conf = JSON.parse(element.value);
	var newCanvas = document.createElement("canvas");
	var newDiv = document.createElement("div");
	
	// Formatação para gráficos baseados em tempo
	var timeOptions = {
		tooltipFormat: "DD/MM/YYYY - HH:mm:ss",
		displayFormats: {
			second: "HH:mm:ss",
			minute: "HH:mm",
			hour: "HH:mm",
			day: "DD/MM",
			month: "MM/YYYY",
			year: "YYYY"
		}
	}
	
	// Adicionar elementos à estrutura da página
	newCanvas.classList.add("fuscabr-chart-canvas");
	newDiv.style = "position: relative; height: " + conf.height + "px; width: " + conf.width + "px;";
	newDiv.appendChild(newCanvas);
	container.appendChild(newDiv);
	container.classList.add("fuscabr-chart-container");
	
	// Criar o gráfico
	var ctx = newCanvas.getContext("2d");
	var chart = new Chart(ctx, {
		type: conf.type,
		data: conf.data
	});
	chart.options.elements.line.tension = 0;
	chart.options.maintainAspectRatio = false;
	
	// Configurar parâmetros do gráfico
	if (conf.beginAtZero == true) {
		chart.options.scales.yAxes[0].ticks.beginAtZero = true;
	}
	if (conf.animations == false) {
		chart.options.animation.duration = 0;
	}
	if (conf.timeBased == true) {
		chart.options.scales.xAxes[0].type = "time";
		chart.options.scales.xAxes[0].time = timeOptions;
	} else {
		chart.options.scales.xAxes[0].ticks.display = false;
		chart.options.scales.xAxes[0].gridLines.drawTicks = false;
	}
	if (conf.showTitle == true) {
		chart.options.title.display = true;
		chart.options.title.text = conf.title;
	}

	// Atualizar gráfico e salvá-lo no array "createdCharts"
	chart.update();
	fuscabr.chart.createdCharts.push(chart);
}

// Atualizar gráficos já criados
fuscabr.chart.updateCharts = function(element) {
	var container = element.canvas.parentElement.parentElement;
	var conf = {};
	// Destruir gráfico se seu script para servidor sumir
	try {
		conf = JSON.parse(container.querySelector(".fuscabr-chart-data").value);
	} catch {
		fuscabr.chart.destroyChart(element);
		return -1;
	}
	
	// Destruir gráfico se o tipo de gráfico mudar (para recriá-lo depois)
	if (element.config.type != conf.type) {
		fuscabr.chart.destroyChart(element)
		return -1;
	}
	
	// Destruir gráfico se mais séries forem adicionadas
	if (element.data.datasets.length != conf.data.datasets.length) {
		fuscabr.chart.destroyChart(element)
		return -1;
	}
	
	// Atualizar altura/largura do gráfico
	element.canvas.parentElement.style.height = conf.height + "px";
	element.canvas.parentElement.style.width = conf.width + "px";
	 
	// Atualizar parâmetros do gráfico
	var changed = false;
	var foo = element.options.scales.yAxes[0].ticks.beginAtZero;
	if (foo != conf.beginAtZero) {
		element.options.scales.yAxes[0].ticks.beginAtZero = conf.beginAtZero;
		changed = true;
	}
	foo = (element.options.animation.duration > 0);
	if (foo != conf.animations) {
		element.options.animation.duration = (conf.animations == true) ? 1000 : 0;
		changed = true;
	}
	foo = element.options.title.display;
	if (foo != conf.showTitle) {
		element.options.title.display = conf.showTitle;
		element.options.title.text = conf.title;
		changed = true;
	}
	
	// Atualizar dados numéricos do gráfico
	var size = conf.data.datasets.length;	
	for (var i = 0; i < size; i++) {
		var chartData = element.data.datasets[i].data;
		var newData = conf.data.datasets[i].data;
		if (JSON.stringify(chartData) != JSON.stringify(newData)) {
			element.data.datasets[i].data = newData;
			changed = true;
		}
		
		chartData = element.data.datasets[i].label;
		newData = conf.data.datasets[i].label;
		if (chartData != newData) {
			element.data.datasets[i].label = newData;
			changed = true;
		}
		
		chartData = element.data.datasets[i].backgroundColor;
		newData = conf.data.datasets[i].backgroundColor;
		if (chartData != newData) {
			element.data.datasets[i].backgroundColor = newData;
			element.data.datasets[i].borderColor = newData;
			changed = true;
		}
		
	}
	
	// Redesenhar gráfico se houver mudanças
	if (changed == true) {
		element.update();
	}
}

// Destruir gráficos quando necessário
fuscabr.chart.destroyChart = function(element) {
	// Obter "pais" do gráfico
	var parent = element.canvas.parentElement;
	var container = parent.parentElement;
	
	// Destruir gráfico e seus "pais"
	container.classList.remove("fuscabr-chart-container");
	element.destroy();
	parent.remove();
}




/******************************************
 *       ALINHAMENTO DE ELEMENTOS
 * ****************************************/
fuscabr.align = {};
fuscabr.align.selectedItems = [];

fuscabr.align.enabled = true;		// Ativar o alinhamento de elementos

/******* Interface Gráfica ******/

// Criar uma interface de usuário (UI) para as funções
// de alinhamento
fuscabr.align.createInterface = function() {
	var gui = document.createElement("div");
	gui.id = "fuscabr-align-container";
	gui.classList.add("borderDiv");
	
	// Injetar código HTML (repensar esta solução...)
	var html = "";
	html += "  <style>";
	html += "    .blcElm {";
	html += "      display: block;";
	html += "      width: 150px;";
	html += "      margin: 4px auto;";
	html += "      text-align: center;";
	html += "    }";
	html += "    .boldElm {";
	html += "		font-weight: bold;";
	html += "		margin-top: 8px;";
	html += "	}";
	html += "    div.inlElm * {";
	html += "      display: inline-block;";
	html += "      margin: 4px auto;";
	html += "    }";
	html += "    #fuscabr-align-container {";
	html += "		text-align: center;";
	html += "		padding: 0px 4px;";
	html += "		margin-left: 5px;";
	html += "	}";
	html += "  </style>";
	html += "  <div>";
	html += "    <p class='blcElm boldElm'>ALINHAR ELEMENTOS</p>";
	html += "    <input type='button' id='fuscabr-align-start-stop' class='blcElm' onclick='fuscabr.align.start()' value='Iniciar alinhamento'>";
	html += "  </div>";
	html += "  <div id='fuscabr-align-controls' style='display: none;'>";
	html += "	<input type='button' class='blcElm' onclick='fuscabr.align.restart()' value='Limpar seleção (S)'>";
	html += "	<p class='blcElm boldElm'>Posição âncora:</p>";
	html += "	<div class='inlElm'>";
	html += "		<p>X:</p>";
	html += "		<input type='number' id='fuscabr-align-x-anchor' style='width: 40px;'>";
	html += "		<p>Y:</p>";
	html += "		<input type='number' id='fuscabr-align-y-anchor' style='width: 40px;'>";
	html += "		<input type='button' value='OK' style='width: 25px;' onclick='fuscabr.align.setAnchorPosition();'>";
	html += "	</div>";
	html += "    <p class='blcElm boldElm'>Opções de alinhamento:</p>";
	html += "    <p class='blcElm'>Alinhar:</p>";
	html += "    <input type='button' class='blcElm' value='À esquerda (A)' onclick='fuscabr.align.alignLeft()'>";
	html += "    <input type='button' class='blcElm' value='À direita (D)' onclick='fuscabr.align.alignRight()'>";
	html += "    <input type='button' class='blcElm' value='Ao topo (W)' onclick='fuscabr.align.alignTop()'>";
	html += "    <input type='button' class='blcElm' value='À base (X)' onclick='fuscabr.align.alignBottom()'>";
	html += "    <p class='blcElm'>Centralizar:</p>";
	html += "    <input type='button' class='blcElm' value='Horizontalmente (F)' onclick='fuscabr.align.centerHorizontal()'>";
	html += "    <input type='button' class='blcElm' value='Verticalmente (G)' onclick='fuscabr.align.centerVertical()'>";
	html += "    <p class='blcElm'>Distribuir:</p>";
	html += "    <input type='button' class='blcElm' value='Horizontalmente (R)' onclick='fuscabr.align.distributeHorizontal()'>";
	html += "    <input type='button' class='blcElm' value='Verticalmente (T)' onclick='fuscabr.align.distributeVertical()'>";
	html += "  </div>";
	html += "  <p class='blcElm' style='margin-top: 10px; font-style: italic;'>Biblioteca FUScaBR</p>";
	
	gui.innerHTML = html;
	document.getElementById("viewContent").parentElement.parentElement.appendChild(gui);
}

// Mostrar controles da UI de alinhamento
fuscabr.align.showControls = function() {
	document.getElementById("fuscabr-align-controls").style.display = "";
}

// Ocultar controles da UI de alinhamento
fuscabr.align.hideControls = function() {
	document.getElementById("fuscabr-align-controls").style.display = "none";
}

/******* Iniciar/Parar alinhamento ******/

// Iniciar o modo de alinhamento
fuscabr.align.start = function() {
	// Criar listeners diversos
	document.querySelector("img[onclick='addViewComponent()']").addEventListener("click", fuscabr.align.updateListeners);
	document.body.addEventListener("keyup", fuscabr.align.keyboardShortcuts);
	fuscabr.align.createListeners();
	// Zerar elementos selecionados
	fuscabr.align.selectedItems = [];
	// Mostrar controles da UI
	document.getElementById("fuscabr-align-start-stop").value = "Parar alinhamento (Esc)";
	document.getElementById("fuscabr-align-start-stop").setAttribute("onclick", "fuscabr.align.stop()");
	fuscabr.align.showControls();
}

// Parar o modo de alinhamento
fuscabr.align.stop = function() {
	// Parar todos os listeners
	document.querySelector("img[onclick='addViewComponent()']").removeEventListener("click", fuscabr.align.updateListeners);
	document.body.removeEventListener("keyup", fuscabr.align.keyboardShortcuts);
	fuscabr.align.removeListeners();
	// Zerar elementos selecionados
	fuscabr.align.selectedItems = [];
	// Ocultar controles da UI
	document.getElementById("fuscabr-align-start-stop").value = "Iniciar alinhamento";
	document.getElementById("fuscabr-align-start-stop").setAttribute("onclick", "fuscabr.align.start()");
	fuscabr.align.hideControls();
}

// Reiniciar alinhamento (limpar seleção)
fuscabr.align.restart = function() {
	fuscabr.align.removeListeners();
	fuscabr.align.createListeners();
	fuscabr.align.selectedItems = [];
}

/******* Responsividade ******/

// Criar listeners para responsividade com o mouse
fuscabr.align.createListeners = function() {
	var elements = document.querySelectorAll("#viewContent > div:not(.fuscabr-align):not(.windowDiv)");
	for (var i of elements) {
		// Criar listeners
		i.addEventListener("mouseover", fuscabr.align.drawHoverBorder);
		i.addEventListener("mouseout", fuscabr.align.clearBorder);
		i.addEventListener("click", fuscabr.align.selectItem);
		i.classList.add("fuscabr-align");
	}
}

// Remover listeners de responsividade com o mouse
fuscabr.align.removeListeners = function() {	
	var elements = document.querySelectorAll("#viewContent > div.fuscabr-align");
	for (var i of elements) {
		// Remover listeners
		i.removeEventListener("mouseover", fuscabr.align.drawHoverBorder);
		i.removeEventListener("mouseout", fuscabr.align.clearBorder);
		i.removeEventListener("click", fuscabr.align.selectItem);
		
		// Remover bordas
		i.style.margin = "";
		i.style.border = "";
		i.classList.remove("fuscabr-align");
	}
	
	// Remover listeners específicos do elemento âncora
	if (fuscabr.align.selectedItems.length > 0) {
		fuscabr.align.selectedItems[0].removeEventListener("mouseup", fuscabr.align.getAnchorPosition);
	}
}

// Atualizar listeners, com delay
fuscabr.align.updateListeners = function() {
	setTimeout(fuscabr.align.createListeners, 200);
}

// Criar atalhos de teclado para os alinhamentos
fuscabr.align.keyboardShortcuts = function() {
	if (event.code == "KeyA") {
		fuscabr.align.alignLeft();
	} else if (event.code == "KeyD") {
		fuscabr.align.alignRight();
	} else if (event.code == "KeyW") {
		fuscabr.align.alignTop();
	} else if (event.code == "KeyX") {
		fuscabr.align.alignBottom();
	} else if (event.code == "KeyF") {
		fuscabr.align.centerHorizontal();
	} else if (event.code == "KeyG") {
		fuscabr.align.centerVertical();
	} else if (event.code == "KeyR") {
		fuscabr.align.distributeHorizontal();
	} else if (event.code == "KeyT") {
		fuscabr.align.distributeVertical();
	} else if (event.code == "Escape") {
		fuscabr.align.stop();
	} else if (event.code == "KeyS") {
		fuscabr.align.restart();
	}
}

// Desenhar uma borda ao passar o mouse sobre uma DIV
fuscabr.align.drawHoverBorder = function() {
	this.style.margin = "-2px";
	this.style.border = "2px solid #F1F116";
}

// Limpar a borda desenhada ao redor de uma DIV
fuscabr.align.clearBorder = function() {
	this.style.margin = "";
	this.style.border = "";
}

// Selecionar uma DIV ao clicar com o mouse sobre ela
fuscabr.align.selectItem = function() {
	// Remover listeners daquele elemento
	this.removeEventListener("mouseover", fuscabr.align.drawHoverBorder);
	this.removeEventListener("mouseout", fuscabr.align.clearBorder);
	this.removeEventListener("click", fuscabr.align.selectItem);
	
	// Adicionar elemento ao array "selectedItems"
	fuscabr.align.selectedItems.push(this);
	// Criar uma nova borda ao redor da DIV
	if (fuscabr.align.selectedItems.length == 1) {
		this.style.margin = "-2px";
		this.style.border = "2px solid #008000"; // Borda verde para o elemento âncora
		this.addEventListener("mouseup", fuscabr.align.getAnchorPosition);
		fuscabr.align.getAnchorPosition();
	} else {
		this.style.margin = "-2px";
		this.style.border = "2px solid #FF7A00"; // Borda laranja para os demais elementos
	}
}

// Obter a posição do primeiro elemento selecionado (âncora)
fuscabr.align.getAnchorPosition = function() {
	xPos = Number(fuscabr.align.selectedItems[0].style.left.replace("px", ""));
	yPos = Number(fuscabr.align.selectedItems[0].style.top.replace("px", ""));
	document.getElementById("fuscabr-align-x-anchor").value = xPos;
	document.getElementById("fuscabr-align-y-anchor").value = yPos;
}

// Alterar a posição do primeiro elemento selecionado (âncora)
fuscabr.align.setAnchorPosition = function() {
	xPos = document.getElementById("fuscabr-align-x-anchor").value;
	yPos = document.getElementById("fuscabr-align-y-anchor").value;
	fuscabr.align.selectedItems[0].style.left = Math.round(xPos) + "px";
	fuscabr.align.selectedItems[0].style.top = Math.round(yPos) + "px";
	updateViewComponentLocation(fuscabr.align.selectedItems[0].id);
}

/******* Funções de alinhamento ******/

// Alinhar elementos à esquerda
fuscabr.align.alignLeft = function() {
	var x = fuscabr.align.selectedItems[0].style.left;
	for (var i of fuscabr.align.selectedItems) {
		i.style.left = x;
		updateViewComponentLocation(i.id);
	}
}

// Alinhar elementos ao topo
fuscabr.align.alignTop = function() {
	var y = fuscabr.align.selectedItems[0].style.top;
	for (var i of fuscabr.align.selectedItems) {
		i.style.top = y;
		updateViewComponentLocation(i.id);
	}
}

// Alinhar elementos à direita
fuscabr.align.alignRight = function() {
	// Usar posição do âncora como referência
	var xLeft = Number(fuscabr.align.selectedItems[0].style.left.replace("px", ""));
	var width = Number(fuscabr.align.selectedItems[0].clientWidth);
	var xRight = xLeft + width;
	
	// Alinhar demais elementos ao âncora
	for (var i of fuscabr.align.selectedItems) {
		var loopXLeft = Number(i.style.left.replace("px", ""));
		var loopWidth = Number(i.clientWidth);
		var loopXRight = loopXLeft + loopWidth;
		
		var newX = loopXLeft + (xRight - loopXRight);
		i.style.left = Math.round(newX) + "px";
		updateViewComponentLocation(i.id);
	}
}

// Alinhar elementos à base
fuscabr.align.alignBottom = function() {
	// Usar posição do âncora como referência
	var yTop = Number(fuscabr.align.selectedItems[0].style.top.replace("px", ""));
	var height = Number(fuscabr.align.selectedItems[0].clientHeight);
	var yBottom = yTop + height;
	
	// Alinhar demais elementos ao âncora
	for (var i of fuscabr.align.selectedItems) {
		var loopYTop = Number(i.style.top.replace("px", ""));
		var loopHeight = Number(i.clientHeight);
		var loopYBottom = loopYTop + loopHeight;
		
		var newY = loopYTop + (yBottom - loopYBottom);
		i.style.top = Math.round(newY) + "px";
		updateViewComponentLocation(i.id);
	}
}

// Centralizar elementos verticalmente
fuscabr.align.centerVertical = function() {
	// Usar posição do âncora como referência
	var yTop = Number(fuscabr.align.selectedItems[0].style.top.replace("px", ""));
	var height = Number(fuscabr.align.selectedItems[0].clientHeight);
	var yCenter = yTop + (height / 2);
	
	// Centralizar demais elementos em relação ao âncora
	for (var i of fuscabr.align.selectedItems) {
		var loopYTop = Number(i.style.top.replace("px", ""));
		var loopHeight = Number(i.clientHeight);
		var loopYCenter = loopYTop + (loopHeight / 2);
		
		var newY = loopYTop + (yCenter - loopYCenter);
		i.style.top = Math.round(newY) + "px";
		updateViewComponentLocation(i.id);
	}
}

// Centralizar elementos horizontalmente
fuscabr.align.centerHorizontal = function() {
	// Usar posição do âncora como referência
	var xLeft = Number(fuscabr.align.selectedItems[0].style.left.replace("px", ""));
	var width = Number(fuscabr.align.selectedItems[0].clientWidth);
	var xCenter = xLeft + (width / 2);
	
	// Centralizar demais elementos em relação ao âncora
	for (var i of fuscabr.align.selectedItems) {
		var loopXLeft = Number(i.style.left.replace("px", ""));
		var loopWidth = Number(i.clientWidth);
		var loopXCenter = loopXLeft + (loopWidth / 2);
		
		var newX = loopXLeft + (xCenter- loopXCenter);
		i.style.left = Math.round(newX) + "px";
		updateViewComponentLocation(i.id);
	}
}

// Distribuir elementos horizontalmente
fuscabr.align.distributeHorizontal = function() {
	// Ignorar se houver menos de 3 itens
	if (fuscabr.align.selectedItems.length < 3) {
		return;
	}
	
	// Ordenar os objetos selecionados por sua posição
	var copyArray = fuscabr.align.selectedItems.slice();
	copyArray.sort( function (a, b) {
		var aa = Number(a.style.left.replace("px", ""));
		var bb = Number(b.style.left.replace("px", ""));
		return (aa > bb ? 1 : -1);
	});
	
	// Calcular o espaco livre entre elementos
	var foo = copyArray.length - 1;
	var minX = Number(copyArray[0].style.left.replace("px", ""));
	var maxX = Number(copyArray[foo].style.left.replace("px", ""));
	var space = (maxX - minX);
	
	for (var i = 0; i < foo; i++) {
		space -= copyArray[i].clientWidth;
	}
	space = space / foo;
	
	// Distribuir elementos com igual espaçamento entre si
	for (var i = 1; i < foo; i++) {
		var pastX = Number(copyArray[(i - 1)].style.left.replace("px", ""));
		var pastWidth = Number(copyArray[(i - 1)].clientWidth);
		
		var newX = pastX + pastWidth + space;
		copyArray[i].style.left = Math.round(newX) + "px";
		updateViewComponentLocation(copyArray[i].id);
		
		// Atualizar a posição do âncora, se o mesmo foi movido
		fuscabr.align.getAnchorPosition();
	}
	
}

// Distribuir elementos verticalmente
fuscabr.align.distributeVertical = function() {
	// Ignorar se houver menos de 3 itens
	if (fuscabr.align.selectedItems.length < 3) {
		return;
	}
	
	// Ordenar os objetos selecionados por sua posição
	var copyArray = fuscabr.align.selectedItems.slice();
	copyArray.sort( function (a, b) {
		var aa = Number(a.style.top.replace("px", ""));
		var bb = Number(b.style.top.replace("px", ""));
		return (aa > bb ? 1 : -1);
	});
	
	// Calcular o espaco livre entre elementos
	var foo = copyArray.length - 1;
	var minY = Number(copyArray[0].style.top.replace("px", ""));
	var maxY = Number(copyArray[foo].style.top.replace("px", ""));
	var space = (maxY - minY);
	
	for (var i = 0; i < foo; i++) {
		space -= copyArray[i].clientHeight;
	}
	space = space / foo;
	
	// Distribuir elementos com igual espaçamento entre si
	for (var i = 1; i < foo; i++) {
		var pastY = Number(copyArray[(i - 1)].style.top.replace("px", ""));
		var pastHeight = Number(copyArray[(i - 1)].clientHeight);
		
		var newY = pastY + pastHeight + space;
		copyArray[i].style.top = Math.round(newY) + "px";
		updateViewComponentLocation(copyArray[i].id);
		
		// Atualizar a posição do âncora, se o mesmo foi movido
		fuscabr.align.getAnchorPosition();
	}
	
}




/******************************************
 *      FUNCIONALIDADES "AVANÇADAS"
 * ****************************************/
fuscabr.advanced = {};
fuscabr.advanced.enabled = false;	// Ativar funções avançadas

// Prevenir que a Representação Gráfica seja apagada acidentalmente
fuscabr.advanced.preventAccidentalViewDeleting = function() {
	var btnDelete = document.querySelector("input[name='delete']");
	btnDelete.type = "button";
	btnDelete.name = "delete-disabled";
	btnDelete.addEventListener("click", fuscabr.advanced.deleteView);
}

// Apagar a Representação Gráfica após confirmação
fuscabr.advanced.deleteView = function() {
	if (window.confirm("ATENÇÃO!\nVocê está prestes a APAGAR esta Representação Gráfica!\n\nContinuar?")) {
		var viewForm = document.querySelector("form[name='view']");
		var hiddenInput = document.createElement("input");
		hiddenInput.type = "hidden";
		hiddenInput.name = "delete";
		hiddenInput.value = "Apagar";
		viewForm.appendChild(hiddenInput);
		viewForm.submit();
	}
}

// Mudar a função "positionEditor" do ScadaBR
fuscabr.advanced.changePositionEditor = function() {
		positionEditor_backup = positionEditor;
		positionEditor = fuscabr.advanced.positionEditor;
}

// Função alternativa para a "positionEditor" padrão
fuscabr.advanced.positionEditor = function (compId, editorId) {
	// Position and display the renderer editor.
	var pDim = getNodeBounds($("c"+ compId));
	var editDiv = $(editorId);
	editDiv.style.left = (pDim.x + 30) + "px";
	editDiv.style.top = (pDim.y + 10) + "px";
}




/******************************************
 *       INICIALIZAR A BIBLIOTECA
 * ****************************************/
// Carregar funções de acordo com a página do ScadaBR
fuscabr.init = function() {
	if (window.location.pathname.search("view_edit") >= 0) {
		if (fuscabr.align.enabled) {
			// Funções de alinhamento
			fuscabr.align.createInterface();
		}
		if (fuscabr.advanced.enabled) {
			// Funções avançadas
			fuscabr.advanced.preventAccidentalViewDeleting();
			fuscabr.advanced.changePositionEditor();
		}
	}
	if (window.location.pathname.search("view") >= 0 && fuscabr.chart.enabled) {
		// Funções gráficas (exige o Chart.js)
		if (typeof Chart != "undefined") {
			setInterval(fuscabr.chart.loop, fuscabr.chart.refreshTime);
		} else {
			alert("O script Chart.js não foi localizado");
		}
	}
}

// Iniciar após o carregamento da janela
window.addEventListener("load", fuscabr.init);
