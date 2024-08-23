// 확률에 따른 랜덤값 내놓기 (ex: 연속공격, 방어, 도망)
// 1 <= random <= 100
function getRandomProbability() {
  return Math.floor(Math.random() * 100 + 1);
}
// 최소 최대가 주어졌을 때 랜덤숫자 구하기 (ex: damage)
// min <= random <= max
export function getRandomNum(min, max) {
  return Number(Math.floor(Math.random() * (max - min) + min));
}

// player 레벨에 따른 명성
export function playerRank(level) {
  const rank = ['삼류', '이류', '일류', '절정', '초절정', '화경', '현경', '생사경'];
  return rank[parseInt(level / 3)] || rank[7];
}

// 확률 return boolean
export function randomPlay(probability) {
  const ranNum = getRandomProbability();

  if (ranNum >= 1 && ranNum <= probability) {
    return true;
  }
  return false;
}
