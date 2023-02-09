import { STATUS } from 'modules/dashboard/constant';

export const dataToPieChartConversion = (data) => {
  let arrkey: [string, number][] = Object.entries(data);
  arrkey = arrkey.filter(([key, value]) => key !== 'total');
  return arrkey.map(([key, value]) => {
    return { name: STATUS[key], value };
  });
};

export const dataToBarChart = (data) => {
  let arrkey: [string, {}][] = Object.entries(data);

  arrkey = arrkey.filter(([key, value]) => key !== 'total');
  return arrkey.map(([key, value]) => {
    let list = Object.entries(value);
    let statusObject = {};
    for (let i = 0; i < list.length; i++) {
      statusObject[STATUS[list[i][0]]] = list[i][1];
    }

    return { name: key.replace('_', ' '), ...statusObject };
  });
};
