/**keys prod */
const APP_TOKEN_PUNTOS_PROD =
  'GBFLLAASYOSDJJLMQXXRQPVZFDWCRDNNHMISNPSBCXLKOEPAKQNWGNIRGFGHEXBUBEVXBSYAFWPTEKLBOWRAQQHTDRMHJKXEWRJJIRYRSMRKYONVUFTHFADKXCTKFRRU';
const APP_KEY_PUNTOS_PROD = 'vtexappkey-puntoscolombia-OTVZKK';

/** keys qa  */
const APP_TOKEN_PUNTOS_QA =
  'LZTPJSPVTOGAQQMTEHDSGINGSQHNCNDHQZEXTLVTERFKUJJQXZCZTOVCLNXSKCSFKYJQLOASMJOPDDMIGQPCLENCEBLFOCJBYZZVZSFJZKNKAFYIAOMTNQUGLGMJCUEJ';
const APP_KEY_PUNTOS_QA = 'vtexappkey-puntoscolombiaqa-GVBGOC';

interface Ikeys {
  APP_TOKEN: string;
  APP_KEY: string;
}

export const keys = (account: string): Ikeys => {
  let keys: Ikeys = {
    APP_KEY: '',
    APP_TOKEN: ''
  };

  switch (account) {
    case 'puntoscolombia':
      keys = {
        APP_TOKEN: APP_TOKEN_PUNTOS_PROD,
        APP_KEY: APP_KEY_PUNTOS_PROD
      };
      break;
    case 'puntoscolombiaqa':
      keys = {
        APP_TOKEN: APP_TOKEN_PUNTOS_QA,
        APP_KEY: APP_KEY_PUNTOS_QA
      };
      break;
  }

  return keys;
};
