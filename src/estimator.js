// impact input data for day, week and month
const impactInfectionsByRequestedTime = (period, time) => {
  if (period === 'days') {
    return (2 ** Math.trunc(time / 3));
  }
  if (period === 'weeks') {
    return (2 ** Math.trunc((time * 7) / 3));
  }
  if (period === 'months') {
    return (2 ** Math.trunc((time * 30) / 3));
  }
  return 0;
};

const handleDollarInFlight = (period, time, data) => {
  if (period === 'days') {
    return Math.trunc(data / time);
  }
  if (period === 'weeks') {
    return Math.floor(data / (time * 7));
  }
  if (period === 'months') {
    return Math.trunc(data / (time * 30));
  }
  return 0;
};

const covid19ImpactEstimator = (data) => {
//   const requestTime = 2 ** Math.floor(data.timeToElapse / 3);
  const requestTime = impactInfectionsByRequestedTime(data.periodType, data.timeToElapse);
  // const avgIncome = (data.region.avgDailyIncomePopulation * (65 / 100));
  const dollarsIncome = data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD;
  const totalBed = data.totalHospitalBeds * (35 / 100);
  //   step 1 for impact computation
  const impact = {
    currentlyInfected: data.reportedCases * 10
  };
  //    step 2  for impact computation
  impact.infectionsByRequestedTime = impact.currentlyInfected * requestTime;

  //   step 3 for impact computation
  impact.severeCasesByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * (15 / 100));

  //    step 4 for impact computation
  impact.hospitalBedsByRequestedTime = Math.trunc(totalBed - impact.severeCasesByRequestedTime);

  //    step 5 for impact computation
  impact.casesForICUByRequestedTime = impact.infectionsByRequestedTime * (5 / 100);

  //    step 6 for impact computation
  const infectionImpactTime = Math.trunc(
    impact.infectionsByRequestedTime * (2 / 100)
  );
  impact.casesForVentilatorsByRequestedTime = infectionImpactTime;

  //    step 7 for impact computation
  const dollarsFlight = (impact.infectionsByRequestedTime * dollarsIncome);
  impact.dollarsInFlight = handleDollarInFlight(data.periodType, data.timeToElapse, dollarsFlight);

  //    step 1 for severeImpact computation
  const severeImpact = {
    currentlyInfected: data.reportedCases * 50
  };
  //    step 2  for severeImpact computation
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * requestTime;

  //   step 3 for severeImpact computation
  const severeCaseTime = Math.trunc(severeImpact.infectionsByRequestedTime * (15 / 100));
  severeImpact.severeCasesByRequestedTime = severeCaseTime;

  //    step 4 for severeImpact computation
  const bedsTime = Math.trunc(totalBed - severeImpact.severeCasesByRequestedTime);
  severeImpact.hospitalBedsByRequestedTime = bedsTime;

  //    step 5 for severeImpact computation
  const icuTime = Math.trunc(severeImpact.infectionsByRequestedTime * (5 / 100));
  severeImpact.casesForICUByRequestedTime = icuTime;

  //    step 6 for severeImpact computation
  const infectionImpact = Math.trunc(
    severeImpact.infectionsByRequestedTime * (2 / 100)
  );
  severeImpact.casesForVentilatorsByRequestedTime = infectionImpact;

  //    step 7 for severeImpact computation
  const dFlight = (severeImpact.infectionsByRequestedTime * dollarsIncome);
  severeImpact.dollarsInFlight = handleDollarInFlight(data.periodType, data.timeToElapse, dFlight);

  return { data, impact, severeImpact };
};

export default covid19ImpactEstimator;
