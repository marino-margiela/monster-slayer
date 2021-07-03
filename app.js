function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        return {
            monsterHealth: 100,
            playerHealth: 100,
            specialAttackRoundCounter: 0,
            healRoundCounter: 0,
            winner: null,
            logMessages: []
        };
    },
    computed: {
        monsterBarStyles() {
            if (this.monsterHealth < 0) {
                return { width: '0%' };
            }
            return { width: this.monsterHealth + '%' };
        },
        playerBarStyles() {
            if (this.playerHealth < 0) {
                return { width: '0%' };
            }
            return { width: this.playerHealth + '%' };
        },
        mayUseSpecialAttack() {
            return this.specialAttackRoundCounter % 3 !== 0
        },
        mayUseHeal() {
            return this.healRoundCounter % 3 !== 0
        }
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                this.winner = 'draw';
            }
            else if (this.monsterHealth <= 0) {
                this.winner = 'player';
            }
            else if (this.playerHealth <= 0) {
                this.winner = 'monster';
            }
        }
    },
    methods: {
        startGame() {
            this.monsterHealth = 100,
            this.playerHealth = 100,
            this.specialAttackRoundCounter = 0,
            this.healRoundCounter = 0,
            this.winner = null,
            this.logMessages = []
        },
        attackMonster() {
            if (this.mayUseSpecialAttack) {
                this.specialAttackRoundCounter++;
            }
            if (this.mayUseHeal) {
                this.healRoundCounter++;
            }
            const attackValue = getRandomValue(5, 12);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer();
        },
        attackPlayer() {
            const attackValue = getRandomValue(8, 15);
            this.playerHealth -= attackValue;
            this.addLogMessage('monster', 'attack', attackValue);
        },
        specialAttackMonster() {
            if (this.mayUseHeal) {
                this.healRoundCounter++;
            }
            this.specialAttackRoundCounter++;
            const attackValue = getRandomValue(10, 25);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer();
        },
        healPlayer() {
            if (this.mayUseSpecialAttack) {
                this.specialAttackRoundCounter++;
            }
            this.healRoundCounter++;
            const healValue = getRandomValue(8, 20);
            if (this.playerHealth + healValue > 100) {
                this.playerHealt = 100;
            }
            else {
                this.playerHealth += healValue;
            }
            this.addLogMessage('player', 'heal', healValue);
            this.attackPlayer();
        },
        surrender() {
            this.winner = 'monster';
        },
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });
        }
    }
});

app.mount('#game');