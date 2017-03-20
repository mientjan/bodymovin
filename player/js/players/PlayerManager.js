export default function PlayerManager(){}

PlayerManager.prototype.createPlayer = function(type){
    switch(type){
        case '1':
            return createElement(BasicPlayer);
    }
};

export var playerManager = createElement(PlayerManager);