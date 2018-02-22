window.onload = init;


function init() {
    var elementInformer= document.getElementById('informer');
    var elementButtonCommit = document.getElementById('button-commit');
    var elementInput = document.getElementById('input');
    var elementScorePlayer = document.getElementById('player-score');
    var elementScoreComp = document.getElementById('comp-score');
    var elementSteps = document.getElementById('steps');
    var elementPlayerName = document.getElementById('player-name');
    var elementCompName = document.getElementById('comp-name');




    console.log(elementButtonCommit);
    var game = {
        step: 0,
        stepsTotal: 25,
        playerName: 'Sergey',
        playerScore: 0,
        playerActive: false,
        compScore: 0,
        compName: 'Компьютер',
        adminName: 'Судья',
        status: 'loading', //'loading', 'nameRequired', 'steps'
        defaultPop: 50
    };

    var mentionedCities = [];



    function informer(msg, author, placeholder) {
        elementInput.placeholder = placeholder;
        if (msg){
            var br = '<br/>';
            var space = ' ';
            var separator = ':';
            var data = new Date();
            var hour = data.getHours();
            var minutes = data.getMinutes();
            var seconds = data.getSeconds();
            var time;
            var name;

            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            time = hour + separator + minutes + separator + seconds;

            switch(author) {

                case 'player': 
                    name = game.playerName;
                    elementInformer.innerHTML ='<p class="informer__msg"><span class="informer__msg_info">' +time +' - ' + name +' &rArr; </span><span class="informer__msg_data">'  +  msg + '</span></p>'+ br + elementInformer.innerHTML;
                    break;
                case 'comp':
                    name = game.compName;
                    elementInformer.innerHTML ='<p class="informer__msg informer__msg_comp"><span class="informer__msg_data">' + msg +'</span><span class="informer__msg_info"> &lArr; ' + name +' - ' + time + br + elementInformer.innerHTML;
                    break;
                default:
                    name = game.adminName;
                    elementInformer.innerHTML = '<p class="informer__msg informer__msg_admin"><span class="informer__msg_info">' + name +' &rArr; </span><span class="informer__msg_data">'  +  msg + '</span></p>'+ br + elementInformer.innerHTML;
            }
        }


    }
    function buttonCommitClick() {// Main function of the gameplay. Player's answers scroll the timeline of the game

        if (game.playerActive && elementInput.value){
            
            game.playerActive = false; // Begin
            
            informer(elementInput.value, 'player');
            
            switch(game.status){
                case 'nameRequired':
                    setPlayerName(elementInput.value);
                    game.status = 'steps';
                    informer(game.playerName + ', Вы играете против ' + game.compName +'а. Вам нужно называть по-очереди город, заглавная буква которого - это последняя буква в городе Вашего соперника. В этой игре победит тот, кто назовет больше крупных городов по населению. За '+ game.stepsTotal + ' ходов нужно успеть опередить соперника. Начнем с Вас. Ходите!', 'admin', 'Напишите первый город');
                    break;
                case 'steps': 
                    procInputCity(elementInput.value);
                    break;
                    
            }
            
            
            elementInput.value=''; 
            
            game.playerActive  = true; // End
        }

    }
    function setPlayerName(name) {
        game.playerName = name;
        elementPlayerName.innerHTML = name + ':';

    }
    
    function procInputCity(city) {
        if(cityDB[city]) {
            informer('Есть такой город в '+cityDB[city].c + '! ' + game.playerName + ' заработал ' + cityDB[city].p + 'k очков!'  ,'admin', ' ');
            
            
        } else {
            informer('Такого города не знаю. ' + game.playerName + ' заработал ' + game.defaultPop + 'k очков.'  ,'admin', ' ');
            
            console.log(game.defaultPop);
        }
        
        
    }
    



    // Prepare page and the game before start
    elementButtonCommit.addEventListener('click',buttonCommitClick,false);
    elementScorePlayer.innerHTML = game.playerScore;
    elementScoreComp.innerHTML = game.compScore;
    elementSteps.innerHTML = game.step + '/' + game.stepsTotal;
    elementCompName.innerHTML = game.compName + ':';

    //Corrects overflow of the informer
    elementInformer.style.maxHeight = elementInformer.offsetHeight -100 + 'px';
    
    //Begins the game
    game.status = 'nameRequired';  
    game.playerActive = true;
    informer('Добро пожаловать в игру! Я судья, буду следить за справедливой борьбой. Скажите, как Вас зовут?','admin','Сообщите судье Ваше имя')





}






