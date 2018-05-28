export interface ICampsite {
  name: string,
    id: string,
}

export function GetInterestedCampsites(): Array < ICampsite > {
  return [{
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
    {
      name: 'MORAINE PARK CAMPGROUND',
      id: '70943',
    },
    {
      name: 'GLACIER BASIN CAMPGROUND',
      id: '70942',
    }
  ];
}