"use strict";

/** ======================================================================
==========================================================================
 projectName              Taxas Hold 'em Analyzer
 Developed By             Liang Li
 Description              Analize 7 cards to 5 and return the best hand
 =========================================================================
 ========================================================================*/
var HandRank;
(function (HandRank) {
    HandRank[HandRank["STRAIGHT_FLUSH"] = 0] = "STRAIGHT_FLUSH";
    HandRank[HandRank["FOUR_OF_A_KIND"] = 1] = "FOUR_OF_A_KIND";
    HandRank[HandRank["FULL_HOUSE"] = 2] = "FULL_HOUSE";
    HandRank[HandRank["FLUSH"] = 3] = "FLUSH";
    HandRank[HandRank["STRAIGHT"] = 4] = "STRAIGHT";
    HandRank[HandRank["THREE_OF_A_KIND"] = 5] = "THREE_OF_A_KIND";
    HandRank[HandRank["TWO_PAIRS"] = 6] = "TWO_PAIRS";
    HandRank[HandRank["ONE_PAIR"] = 7] = "ONE_PAIR";
    HandRank[HandRank["HIGH_CARD"] = 8] = "HIGH_CARD";
})(HandRank || (HandRank = {}));
/**----------------------------------------------------
 * @String                  playerName
 * @Array                   cards
 * @constructs              Table.Class
 -----------------------------------------------------*/
var Table = /** @class */function () {
    function Table(deck) {
        this.deck = deck;
        this.cards = [];
        this.player = new Player("LL");
        this._BUTTONLOCK = false;
        this.hand = this.deck.pocket.concat(this.deck.flop, this.deck.turn, this.deck.river);
    }
    /**
     * reset game acting like constructor functtion
     * empty deck, player on the table, hand array and cards array
     */
    Table.prototype.reset = function (deck) {
        this.deck = deck;
        this.cards = [];
        this.player = new Player("LL");
        this.hand = this.deck.pocket.concat(this.deck.flop, this.deck.turn, this.deck.river);
        this._BUTTONLOCK = false;
    };
    /**
     * deal pocket to Player
     * deal flop, turn and river to Table
     */
    Table.prototype.deal = function (dealRound) {
        if (!this._BUTTONLOCK) this._BUTTONLOCK = false;
        if (dealRound == "pocket") {
            this.player.pocket = this.player.pocket.concat(this.deck[dealRound]);
            this.drawCards(this.player.pocket, dealRound);
        } else if (dealRound == "flop") {
            this.cards = this.cards.concat(this.deck[dealRound]);
            var drawCards = [];
            drawCards = drawCards.concat(this.deck[dealRound]);
            this.drawCards(drawCards, "deck");
        } else if (dealRound == "turn") {
            this.cards = this.cards.concat(this.deck[dealRound]);
            var drawCards = [];
            drawCards = drawCards.concat(this.deck[dealRound]);
            this.drawCards(drawCards, "deck");
        } else {
            this.cards = this.cards.concat(this.deck[dealRound]);
            var drawCards = [];
            drawCards = drawCards.concat(this.deck[dealRound]);
            this.drawCards(drawCards, "deck");
        }
        this._BUTTONLOCK = true;
    };
    /**
     * render pocket, flop, turn, river and winning hand cards
     */
    Table.prototype.drawCards = function (cards, type) {
        var _loop_1 = function _loop_1(card) {
            var suit = cards[card].suit;
            var value = cards[card].value;
            if (suit == "h") {
                var color = "red",
                    text = "♥";
            } else if (suit == "d") {
                var color = "red",
                    text = "♦";
            } else if (suit == "s") {
                var color = "black",
                    text = "♠";
            } else {
                var color = "black",
                    text = "♣";
            }
            var cardElement = '<div class="grid-item"><div class="top-left" style="color:' + color + '">' + value + '<br><div style="color:' + color + '">' + text + '</div></div><div></div><div></div><div></div><div class="middle"></div><div></div><div></div><div></div><div class="bottom-right">' + value + '<br><div style="color:' + color + '">' + text + '</div></div></div></div>';
            setTimeout(function () {
                $("#" + type + "_container").append(cardElement).fadeIn('slow');
            }, 500);
        };
        for (var card in cards) {
            _loop_1(card);
        }
    };
    /**
     * solve hand cards
     * return a winning hand cards array
     */
    Table.prototype.solveHand = function () {
        if (!this._BUTTONLOCK) this._BUTTONLOCK = false;
        var winhand = {},
            handSuits = [],
            handRanks = [],
            hand = this.hand;
        for (var i in hand) {
            handSuits.push(hand[i].suit);
            handRanks.push(hand[i].rank);
        }
        if (winhand.wincards = this.isStraightFlush(handSuits)) {
            return [winhand, HandRank.STRAIGHT_FLUSH];
        } else if (winhand.wincards = this.isFourOfAKind(handRanks)) {
            return [winhand, HandRank.FOUR_OF_A_KIND];
        } else if (winhand.wincards = this.isFullHouse(handRanks)) {
            return [winhand, HandRank.FULL_HOUSE];
        } else if (winhand.wincards = this.isFlush(handSuits)) {
            return [winhand, HandRank.FLUSH];
        } else if (winhand.wincards = this.isStraight(handRanks)) {
            return [winhand, HandRank.STRAIGHT];
        } else if (winhand.wincards = this.isThreeOfAKind(handRanks)) {
            return [winhand, HandRank.THREE_OF_A_KIND];
        } else if (winhand.wincards = this.isDoublePair(handRanks)) {
            return [winhand, HandRank.TWO_PAIRS];
        } else if (winhand.wincards = this.isPair(handRanks)) {
            return [winhand, HandRank.ONE_PAIR];
        } else {
            winhand.wincards = hand.sort(function (a, b) {
                return parseFloat(a.rank) - parseFloat(b.rank);
            }).reverse().slice(0, 5);
            return [winhand, HandRank.HIGH_CARD];
        }
        this._BUTTONLOCK = true;
    };
    /**
     * evaluate hand cards to see if its straightFlush
     * check if hand cards is flush and straight
     * return winCards[] or undefined.
     */
    Table.prototype.isStraightFlush = function (suit) {
        var flush = this.isFlush(suit);
        var straightFlush;
        if (flush) {
            straightFlush = this.isStraight(flush);
        }
        return straightFlush;
    };
    /**
     * evaluate hand cards to see if its Flush
     * check duplicate of cards suit
     * return winCards[] or undefined.
     */
    Table.prototype.isFlush = function (suits) {
        var sortedDupCount = this.checkDup(suits);
        var winCards = [];
        var cards = this.hand;
        var flush = cards.filter(function (card) {
            return card.suit == sortedDupCount[0][0];
        });
        if (sortedDupCount[0][1] == 5) {
            winCards = flush.sort(function (a, b) {
                return parseFloat(a.rank) - parseFloat(b.rank);
            });
            return winCards;
        } else if (sortedDupCount[0][1] > 5) {
            var winCards_1 = flush.sort(function (a, b) {
                return parseFloat(a.rank) - parseFloat(b.rank);
            });
            winCards_1 = winCards_1.reverse();
            return winCards_1.slice(0, 5);
        }
    };
    /**
     * evaluate hand cards to see if its Straight
     * loop through hand cards array and push consecutives to consecutives[]
     * return consecutives[] if its length is not less than 5 or undefined.
     */
    Table.prototype.isStraight = function (ranks) {
        var consecutives = [];
        var aceIndex = this.hasRank(ranks, 14);
        if (aceIndex) consecutives.push(ranks[aceIndex]);
        for (var i = 2; i < 15; i++) {
            var cardIndex = this.hasRank(ranks, i);
            if (cardIndex != null) {
                consecutives.push(ranks[cardIndex]);
            } else {
                consecutives = [];
            }
            if (consecutives.length >= 5) {
                var nextCards = ranks[this.hasRank(ranks, i + 1)];
                if (nextCards && nextCards.length === 0) {
                    break;
                }
            }
        }
        if (consecutives.length >= 5) return consecutives.slice(0, 5);
    };
    /**
     * evaluate hand cards to see if its Four Of A Kind
     * check duplicate of cards rank
     * return hightest winCards[] or undefined.
     */
    Table.prototype.isFourOfAKind = function (ranks) {
        var sortedDupCount = this.checkDup(ranks);
        var winCards = [];
        var cards = this.hand;
        console.log(sortedDupCount);
        if (sortedDupCount[0][1] == 4) {
            winCards = winCards.concat(cards.filter(function (card) {
                return card.rank == sortedDupCount[0][0];
            }));
            winCards.forEach(function (f) {
                return cards.splice(cards.findIndex(function (e) {
                    return e.rank === f.rank;
                }), 1);
            });
            cards = cards.sort(function (a, b) {
                return parseFloat(a.rank) - parseFloat(b.rank);
            });
            winCards = winCards.concat(cards.reverse());
            return winCards.slice(0, 5);
        }
    };
    /**
     * evaluate hand cards to see if its Full House
     * check duplicate of cards suit
     * return hightest winCards[] or undefined.
     */
    Table.prototype.isFullHouse = function (ranks) {
        var sortedDupCount = this.checkDup(ranks);
        var winCards = [];
        var cards = this.hand;
        if (sortedDupCount[0][1] == 3 && sortedDupCount[1][1] == 3 && sortedDupCount[2][1] == 1) {
            if (parseFloat(sortedDupCount[0][0]) > parseFloat(sortedDupCount[1][0])) {
                winCards = winCards.concat(cards.filter(function (card) {
                    return card.rank == sortedDupCount[0][0];
                }), cards.filter(function (card) {
                    return card.rank == sortedDupCount[1][0];
                }));
            } else {
                winCards = winCards.concat(cards.filter(function (card) {
                    return card.rank == sortedDupCount[1][0];
                }), cards.filter(function (card) {
                    return card.rank == sortedDupCount[0][0];
                }));
            }
            console.log(winCards);
            return winCards.slice(0, 5);
        } else if (sortedDupCount[0][1] == 3 && sortedDupCount[1][1] == 2 && sortedDupCount[2][1] == 2) {
            if (parseFloat(sortedDupCount[2][0]) > parseFloat(sortedDupCount[1][0])) {
                winCards = winCards.concat(cards.filter(function (card) {
                    return card.rank == sortedDupCount[0][0];
                }), cards.filter(function (card) {
                    return card.rank == sortedDupCount[2][0];
                }));
            } else {
                winCards = winCards.concat(cards.filter(function (card) {
                    return card.rank == sortedDupCount[0][0];
                }), cards.filter(function (card) {
                    return card.rank == sortedDupCount[1][0];
                }));
            }
            return winCards.slice(0, 5);
        } else if (sortedDupCount[0][1] == 3 && sortedDupCount[1][1] == 2 && sortedDupCount[2][1] == 1) {
            winCards = winCards.concat(cards.filter(function (card) {
                return card.rank == sortedDupCount[0][0];
            }), cards.filter(function (card) {
                return card.rank == sortedDupCount[1][0];
            }));
            return winCards.slice(0, 5);
        }
    };
    /**
     * evaluate hand cards to see if its Three of a Kind
     * check duplicate of cards suit
     * return hightest winCards[] or undefined.
     */
    Table.prototype.isThreeOfAKind = function (ranks) {
        var sortedDupCount = this.checkDup(ranks);
        var winCards = [];
        var cards = this.hand;
        if (sortedDupCount[0][1] == 3 && sortedDupCount[1][1] == 1) {
            winCards = winCards.concat(cards.filter(function (card) {
                return card.rank == sortedDupCount[0][0];
            }));
            winCards.forEach(function (f) {
                return cards.splice(cards.findIndex(function (e) {
                    return e.rank === f.rank;
                }), 1);
            });
            cards = cards.sort(function (a, b) {
                return parseFloat(a.rank) - parseFloat(b.rank);
            });
            winCards = winCards.concat(cards.reverse());
            return winCards.slice(0, 5);
        }
    };
    /**
     * evaluate hand cards to see if its Double Plirs
     * check duplicate of cards suit
     * return hightest winCards[] or undefined.
     */
    Table.prototype.isDoublePair = function (ranks) {
        var sortedDupCount = this.checkDup(ranks);
        var winCards = [];
        var cards = this.hand;
        //check to see if full house has two pairs or one pair
        if (sortedDupCount[0][1] == 2 && sortedDupCount[1][1] == 2 && sortedDupCount[2][1] == 1) {
            winCards = winCards.concat(cards.filter(function (card) {
                return card.rank == sortedDupCount[0][0];
            }), cards.filter(function (card) {
                return card.rank == sortedDupCount[1][0];
            }));
            winCards.forEach(function (f) {
                return cards.splice(cards.findIndex(function (e) {
                    return e.rank === f.rank;
                }), 1);
            });
            cards = cards.sort(function (a, b) {
                return parseFloat(a.rank) - parseFloat(b.rank);
            });
            winCards = winCards.concat(cards.reverse());
            return winCards.slice(0, 5);
        } else if (sortedDupCount[0][1] == 2 && sortedDupCount[1][1] == 2 && sortedDupCount[2][1] > 1) {
            winCards = winCards.concat(cards.filter(function (card) {
                return card.rank == sortedDupCount[0][0];
            }), cards.filter(function (card) {
                return card.rank == sortedDupCount[1][0];
            }), cards.filter(function (card) {
                return card.rank == sortedDupCount[2][0];
            }));
            winCards = winCards.sort(function (a, b) {
                return parseFloat(a.rank) - parseFloat(b.rank);
            }).reverse();
            return winCards.slice(0, 5);
        }
    };
    /**
     * evaluate hand cards to see if its Double Plirs
     * check duplicate of cards suit
     * return hightest winCards[] or undefined.
     */
    Table.prototype.isPair = function (ranks) {
        var sortedDupCount = this.checkDup(ranks);
        var winCards = [];
        var cards = this.hand;
        if (sortedDupCount[0][1] == 2 && sortedDupCount[1][1] == 1) {
            winCards = winCards.concat(cards.filter(function (card) {
                return card.rank == sortedDupCount[0][0];
            }));
            winCards.forEach(function (f) {
                return cards.splice(cards.findIndex(function (e) {
                    return e.rank === f.rank;
                }), 1);
            });
            cards = cards.sort(function (a, b) {
                return parseFloat(a.rank) - parseFloat(b.rank);
            });
            winCards = winCards.concat(cards.reverse());
            return winCards.slice(0, 5);
        }
    };
    /**
     * loop hand cards and find the index of a card with a perticular rank
     * return card index
     */
    Table.prototype.hasRank = function (hand, rank) {
        var index = null;
        hand.forEach(function (key) {
            if (key.rank == rank) index = hand.indexOf(key);
        });
        return index;
    };
    /**
     * check card suit duplicates or card rank
     * return an sortedCount[] stroring duplicates
     */
    Table.prototype.checkDup = function (res) {
        var count = {};
        var sortedCount = [];
        res.forEach(function (i) {
            count[i] = (count[i] || 0) + 1;
        });
        for (var i in count) {
            sortedCount.push([i, count[i]]);
        }
        sortedCount = sortedCount.reverse(sortedCount.sort(function (a, b) {
            return parseFloat(a[1]) > parseFloat(b[1]) ? 1 : -1;
        }));
        return sortedCount;
    };
    return Table;
}();
/**----------------------------------------------------
 * @String              playerName
 * @pocket              pokets
 * @constructs          Player.Class
 -----------------------------------------------------*/
var Player = /** @class */function () {
    function Player(playerName) {
        this.playerName = playerName;
        this.pocket = [];
    }
    return Player;
}();
/* -----------------------------------------------------
UI Logic Below
 -----------------------------------------------------*/
$(document).ready(function () {
    //using jquery ajax to retrive datasets.json file
    $.ajax({ url: "/datasets.json",
        type: 'GET',
        dataType: "JSON",
        asynch: false,
        success: function success(j) {
            if (j) {
                var dataSets = [];
                dataSets.push(j.dataSets);
                startGame(dataSets[0]);
            } else {
                alert("oops.... Something wrong while loading dataSets. 0.0");
            }
        }
    });
    function startGame(dataSets) {
        var newTable = new Table(shuffle(dataSets));
        //Event handdler below
        $('#deal_pocket_btn').on('click', function () {
            newTable.deal("pocket");
            $(this).attr("disabled", "disabled").hide(function () {
                return $('#deal_flop_btn').fadeIn();
            });
            $(".pocket_round").html("Pocket");
        });
        $('#deal_flop_btn').on('click', function () {
            newTable.deal("flop");
            $(this).attr("disabled", "disabled").hide(function () {
                return $('#deal_turn_btn').fadeIn();
            });
            $(".table_round").html("Flop");
        });
        $('#deal_turn_btn').on('click', function () {
            newTable.deal("turn");
            $(this).attr("disabled", "disabled").hide(function () {
                return $('#deal_river_btn').fadeIn();
            });
            $(".table_round").html("Turn");
        });
        $('#deal_river_btn').on('click', function () {
            newTable.deal("river");
            console.log(newTable);
            $(this).attr("disabled", "disabled").hide(function () {
                return $('#reset_btn').fadeIn();
            });
            $(".table_round").html("River");
            var winHand = newTable.solveHand();
            if (winHand) {
                var winHandRank = HandRank[winHand[1]];
                console.log(winHand);
                newTable.drawCards(winHand[0].wincards, "win");
                $(".win_round").html("Win Hand: <br>" + winHandRank);
            }
        });
        $('#reset_btn').on('click', function () {
            newTable.reset(shuffle(dataSets));
            console.log(newTable);
            $(this).hide(function () {
                setTimeout(function () {
                    $('#deal_flop_btn, #deal_river_btn, #deal_turn_btn, #deal_pocket_btn').removeAttr("disabled").hide();
                    $('#deal_pocket_btn').removeAttr("disabled").fadeIn();
                    $('#deck_container, #pocket_container, #win_container, .round-title').empty();
                }, 800);
            });
        });
    }
    //shuffle dataSets array and return the first element
    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;
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
