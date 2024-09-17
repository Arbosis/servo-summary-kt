import SummaryHTMLv1 from "./SummaryGenerators/SummaryV1";

let version = 'v1';

const setSummaryVersion = (newVersion) => {
  if (Object.keys(summaryFunctions).includes(newVersion)) {
    version = newVersion;
  } else {
    console.error(`Summary version '${newVersion}' is not supported`);
  }
};

const summaryFunctions = {
  v1: SummaryHTMLv1,
  v2: null, // TODO implement,
};

const generateSummaryHTML = (operatives, stratPloys, tacPloys) => {
  const summaryFunction = summaryFunctions[version];
  if (!summaryFunction) {
    console.error(`Summary version '${version}' is not supported`);
    return '';
  }

  return summaryFunction(operatives, stratPloys, tacPloys);
};

export default generateSummaryHTML;
