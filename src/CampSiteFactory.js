/*@flow*/

'strict'

export type Campsite = {
  name: string,
  id: string,
}

function getInterestedCampsites(): Array<Campsite> {
  return [
    {
      name: 'LOWER PINES',
      id: '70928',

  },
    {
      name: 'NORTH PINES',
      id: '70927',
    },
    {
      name: 'UPPER PINES',
      id: '70925',
    },
    {
      name: 'TUOLUMNE MEADOWS',
      id: '70926',
    },
    {
      name: 'WAWONA',
      id: '70924',
    },
  ];
}

module.exports.getInterestedCampsites = getInterestedCampsites;
