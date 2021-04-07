/* Livre para uso sob a licença MIT  */

// Especifica quantos valores serão lidos
var reading_number = 50;

// ID de todos os pontos a serem lidos
// Dica: é possível usar a variável
// interna "point.id"
var reading_points = [ point.id ];

// Altura do gráfico, em pixels
var height = 400;

// Largura do gráfico, em pixels
var width = 500;

// Habilitar título do gráfico
var show_title = true;

// Texto do título do gráfico
var title = 'Meu gráfico';

// Tipo de gráfico:
// 0 -> Gráfico de linhas
// 1 -> Gráfico de barras
// 2 -> Gráfico de barras (horizontal)
var graphic_type = 0;

// Cor das séries no gráfico
var series_colors = [ '#FF9421CC' ];

// Descrição de cada série exibida
var descriptions = [ 'Variável' ];

// Iniciar o eixo Y sempre em zero
var begin_Y_at_zero = true;

// Ativar as animações do gráfico
var enable_animations = true;



// NÃO ALTERE A PARTIR DAQUI


// Obter últimos n valores dos datapoints
function readPoints(id) {
	var val = new com.serotonin.mango.db.dao.PointValueDao();
	return val.getLatestPointValues(id, reading_number);
}

// Criar um array JSON vazio. Isto é um
// "workaround"
function emptyJSONArray() {
	var emptyArray = '[';
	
	for (var i = 0; i < reading_number; i++) {
		emptyArray += '""';
		if (i != (reading_number - 1)) {
			emptyArray += ',';
		}
	}
	
	emptyArray += ']';
	return emptyArray;
}

// Criar um array JSON com os dados de
// valores de datapoints
function readingDataJSONArray(obj) {
	var foo = '[';
	var size = obj.size() - 1;

	for (var i = size; i >= 0; i--) {
		foo += '"' + obj.get(i).value + '"';
		
		if (i != 0) {
			foo += ',';
		}
	}
	
	foo += ']';
	return foo;
}

// Criar uma string JSON compatível com o
// formato de datasets do Chart.js
function createJSONDatasets() {
	var size = reading_points.length;
	var foo = '[';
	
	for (var i = 0; i < size; i++) {
		var readingArray = readingDataJSONArray(readPoints(reading_points[i]));
		foo +=	'{';
		foo +=		'"label":"' + descriptions[i] + '",';
		foo +=		'"data":' + readingArray + ',';
		foo +=		'"backgroundColor":"' + series_colors[i] + '",';
		foo +=		'"borderColor":"' + series_colors[i] + '"';
		foo +=	'}';
		
		if (i != (size - 1)) {
			foo += ',';
		}
	}
	
	foo += ']';
	return foo;
}


// Criar uma string JSON final que possa ser
// interpretada pela biblioteca FUScaBR
function createFinalJSON() {
	var types = ['line', 'bar', 'horizontalBar'];
	var index = (graphic_type > 2) ? 0 : graphic_type;
	
	var foo = '';
	
	foo +=	'{';
	// Opções específicas da FUScaBR
	foo +=		'"height":"' + height + '",';
	foo +=		'"width":"' + width + '",';
	foo +=		'"beginAtZero":' + begin_Y_at_zero + ',';
	foo +=		'"timeBased":false,';
	foo +=		'"animations":' + enable_animations + ',';
	foo +=		'"showTitle":' + show_title + ',';
	foo +=		'"title":"' + title + '",';
	// Opções do Chart.js
	foo +=		'"type":"' + types[index] + '",';
	foo +=		'"data":{';
	foo +=			'"labels":' + emptyJSONArray() + ',';
	foo +=			'"datasets":' + createJSONDatasets();
	foo +=		'}';
	foo +=	'}';
	
	return foo;
}

var s = "<input class='fuscabr-chart-data' type='hidden' value='" + createFinalJSON() + "' >";

/* Descomente a linha abaixo para mostrar o código JSON gerado */
//s += "<div style='width: 500px;'>" + createFinalJSON() + "</div>";

return s;
