![FuscaBR](https://user-images.githubusercontent.com/82009729/121762159-9253a980-cb0a-11eb-8230-c8d1a3fb874e.png)


## O que é a FUScaBR?
A FUScaBR é uma biblioteca Javascript criada para adicionar recursos ao ScadaBR como, por exemplo, a capacidade de alinhar elementos nas Representações Gráficas. Você pode considerar a FUScaBR como um _add-on_ para o ScadaBR.

## Como a FUScaBR funciona?
A versão atual da FUScaBR é baseada em módulos. Cada módulo adiciona uma funcionalidade específica ao ScadaBR. Os módulos presentes na versão mais recente da FUScaBR são:
- **Módulo Align** (align.js): adiciona a capacidade de alinhar elementos às Representações Gráficas.
- **Módulo Calendar** (calendar.js): permite o uso de um calendário interativo para selecionar datas no componente "Comparação de gráficos" da Representação Gráfica.
- **Módulo Chart** (chart.js): permite a integração da biblioteca Chart.js com os "scripts para o servidor" do ScadaBR. Os modelos de scripts para o servidor necessários para esta integração são incluídos no módulo Code Snippet.
- **Módulo Code Snippet** (csnippet.js): permite o uso de vários modelos prontos de código com os componentes "HTML" e "script para o servidor" na Representação Gráfica. Você também pode criar seus próprios modelos e adicioná-los a este módulo.
- **Módulo Fixes** (fixes.js): Corrige alguns _bugs_ presentes em versões específicas do ScadaBR. Verifique as configurações do módulo para ativar ou desativar essas correções individualmente.

## Instalação
- Faça o download da [última versão](https://github.com/celsou/fuscabr/releases/latest/).
- Extraia o arquivo `FUScaBR.zip`
- Copie a pasta `fuscabr` para dentro da pasta `resources/`, na sua instalação do ScadaBR.
- Em sua instalação do ScadaBR, edite o arquivo `WEB-INF/tags/page.tag` e adicione uma tag de script com o conteúdo: `<script src="resources/fuscabr/fuscabr.js" async></script>`
- Limpe o cache do seu navegador

## Internacionalização
A FUScaBR tem suporte a internacionalização. Atualmente, existem traduções apenas em português e inglês. Você pode traduzir a FUScaBR editando os arquivos em `fuscabr/conf/i18n` e alterando o idioma padrão no arquivo `conf/common.json`. Você pode aprender conferir como alterar o idioma da FUScaBR (ou criar novas traduções) na [Wiki da FUScaBR](https://github.com/celsou/fuscabr/wiki/FUScaBR-localization). Colaborações para traduzir a FUScaBR para outros idiomas são bem-vindas.

## Configurações
As configurações da FUScaBR são baseadas em arquivos JSON. Esses arquivos estão localizados dentro da pasta `fuscabr/conf` e controlam tanto a biblioteca em geral como os comportamentos específicos dos módulos. Você pode obter mais informações na [Wiki da FUScaBR](https://github.com/celsou/fuscabr/wiki/FUScaBR-settings).

## Licença
A FUScaBR é distribuída sob a licença MIT.
