import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { getRandomNum, playerRank, randomPlay } from './util.js';
import {Player, createPlayer} from './Creature/player.js';
import {Monster, createMonster} from './Creature/monster.js';

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
      logs.push(
        chalk.green(
          `[${choice}] 플레이어가 몬스터에게 ${player.realDamage} 만큼 데미지를 줬습니다.`,
        ),
      );
      player.state = 'fight';
      break;
    case 2:
      if (randomPlay(player.doubleAttackProbability)) {
        logs.push(chalk.green(`[${choice}] 플레이어가 연속 공격에 성공했습니다.`));
        player.doubleAttack(monster);
        player.attackDamage(monster, player.firstAttack);
        logs.push(
          chalk.green(
            `[${choice}] 플레이어가 몬스터에게 ${player.firstAttack} 만큼 데미지를 줬습니다.`,
          ),
        );
        player.attackDamage(monster, player.secondAttack);
        logs.push(
          chalk.green(
            `[${choice}] 플레이어가 몬스터에게 ${player.secondAttack} 만큼 데미지를 줬습니다.`,
          ),
        );
      } else {
        logs.push(chalk.red(`[${choice}] 플레이어가 연속 공격에 실패했습니다.`));
      }
      player.state = 'fight';
      break;
    case 3:
      if (randomPlay(player.defenseProbability)) {
        logs.push(chalk.red(`[${choice}] 플레이어가 방어에 성공했습니다.`));
        player.state = 'defense';
      } else {
        logs.push(chalk.red(`[${choice}] 플레이어가 방어에 실패했습니다.`));
        player.state = 'fight';
      }
      break;
    case 4:
      if (randomPlay(player.runAwayProbability)) {
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
  if (player.state != 'defense' && player.state != 'runAway') {
    monster.attack(player);
    logs.push(
      chalk.green(
        `[${choice}] 몬스터가 플레이어에게 ${monster.realDamage} 만큼 데미지를 줬습니다.`,
      ),
    );
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

    if (player.state != 'runAway') {
      console.clear();
      displayStatus(stage, player, monster);

      logs.forEach((log) => console.log(log));

      if (monster.hp <= 0) {
        console.log(chalk.white(`Level${monster.level} 몬스터 토벌에 성공했습니다!`));
        console.log(chalk.yellow(`플레이어가 경험치 ${monster.xp}만큼 획득 했습니다!`));
        player.getExp(monster.xp);
      } else if (player.hp <= 0) {
        console.log(chalk.red(`공략에 실패했습니다!`));
        console.log(chalk.red(`다시는 이 용사를 볼 수 없습니다!`));
        process.exit(0);
      }
    } else {
      break;
    }
  }
};

export async function startGame() {
  console.clear();
  const player = createPlayer();
  let stage = 1;

  while (stage <= 10) {
    const monster = createMonster(stage);
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건
    
    if (player.state === 'runAway') {
      console.log(chalk.green(`도망 성공!!`));
    }

    console.log(chalk.yellow('='.repeat(30)));
    console.log(chalk.green(` 1. 다음 스테이지 이동 \n`));
    console.log(chalk.green(` 2. 같은 스테이지 다른 몬스터 잡기 \n`));
    console.log(chalk.green(` 3. 이전 스테이지 이동 \n`));
    console.log(chalk.yellow('='.repeat(30)));

    const choice = readlineSync.question('당신의 선택은? ');

    switch (Number(choice)) {
      case 1:
        stage++;
        break;
      case 2:
        break;
      case 3:
        if (stage >= 2){
          stage--;
        }
        break;
      default:
        break;
    }
  }
}
