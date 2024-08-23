import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { getRandomNum, playerRank, randomPlay } from '../util.js';
import { Creature } from './creature.js';

export class Player extends Creature {
  constructor() {
    // hp, maxHp, minDamage, maxDamage, armor, level
    super(100, 100000, 10, 15, 5, 1);

    this.damageModify();

    this.firstAttack = 0;
    this.secondAttack = 0;

    this.defenseProbability = 80;
    this.doubleAttackProbability = 25;
    this.runAwayProbability = 10;

    this.exp = 0;
    this.maxExp = 10;

    this.state = 'idle';
  }

  getHeal() {
    this.hp += 25 * this.level;
  }

  doubleAttack(target) {
    this.firstAttack = Math.max(this.getDamage() - target.armor);
    this.secondAttack = Math.max(this.getDamage() - target.armor);
  }

  damageModify() {
    this.minDamage = this.originDamage;
    this.maxDamage += getRandomNum(5, 10);
  }

  getExp(xp) {
    this.exp += xp;

    while (this.exp >= this.maxExp) {
      let booleanValue = true;
      let tempLevel = this.level;
      this.level += 1;
      this.exp -= this.maxExp;
      this.maxExp = Math.floor(this.maxExp * 1.5);

      console.log(
        chalk.green(`| 플레이어의 레벨이 ${tempLevel} => ${this.level} 이 되었습니다 !!! |`),
      );
      console.log(chalk.green(`${'='.repeat(30)} 증가할 능력치를 선택해주세요. ${'='.repeat(30)}`));
      console.log(chalk.magenta('='.repeat(90)));
      console.log(
        chalk.white(
          `| 1. 공격력 +5, 최대공격력 +5~10   2. 체력 +25*level   3. 연속 공격 확률 +5~10%   4. 방어도 +5~10   5. 방어확률 +10%   6. 도망 가기 확률 +5~10% |`,
        ),
      );
      console.log(chalk.magenta('='.repeat(90)));

      while (booleanValue) {
        const choice = readlineSync.question('당신의 선택은? ');

        switch (Number(choice)) {
          case 1:
            let tempDamage = this.maxDamage;
            this.originDamage += 5;
            this.damageModify();
            console.log(chalk.white(`플레이어의 공격력이 ${this.minDamage}로 증가하였습니다.`));
            console.log(
              chalk.white(
                `플레이어의 최대 공격력이 ${tempDamage} => ${this.maxDamage}로 증가하였습니다.`,
              ),
            );
            booleanValue = false;
            break;
          case 2:
            this.hp += 25 * this.level;
            console.log(chalk.white(`플레이어의 체력이 ${this.hp}가 되었습니다.`));
            booleanValue = false;
            break;
          case 3:
            this.doubleAttackProbability += getRandomNum(5, 10);
            console.log(
              chalk.white(
                `플레이어의 연속 공격 확률이 ${this.doubleAttackProbability}%가 되었습니다.`,
              ),
            );
            booleanValue = false;
            break;
          case 4:
            this.armor += getRandomNum(5, 10);
            console.log(chalk.white(`플레이어의 방어도가 ${this.armor}가 되었습니다.`));
            booleanValue = false;
            break;
          case 5:
            if (this.defenseProbability >= 100) {
              console.log(
                chalk.white(`이미 플레이어의 방어확률이 ${this.defenseProbability}%가 되었습니다.`),
              );
            } else {
              this.defenseProbability += 10;
              console.log(
                chalk.white(`플레이어의 방어확률이 ${this.defenseProbability}%가 되었습니다.`),
              );
              booleanValue = false;
            }
            break;
          case 6:
            this.runAwayProbability += getRandomNum(5, 10);
            console.log(
              chalk.white(`플레이어의 도망칠 확률이 ${this.runAwayProbability}%가 되었습니다.`),
            );
            booleanValue = false;
            break;
          default:
            console.log(chalk.red('올바른 숫자를 눌러주세요! '));
            break;
        }
      }
    }
  }
}

export function createPlayer(){
  return new Player();
}
