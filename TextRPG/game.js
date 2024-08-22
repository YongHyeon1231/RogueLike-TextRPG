import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { getRandomNum, playerRank, randomPlay } from './util.js';

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
    this.realDamage = Math.max(0, this.getDamage() - target.armor);
    target.hp = Math.max(0, Number(target.hp - this.realDamage));
  }

  // 특정 데미지를 그냥 줄때
  attack(target, damage) {
    target.hp -= damage;
  }
}

class Player extends Creature {
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

class Monster extends Creature {
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
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n${'='.repeat(30)} Current Status ${'='.repeat(30)}`));
  console.log(
    chalk.gray(`| 현재 플레이어 명성 : ${playerRank(player.level)} Level : ${player.level} |`),
  );
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(
        `| 플레이어 정보 => 체력 : ${player.hp} 공격력 : ${player.minDamage}-${player.maxDamage} 방어도 : ${player.armor} |\n`,
      ) +
      chalk.redBright(
        `| 몬스터 정보 => 체력 : ${monster.hp} 공격력 : ${monster.minDamage}-${monster.maxDamage} 방어도 : ${monster.armor} |`,
      ),
  );
  console.log(chalk.magentaBright(`${'='.repeat(90)}\n`));
}

function playerPlay(choice, stage, player, monster) {
  const logs = [];
  
  switch (Number(choice)) {
    case 1:
      player.attack(monster);
      logs.push(chalk.green(`[${choice}] 플레이어가 몬스터에게 ${player.realDamage} 만큼 데미지를 줬습니다.`));
      player.state = 'fight';
      break;
    case 2:
      if (randomPlay(player.doubleAttackProbability)) {
        logs.push(chalk.green(`[${choice}] 플레이어가 연속 공격에 성공했습니다.`));
        player.doubleAttack(monster);
        player.attack(monster, player.firstAttack);
        logs.push(chalk.green(`[${choice}] 플레이어가 몬스터에게 ${player.firstAttack} 만큼 데미지를 줬습니다.`));
        player.attack(monster, player.secondAttack);
        logs.push(chalk.green(`[${choice}] 플레이어가 몬스터에게 ${player.secondAttack} 만큼 데미지를 줬습니다.`));
      } else {
        logs.push(chalk.red(`[${choice}] 플레이어가 연속 공격에 실패했습니다.`));
      }
      player.state = 'fight';
      break;
    case 3:
      if (randomPlay(player.defenseProbability)){
        logs.push(chalk.red(`[${choice}] 플레이어가 방어에 성공했습니다.`));
        player.state = 'defense'
      } else {
        logs.push(chalk.red(`[${choice}] 플레이어가 방어에 실패했습니다.`));
        player.state = 'fight'
      }
      break;
    case 4:
      if (randomPlay(player.runAwayProbability)){
        logs.push(chalk.red(`[${choice}] 플레이어가 도망치기에 성공했습니다.`));
        player.state = 'runAway';
      } else {
        logs.push(chalk.red(`[${choice}] 플레이어가 도망치기에 실패했습니다.`));
        player.state = 'idle';
      }
      break;
    default:
      logs.push(chalk.green(`[${choice}] 음? 키를 잘못 눌러 몬스터에게 공격받았습니다.`));
      player.state = 'fight';
      break;
  }
  // 방어상태 또는 도망간 상태가 아니라면 몬스터에게 맞아야 한다.
  if(player.state != 'defense' && player.state != 'runAway') {
    monster.attack(player);
    logs.push(chalk.green(`[${choice}] 몬스터가 플레이어에게 ${monster.realDamage} 만큼 데미지를 줬습니다.`));
  }

  return logs;
}

const battle = async (stage, player, monster) => {
  const logs = [];
  monster.setMonsterInfo(stage);

  while (player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 연속 공격(${player.doubleAttackProbability}%) 3. 방어한다(${player.defenseProbability}%) 4. 도망간다(${player.runAwayProbability}%)`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
    
    player.state = 'idle';

    playerPlay(choice, stage, player, monster).forEach((log) => logs.push(log));

    if(player.state != 'runAway') {
      console.clear();
      displayStatus(stage, player, monster);

      logs.forEach((log) => console.log(log));

      if (monster.hp <= 0) {
        console.log((chalk.white(`Level${monster.level} 몬스터 토벌에 성공했습니다!`)));
        console.log((chalk.yellow(`플레이어가 경험치 ${monster.xp}만큼 획득 했습니다!`)));
        player.getExp(monster.xp);
        console.log('여기까지는 들어옵니다.')
      } else if (player.hp <= 0) {
        console.log(chalk.red(`공략에 실패했습니다!`));
        console.log(chalk.red(`다시는 이 용사를 볼 수 없습니다!`));
      }
    }
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건

    stage++;
  }
}
