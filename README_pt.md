![FBR](https://raw.githubusercontent.com/celsou/fuscabr/master/fuscabr/templates/internal/fbr.png)


## O que é a FBR?
A FBR (anteriormente FUScaBR) é uma biblioteca Javascript criada para adicionar recursos ao ScadaBR como, por exemplo, a capacidade de alinhar elementos nas Representações Gráficas. Você pode considerar a FBR como um _add-on_ para o ScadaBR.

## Como a FBR funciona?
A versão atual da FBR é baseada em módulos. Cada módulo adiciona uma funcionalidade específica ao ScadaBR. Os módulos presentes na versão mais recente da FBR são:
- **Módulo Align** (align.js): adiciona a capacidade de alinhar elementos às Representações Gráficas.
- **Módulo Calendar** (calendar.js): permite o uso de um calendário interativo para selecionar datas no componente "Comparação de gráficos" da Representação Gráfica.
- **Módulo Chart** (chart.js): permite a integração da [biblioteca Chart.js](https://www.chartjs.org/) com os "scripts para o servidor" do ScadaBR. Os modelos de scripts para o servidor necessários para esta integração são incluídos no módulo Code Snippet.
- **Módulo Code Editor** (ceditor.js): integra o poderoso editor de código [CodeMirror](https://codemirror.net/) ao ScadaBR, melhorando a experiência do usuário ao utilizar recursos envolvendo a criação scripts.
- **Módulo Code Snippet** (csnippet.js): permite o uso de vários modelos prontos de código com os componentes "HTML" e "script para o servidor" na Representação Gráfica. Você também pode criar seus próprios modelos e adicioná-los a este módulo.
- **Módulo Fixes** (fixes.js): corrige alguns _bugs_ presentes em versões específicas do ScadaBR. Verifique as configurações do módulo para ativar ou desativar essas correções individualmente.

## Instalação
A FBR 2.1+ possui instaladores para Windows e Linux. Obtenha-os na [página de downloads](https://github.com/celsou/fuscabr/releases/latest/).

Confira também as [instruções de instalação](https://github.com/celsou/fuscabr/wiki/Installation).

## Internacionalização
A FBR tem suporte a internacionalização. Atualmente, existem traduções em português, inglês e espanhol. Você pode traduzir a FBR editando os arquivos em `fuscabr/conf/i18n` e alterando o idioma padrão no arquivo `conf/common.json`. Você pode aprender conferir como alterar o idioma da FBR (ou criar novas traduções) na [Wiki da FBR](https://github.com/celsou/fuscabr/wiki/FUScaBR-localization). Colaborações para traduzir a FBR para outros idiomas são bem-vindas.

## Configurações
As configurações da FBR são baseadas em arquivos JSON. Esses arquivos estão localizados dentro da pasta `fuscabr/conf` e controlam tanto a biblioteca em geral como os comportamentos específicos dos módulos. Você pode obter mais informações na [Wiki da FBR](https://github.com/celsou/fuscabr/wiki/FUScaBR-settings).

## Suporte ao Scada-LTS
As versões atuais da FBR não foram desenvolvidas tendo a compatibilidade com o Scada-LTS em mente. A FBR versão 2.1.1 traz mudanças nos templates de scripts para _iniciar_ um processo de suporte oficial ao Scada-LTS. Futuras versões (3.x) trarão um melhor suporte ao Scada-LTS.

A Equipe do Scada-LTS está trabalhando para integrar a FBR versão 2.0 ao Scada-LTS [link](https://github.com/SCADA-LTS/Scada-LTS/releases/tag/v2.7.8). Este eforço não está relacionado diretamente comigo, portanto, caso encontre algum bug relacionado à versão da FBR pré-instalada no Scada-LTS, não esqueça de reportá-lo também à equipe do Scada-LTS.

## Licença
A FBR é distribuída sob a licença MIT.
