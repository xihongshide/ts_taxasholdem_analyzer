/** ======================================================================
==========================================================================
 projectName              Taxas Hold 'em Analyzer
 Developed By             Liang Li
 Description              Analize 7 cards to 5 and return the best hand
 =========================================================================
 ========================================================================*/

enum HandRank {
    STRAIGHT_FLUSH,
    FOUR_OF_A_KIND,
    FULL_HOUSE,
    FLUSH,
    STRAIGHT,
    THREE_OF_A_KIND,
    TWO_PAIRS,
    ONE_PAIR,
    HIGH_CARD
}

/**----------------------------------------------------
 * @String                  playerName
 * @Array                   cards
 * @constructs              Table.Class
 -----------------------------------------------------*/

class Table {
    cards: any;
    player: Player;
    hand: any;
    _BUTTONLOCK: Boolean;

    constructor(deck: any) {
        this.deck = deck;
        this.cards = [];
        this.player = new Player("LL");
        this._BUTTONLOCK= false;
        this.hand = this.deck.pocket.concat(this.deck.flop, this.deck.turn, this.deck.river);
    }

    /**
     * reset game acting like constructor functtion
     * empty deck, player on the table, hand array and cards array
     */
    public reset(deck: any) {
        this.deck = deck;
        this.cards = [];
        this.player = new Player("LL");
        this.hand = this.deck.pocket.concat(this.deck.flop, this.deck.turn, this.deck.river);
        this._BUTTONLOCK= false;
    }

    /**
     * deal pocket to Player
     * deal flop, turn and river to Table
     */
    public deal(dealRound: string) {
        if(!this._BUTTONLOCK)
            this._BUTTONLOCK = false;

        if (dealRound == "pocket") {
            this.player.pocket = this.player.pocket.concat(this.deck[dealRound]);
            this.drawCards(this.player.pocket, dealRound);
        }else if(dealRound == "flop"){
            this.cards = this.cards.concat(this.deck[dealRound]);
            let drawCards = [];
            drawCards = drawCards.concat(this.deck[dealRound]);
            this.drawCards(drawCards, "deck");
        }else if(dealRound == "turn"){
            this.cards = this.cards.concat(this.deck[dealRound]);
            let drawCards = [];
            drawCards = drawCards.concat(this.deck[dealRound]);
            this.drawCards(drawCards, "deck");
        }else {
            this.cards = this.cards.concat(this.deck[dealRound]);
            let drawCards = [];
            drawCards = drawCards.concat(this.deck[dealRound]);
            this.drawCards(drawCards, "deck");
        }

        this._BUTTONLOCK = true;
    }

    /**
     * render pocket, flop, turn, river and winning hand cards
     */
    private drawCards(cards, type): void{
        for(let card in cards){
            let suit = cards[card].suit;
            let value = cards[card].value;

            if (suit == "h"){
                let color = "red", text = "♥";
            }else if(suit == "d"){
                let color = "red", text = "♦";
            }else if(suit == "s"){
                let color = "black", text = "♠";
            }else{
                let color = "black", text = "♣";
            }

            let cardElement = '<div class="grid-item"><div class="top-left" style="color:' + color + '">'+ value +'<br><div style="color:' + color + '">'+ text +'</div></div><div></div><div></div><div></div><div class="middle"></div><div></div><div></div><div></div><div class="bottom-right">'+ value +'<br><div style="color:' + color + '">'+text+'</div></div></div></div>'

            setTimeout(function(){
                $("#" + type + "_container").append(cardElement).fadeIn('slow');
            }, 500);
        }
    }

    /**
     * solve hand cards
     * return a winning hand cards array
     */
    public solveHand(): any{
        if(!this._BUTTONLOCK)
            this._BUTTONLOCK = false;

        var winhand = {},
            handSuits = [],
            handRanks = [],
            hand = this.hand;

        for(let i in hand){
            handSuits.push(hand[i].suit);
            handRanks.push(hand[i].rank);
        }

        if (winhand.wincards = this.isStraightFlush(handSuits)){
            return [winhand, HandRank.STRAIGHT_FLUSH]
        }else if (winhand.wincards = this.isFourOfAKind(handRanks)){
            return [winhand, HandRank.FOUR_OF_A_KIND]
        }else if (winhand.wincards = this.isFullHouse(handRanks)){
            return [winhand, HandRank.FULL_HOUSE]
        }else if (winhand.wincards = this.isFlush(handSuits)){
            return [winhand, HandRank.FLUSH]
        }else if (winhand.wincards = this.isStraight(handRanks)){
            return [winhand, HandRank.STRAIGHT]
        }else if (winhand.wincards = this.isThreeOfAKind(handRanks)){
            return [winhand, HandRank.THREE_OF_A_KIND]
        }else if (winhand.wincards = this.isDoublePair(handRanks)){
            return [winhand, HandRank.TWO_PAIRS]
        }else if (winhand.wincards = this.isPair(handRanks)){
            return [winhand, HandRank.ONE_PAIR]
        }else{
            winhand.wincards = hand.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank)).reverse().slice(0,5);
            return [winhand, HandRank.HIGH_CARD]
        }

        this._BUTTONLOCK = true;
    }

    /**
     * evaluate hand cards to see if its straightFlush
     * check if hand cards is flush and straight
     * return winCards[] or undefined.
     */
    private isStraightFlush(suit): any{
       let flush = this.isFlush(suit);
       let straightFlush;

       if (flush) {
           straightFlush = this.isStraight(flush);
       }

       return straightFlush;
    }

    /**
     * evaluate hand cards to see if its Flush
     * check duplicate of cards suit
     * return winCards[] or undefined.
     */
    private isFlush(suits):any {
        let sortedDupCount= this.checkDup(suits);
        let winCards =[];
        let cards = this.hand;

        let flush = cards.filter(card => card.suit == sortedDupCount[0][0]);

        if (sortedDupCount[0][1] == 5) {
            winCards = flush.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank));
            return winCards;
        }else if(sortedDupCount[0][1]  > 5){
            let winCards = flush.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank));
            winCards = winCards.reverse();
            return winCards.slice(0, 5)
        }
    }

    /**
     * evaluate hand cards to see if its Straight
     * loop through hand cards array and push consecutives to consecutives[]
     * return consecutives[] if its length is not less than 5 or undefined.
     */
    private isStraight(ranks):any {
        let consecutives = [];
        let aceIndex = this.hasRank(ranks, 14);

        if (aceIndex)
            consecutives.push(ranks[aceIndex]);

        for (let i = 2; i < 15; i++) {
            let cardIndex = this.hasRank(ranks, i);

            if (cardIndex!=null){
                consecutives.push(ranks[cardIndex]);
            }else{
                consecutives = [];
            }

            if (consecutives.length >= 5) {
                const nextCards = ranks[this.hasRank(ranks, i + 1)];
                if (nextCards && nextCards.length === 0) {
                    break;
                }
            }
        }

        if (consecutives.length >= 5)
            return consecutives.slice(0, 5);
    }

    /**
     * evaluate hand cards to see if its Four Of A Kind
     * check duplicate of cards rank
     * return hightest winCards[] or undefined.
     */
    private isFourOfAKind(ranks):any {
        let sortedDupCount= this.checkDup(ranks);
        let winCards =[];
        let cards = this.hand;
        console.log(sortedDupCount);

        if (sortedDupCount[0][1] == 4) {
            winCards = winCards.concat(cards.filter(card => card.rank == sortedDupCount[0][0]));
            winCards.forEach(f => cards.splice(cards.findIndex(e => e.rank === f.rank),1));
            cards = cards.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank));
            winCards = winCards.concat(cards.reverse());

            return winCards.slice(0,5);
        }
    }

    /**
     * evaluate hand cards to see if its Full House
     * check duplicate of cards suit
     * return hightest winCards[] or undefined.
     */
    private isFullHouse(ranks):any {
        let sortedDupCount= this.checkDup(ranks);
        let winCards =[];
        let cards = this.hand;

        if(sortedDupCount[0][1] == 3 && sortedDupCount[1][1] == 3 && sortedDupCount[2][1] == 1){
            if(parseFloat(sortedDupCount[0][0]) > parseFloat(sortedDupCount[1][0])){
                winCards = winCards.concat(cards.filter(card => card.rank == sortedDupCount[0][0]), cards.filter(card => card.rank == sortedDupCount[1][0]));
            }else{
                winCards = winCards.concat(cards.filter(card => card.rank == sortedDupCount[1][0]), cards.filter(card => card.rank == sortedDupCount[0][0]));
            }
            console.log(winCards);

            return winCards.slice(0,5);
        }else if(sortedDupCount[0][1] == 3 && sortedDupCount[1][1] == 2 && sortedDupCount[2][1] == 2) {
            if(parseFloat(sortedDupCount[2][0]) > parseFloat(sortedDupCount[1][0])) {
                winCards = winCards.concat(cards.filter(card => card.rank == sortedDupCount[0][0]), cards.filter(card => card.rank == sortedDupCount[2][0]));
            }else{
                winCards = winCards.concat(cards.filter(card => card.rank == sortedDupCount[0][0]), cards.filter(card => card.rank == sortedDupCount[1][0]));
            }

            return winCards.slice(0,5);
        }else if(sortedDupCount[0][1] == 3 && sortedDupCount[1][1] == 2 && sortedDupCount[2][1] == 1){
            winCards = winCards.concat(cards.filter(card => card.rank == sortedDupCount[0][0]), cards.filter(card => card.rank == sortedDupCount[1][0]));
            return winCards.slice(0,5);
        }
    }

    /**
     * evaluate hand cards to see if its Three of a Kind
     * check duplicate of cards suit
     * return hightest winCards[] or undefined.
     */
    private isThreeOfAKind(ranks):any {
        let sortedDupCount= this.checkDup(ranks);
        let winCards =[];
        let cards = this.hand;

        if(sortedDupCount[0][1] == 3 && sortedDupCount[1][1] == 1) {
            winCards = winCards.concat(cards.filter(card => card.rank == sortedDupCount[0][0]));
            winCards.forEach(f => cards.splice(cards.findIndex(e => e.rank === f.rank),1));
            cards = cards.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank));
            winCards = winCards.concat(cards.reverse());

            return winCards.slice(0,5);
        }
    }

    /**
     * evaluate hand cards to see if its Double Plirs
     * check duplicate of cards suit
     * return hightest winCards[] or undefined.
     */
    private isDoublePair(ranks):any {
        let sortedDupCount= this.checkDup(ranks);
        let winCards =[];
        let cards = this.hand;

        //check to see if full house has two pairs or one pair
        if(sortedDupCount[0][1] == 2 && sortedDupCount[1][1] == 2 && sortedDupCount[2][1] == 1) {
            winCards = winCards.concat(cards.filter(card => card.rank == sortedDupCount[0][0]), cards.filter(card => card.rank == sortedDupCount[1][0]));
            winCards.forEach(f => cards.splice(cards.findIndex(e => e.rank === f.rank),1));
            cards = cards.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank));
            winCards = winCards.concat(cards.reverse());

            return winCards.slice(0,5);
        }else if(sortedDupCount[0][1] == 2 && sortedDupCount[1][1] == 2 && sortedDupCount[2][1] > 1) {
            winCards = winCards.concat(cards.filter(card => card.rank == sortedDupCount[0][0]), cards.filter(card => card.rank == sortedDupCount[1][0]), cards.filter(card => card.rank == sortedDupCount[2][0]));
            winCards = winCards.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank)).reverse();

            return winCards.slice(0,5);
        }
    }

    /**
     * evaluate hand cards to see if its Double Plirs
     * check duplicate of cards suit
     * return hightest winCards[] or undefined.
     */
    private isPair(ranks):any {
        let sortedDupCount= this.checkDup(ranks);
        let winCards =[];
        let cards = this.hand;

        if(sortedDupCount[0][1] == 2 && sortedDupCount[1][1] == 1) {
            winCards = winCards.concat(cards.filter(card => card.rank == sortedDupCount[0][0]));
            winCards.forEach(f => cards.splice(cards.findIndex(e => e.rank === f.rank),1));
            cards = cards.sort((a, b) => parseFloat(a.rank) - parseFloat(b.rank));
            winCards = winCards.concat(cards.reverse());

            return winCards.slice(0,5);
        }
    }

    /**
     * loop hand cards and find the index of a card with a perticular rank
     * return card index
     */
    private hasRank(hand, rank):any {
        let index = null;

        hand.forEach((key) => {
            if(key.rank == rank)
                index = hand.indexOf(key);
        });

        return index;
    }

    /**
     * check card suit duplicates or card rank
     * return an sortedCount[] stroring duplicates
     */
    private checkDup(res):any {
        let count = {};
        let sortedCount = [];

        res.forEach((i) => {count[i] = (count[i]||0) + 1;});
        for (let i in count) {
            sortedCount.push([i, count[i]]);
        }

        sortedCount = sortedCount.reverse(sortedCount.sort((a, b) => parseFloat(a[1]) > parseFloat(b[1]) ? 1 : -1));

        return sortedCount
    }
}

/**----------------------------------------------------
 * @String              playerName
 * @pocket              pokets
 * @constructs          Player.Class
 -----------------------------------------------------*/
class Player {
    playerName: string;
    pocket: any;

    constructor(playerName: string) {
      this.playerName = playerName;
      this.pocket = [];
    }
}


/* -----------------------------------------------------
UI Logic Below
 -----------------------------------------------------*/
$( document ).ready(function() {
    //using jquery ajax to retrive datasets.json file
    $.ajax({url: "/datasets.json",
        type: 'GET',
        dataType: "JSON",
        asynch: false,
        success: function(j) {
            if (j) {
                var dataSets = [];
                dataSets.push(j.dataSets);
                startGame(dataSets[0]);
            } else {
                alert("oops.... Something wrong while loading dataSets. 0.0")
            }
        }
    });

    function startGame(dataSets){
        let newTable = new Table(shuffle(dataSets));

        //Event handdler below
        $('#deal_pocket_btn').on('click',function(){
            newTable.deal("pocket");
            $(this).attr("disabled", "disabled").hide(()=> $('#deal_flop_btn').fadeIn());
            $(".pocket_round").html("Pocket");
        })

        $('#deal_flop_btn').on('click',function(){
            newTable.deal("flop");
            $(this).attr("disabled", "disabled").hide(()=> $('#deal_turn_btn').fadeIn());
            $(".table_round").html("Flop");
        })

        $('#deal_turn_btn').on('click',function(){
            newTable.deal("turn");
            $(this).attr("disabled", "disabled").hide(()=> $('#deal_river_btn').fadeIn());
            $(".table_round").html("Turn");
        })

        $('#deal_river_btn').on('click',function(){
            newTable.deal("river");
            console.log(newTable);
            $(this).attr("disabled", "disabled").hide(()=> $('#reset_btn').fadeIn());
            $(".table_round").html("River");
            let winHand = newTable.solveHand();

            if (winHand){
                let winHandRank = HandRank[winHand[1]];
                console.log(winHand);
                newTable.drawCards(winHand[0].wincards, "win");
                $(".win_round").html("Win Hand: <br>" + winHandRank);
            }
        })

        $('#reset_btn').on('click', function(){
            newTable.reset(shuffle(dataSets));
            console.log(newTable);
            $(this).hide(()=>{
                setTimeout(function(){
                    $('#deal_flop_btn, #deal_river_btn, #deal_turn_btn, #deal_pocket_btn').removeAttr("disabled").hide();
                    $('#deal_pocket_btn').removeAttr("disabled").fadeIn();
                    $('#deck_container, #pocket_container, #win_container, .round-title').empty();
                }, 800);

            })
        })
    }

    //shuffle dataSets array and return the first element
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array[0];
    }
});
