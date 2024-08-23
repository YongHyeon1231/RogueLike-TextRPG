import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { getRandomNum, playerRank, randomPlay } from '../util.js';
import {Creature} from './creature.js';

export class Monster extends Creature {
    constructor() {
      // hp, maxHp, minDamage, maxDamage, armor, level
      super(10, 10, 10, 13, 1, 1);
      this.xp = 6;
  
      this.setMonsterInfo(1);
    }
  
    setMonsterInfo(stage) {
      this.level = stage;
      this.maxHp = 10 * this.level + (this.level > 1 ? getRandomNum(1, stage) * stage : 0);
      this.hp = this.maxHp;
      this.originDamage = 10 + (this.level > 1 ? getRandomNum(2, 4) * stage : 0);
      this.minDamage = this.originDamage;
      this.maxDamage = this.minDamage + (this.level > 1 ? getRandomNum(2, 4) * stage : 3);
      this.armor = this.armor + (this.level > 1 ? getRandomNum(1, 3) * stage : 0);
      this.xp = this.xp + 6 * (this.level > 1 ? getRandomNum(1, 3) * stage : 0);
    }
  }