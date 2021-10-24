![FuscaBR](https://user-images.githubusercontent.com/82009729/121762159-9253a980-cb0a-11eb-8230-c8d1a3fb874e.png)


## O que é a FUScaBR?
A FUScaBR é uma biblioteca Javascript criada para adicionar recursos ao ScadaBR como, por exemplo, a capacidade de alinhar elementos nas Representações Gráficas. Você pode considerar a FUScaBR como um _add-on_ para o ScadaBR.

## Como a FUScaBR funciona?
A versão atual da FUScaBR é baseada em módulos. Cada módulo adiciona uma funcionalidade específica ao ScadaBR. Os módulos presentes na versão mais recente da FUScaBR são:
- **Módulo Align** (align.js): adiciona a capacidade de alinhar elementos às Representações Gráficas.
- **Módulo Calendar** (calendar.js): permite o uso de um calendário interativo para selecionar datas no componente "Comparação de gráficos" da Representação Gráfica.
- **Módulo Chart** (chart.js): permite a integração da [biblioteca Chart.js](https://www.chartjs.org/) com os "scripts para o servidor" do ScadaBR. Os modelos de scripts para o servidor necessários para esta integração são incluídos no módulo Code Snippet.
- **Módulo Code Editor** (ceditor.js): integra o poderoso editor de código [CodeMirror](https://codemirror.net/) ao ScadaBR, melhorando a experiência do usuário ao utilizar recursos envolvendo a criação scripts.
- **Módulo Code Snippet** (csnippet.js): permite o uso de vários modelos prontos de código com os componentes "HTML" e "script para o servidor" na Representação Gráfica. Você também pode criar seus próprios modelos e adicioná-los a este módulo.
- **Módulo Fixes** (fixes.js): corrige alguns _bugs_ presentes em versões específicas do ScadaBR. Verifique as configurações do módulo para ativar ou desativar essas correções individualmente.

## Instalação
A FUScaBR 2.1+ possui instaladores para Windows e Linux. Obtenha-os na [página de downloads](https://github.com/celsou/fuscabr/releases/latest/).

Confira também as [instruções de instalação](https://github.com/celsou/fuscabr/wiki/Installation).

## Internacionalização
A FUScaBR tem suporte a internacionalização. Atualmente, existem traduções em português, inglês e espanhol. Você pode traduzir a FUScaBR editando os arquivos em `fuscabr/conf/i18n` e alterando o idioma padrão no arquivo `conf/common.json`. Você pode aprender conferir como alterar o idioma da FUScaBR (ou criar novas traduções) na [Wiki da FUScaBR](https://github.com/celsou/fuscabr/wiki/FUScaBR-localization). Colaborações para traduzir a FUScaBR para outros idiomas são bem-vindas.

## Configurações
As configurações da FUScaBR são baseadas em arquivos JSON. Esses arquivos estão localizados dentro da pasta `fuscabr/conf` e controlam tanto a biblioteca em geral como os comportamentos específicos dos módulos. Você pode obter mais informações na [Wiki da FUScaBR](https://github.com/celsou/fuscabr/wiki/FUScaBR-settings).

## Ajude-nos com o dinheiro do café
A FUScaBR está sendo útil para você? Você pode demonstrar seu agradecimento através de uma doação. Atualmente, estamos aceitando doações apenas através de Pix (sistema brasileiro de pagamentos). Os dados são os seguintes:

Chave aleatória Pix: `848c0870-ec5a-488c-95eb-97e3e3c8e029`

Obrigado!

## Licença
A FUScaBR é distribuída sob a licença MIT.
