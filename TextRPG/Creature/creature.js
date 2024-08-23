import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { getRandomNum, playerRank, randomPlay } from '../util.js';


class Creature {
    constructor(hp, maxHp, minDamage, maxDamage, armor, level) {
      this.hp = hp;
      this.maxHp = maxHp;
  
      this.originDamage = minDamage;
      this.damage = minDamage;
      this.realDamage = minDamage;
      this.minDamage = minDamage;
      this.maxDamage = maxDamage;
  
      this.armor = armor;
      this.level = level;
    }
  
    getDamage() {
      this.damage = getRandomNum(this.minDamage, this.maxDamage);
      return this.damage;
    }
  
    // 타겟의 방어도까지 계산해서 데미지 계산
    attack(target) {
      this.realDamage = Math.max(0, Number(this.getDamage() - target.armor));
      target.hp = Math.max(0, Number(target.hp - this.realDamage));
    }
  
    // 특정 데미지를 그냥 줄때
    attackDamage(target, damage) {
      target.hp -= damage;
    }
  }