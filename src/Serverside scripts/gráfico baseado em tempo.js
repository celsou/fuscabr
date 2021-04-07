/* Livre para uso sob a licença MIT  */

// Unidade de tempo a ser adotada:
// 0 -> Segundos
// 1 -> Minutos
// 2 -> Horas
// 3 -> Dias
var time_unit = 0;

// Intervalo de tempo a ser lido,
// na unidade definida anteriormente
var time_value = 30;

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

// Cor das séries no gráfico
var series_colors = [ '#FF9421CC' ];

// Descrição de cada série exibida
var descriptions = [ 'Variável' ];

// Iniciar o eixo Y sempre em zero
var begin_Y_at_zero = true;

// Ativar as animações do gráfico
var enable_animations = true;



// NÃO ALTERE A PARTIR DAQUI


// Obter valores e horários dos datapoints
function readPoints(id) {
	// Unidades: segundo, minuto, hora, dia
	var unit_values = [ 1000, 60000, 360000, 86400000];
	var index = (time_unit > 3) ? 0 : time_unit;
	var since = new Date().getTime() - (time_value * unit_values[index]);
	
	var val = new com.serotonin.mango.db.dao.PointValueDao();
	return val.getPointValues(id, since);
}

// Criar um array JSON com os dados de
// valores e horários de datapoints
function readingDataJSONArray(obj) {
	var foo = '[';
	var size = obj.size() - 1;

	for (var i = size; i >= 0; i--) {
		foo += '{"x":' + obj.get(i).time + ',';
		foo += '"y":' + obj.get(i).value + '}';
		
		if (i != 0) {
			foo += ',';
		}
	}
	
	foo += ']';
	return foo;
}

// Criar um array JSON compatível com o
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
	var foo = '';
	
	foo +=	'{';
	// Opções específicas da FUScaBR
	foo +=		'"height":"' + height + '",';
	foo +=		'"width":"' + width + '",';
	foo +=		'"beginAtZero":' + begin_Y_at_zero + ',';
	foo +=		'"timeBased":true,';
	foo +=		'"animations":' + enable_animations + ',';
	foo +=		'"showTitle":' + show_title + ',';
	foo +=		'"title":"' + title + '",';
	// Opções do Chart.js
	foo +=		'"type":"line",';
	foo +=		'"data":{';
	foo +=			'"datasets":' + createJSONDatasets();
	foo +=		'}';
	foo +=	'}';
	
	return foo;
}

var s = "<input class='fuscabr-chart-data' type='hidden' value='" + createFinalJSON() + "' >";

/* Descomente a linha abaixo para mostrar o código JSON gerado */
//s += "<div style='width: 500px;'>" + createFinalJSON() + "</div>";

return s;
