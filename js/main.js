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
        step: -1,
        stepsTotal: 5,
        playerName: 'Игрок', // Alias 'player'
        playerScore: 0,
        playerActive: false,
        compScore: 0,
        compName: 'Компьютер', // Alias 'comp'
        adminName: 'Судья', // Alias 'admin'
        status: 'loading', //'loading', 'nameRequired', 'steps', 'gameOver';
        defaultPop: 50,
        mentionedCities: [],
        activeLetter: ''

    };




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
        var userInput = elementInput.value;
        var cityOfComp;

        if (game.playerActive && userInput){

            game.playerActive = false; // Begin

            informer(userInput, 'player');

            switch(game.status){
                case 'nameRequired':
                    setPlayerName(userInput, 'player');
                    game.status = 'steps';
                    informer(game.playerName + ', Вы играете против ' + game.compName +'а. Вам нужно называть по-очереди город, заглавная буква которого - это последняя буква в городе Вашего соперника. В этой игре победит тот, кто назовет больше крупных городов по населению. За '+ game.stepsTotal + ' ходов нужно успеть опередить соперника. Начнем с Вас. Ходите!', 'admin', 'Напишите первый город (с прописной буквы)');
                    break;
                case 'steps': 
                    if (procInputCity(userInput)) {
                        setSteps();
                        game.activeLetter = findLastLetter(userInput);
                        cityOfComp = compSaysCity(game.activeLetter);
                        
                        if(cityOfComp) {
                            informer(cityOfComp,'comp', '');
                            informer(cityOfComp +' (' +cityDB[cityOfComp].c +') - есть такой город! ' + game.compName + ' заработал ' + cityDB[cityOfComp].p + 'k очков!'  ,'admin', ' ');
                            addPlayerScore(cityDB[cityOfComp].p, 'comp');
                            setSteps();
                            if(game.status == 'steps') {
                                informer ('Ход за игроком по имени ' + game.playerName, 'admin', 'Напишите город на букву ' + game.activeLetter);
                            }
                        } else {

                            setSteps(game.playerName, game.compName);  // 'comp' is looser
                            break;
                        }

                    };
                    break;
                case 'gameOver':

                    break;

            }

            elementInput.value=''; 

            game.playerActive  = true; // End
        }
    }

    function setPlayerName(name, player) {
        switch(player) {
            case 'player':
                game.playerName = name;
                elementPlayerName.innerHTML = name + ':';
                break;
            case 'comp':
                game.compName = name;
                elementCompName.innerHTML = name + ':';
                break;
            default:
                return;
        }
    }

    function addPlayerScore(addition, player){
        switch(player) {
            case 'player':
                game.playerScore += addition;
                elementScorePlayer.innerHTML = game.playerScore  + 'k';
                break;
            case 'comp':
                game.compScore += addition;
                elementScoreComp.innerHTML = game.compScore + 'k';
                break;
            default:
                return;
        }

    }
    function setSteps(winner,looser){ 
        var text = 'Игра окончена! ';

        if (winner && looser) {
            game.status = 'gameOver';
            informer(looser + ' не может назвать город на букву ' + game.activeLetter + '! ' + winner + ' победил', 'admin', '')
            return;

        } else if (game.status != 'gameOver') {
            game.step++;
            elementSteps.innerHTML = game.step + '/' + game.stepsTotal;

            if (game.step == game.stepsTotal) { //Game Over
                if (game.playerScore > game.compScore){
                    text += 'Победил ' + game.playerName;
                } else if(game.playerScore < game.compScore) {
                    text += 'Победил ' + game.compName;
                } else {
                    text += 'Ничья';
                }
                informer(text, 'admin', ' ');
                game.status = 'gameOver';
            }

        }
    }

    function procInputCity(city) {
        if(~game.mentionedCities.indexOf(city)) {
            informer(city +' - уже называли!', 'admin', 'Напишите другой город');
            return false;
        }

        if(cityDB[city]) {
            informer(city +' (' +cityDB[city].c +') - есть такой город! ' + game.playerName + ' заработал ' + cityDB[city].p + 'k очков!'  ,'admin', ' ');
            addPlayerScore(cityDB[city].p, 'player');

        } else {
            informer('Такого города не знаю. ' + game.playerName + ' заработал ' + game.defaultPop + 'k очков.'  ,'admin', ' ');
            addPlayerScore(game.defaultPop, 'player');
        }

        game.mentionedCities.push(city);
        return true;

    }
    function findLastLetter(word) {
        return word.charAt(word.length - 1).toUpperCase();
    }

    function compSaysCity(letter) {
        var list =[];
        var variants =0;
        var randomCityIndex;


        for (var key in cityDB) {

            if (key.charAt(0) == letter && !~game.mentionedCities.indexOf(key)) {

                list.push(key);
            }
        }
        variants = list.length;

        if(variants) {

            randomCityIndex =  getRandomArbitrary(0, variants);
                
            game.activeLetter = findLastLetter(list[randomCityIndex]);
            return list[randomCityIndex];
        }

        return;


    }

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    // Prepare page and the game before start
    elementButtonCommit.addEventListener('click',buttonCommitClick,false);
    setPlayerName(game.playerName, 'player');
    setPlayerName(game.compName, 'comp');
    addPlayerScore(0,'player');
    addPlayerScore(0,'comp');
    setSteps();

    //Corrects overflow of the informer
    elementInformer.style.maxHeight = elementInformer.offsetHeight -100 + 'px';

    //Begins the game
    game.status = 'nameRequired';  
    game.playerActive = true;
    informer('Добро пожаловать в игру! Я судья, буду следить за справедливой борьбой. Скажите, как Вас зовут?','admin','Сообщите судье Ваше имя')





}






