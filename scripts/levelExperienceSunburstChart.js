
import '../lib/highcharts.js';
import '../lib/sunburst.js';


let chart =
{
  height: '100%'
}

let credits =
{
  enabled: false
}

let title =
{
  style:
  {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: '26px',
    fontFamily: 'Times New Roman, Liberation Serif, serif'
  }
}

let tooltip =
{
  backgroundColor:
  {
    linearGradient: [0, 0, 0, 60],
    stops:
    [
      [0, '#FFFFFF'],
      [1, '#E0E0E0']
    ]
  },
  borderWidth: 1,
  borderColor: '#A0A0A0',
  headerFormat: '',
  pointFormat: 'Lv. <b>{point.name}</b>:<br><b>{point.value}</b> exp'
}

let plotOptions =
{
  series:
  {
    turboThreshold: 0
  }
}

Highcharts.setOptions(
{
  lang:
  {
    thousandsSep: ','
  }
});

/**
 * Extract data from levelExperienceData and fill the data list with sunburst chart slices.
 *
 * @param levelExperienceData Contains all the data for setting up the visualizations for a specified game
 * @return Data list with sunburst chart slices extracted from levelExperienceData
 */
function generateData(levelExperienceData)
{
  let data = [];
  
  // Inner sunburst chart slices, the level ranges
  for (let i = 0; i < levelExperienceData.sunburstChartConfigurations.levels.length; i++)
  {
    for (let j = 0; j < levelExperienceData.sunburstChartConfigurations.levels[i].parts.length; j++)
    {
      let start = levelExperienceData.sunburstChartConfigurations.levels[i].parts[j].start;
      let end = levelExperienceData.sunburstChartConfigurations.levels[i].parts[j].end;
      let dataEntry =
      {
        id: generateSunburstSectionId(start, end),
        parent: findParentId(levelExperienceData.sunburstChartConfigurations, i, start, end),
        name: start + '-' + end + ' [' + (end - start + 1) + ']'
      };
      data.push(dataEntry);
    }
  }
  
  // Most outer sunburst chart slices, the individual level
  for (let i = 0; i < levelExperienceData.data.length; i++)
  {
    if (!levelExperienceData.data[i].experienceToNextLevel)
    {
      console.log('No valid experienceToNextLevel for level: ' + levelExperienceData.data[i].level);
      continue;
    }
    let dataEntry =
    {
      id: levelExperienceData.data[i].level,
      parent: findParentId(levelExperienceData.sunburstChartConfigurations, levelExperienceData.sunburstChartConfigurations.levels.length, levelExperienceData.data[i].level, levelExperienceData.data[i].level),
      name: levelExperienceData.data[i].level,
      value: levelExperienceData.data[i].experienceToNextLevel
    };
    data.push(dataEntry);
  }
  
  return data;
}

/**
 * Extract data from levelExperienceData and fill the series data with sunburst data containing level and experienceToNextLevel slices for a specified game.
 *
 * @param levelExperienceData Contains all the data for setting up the visualizations for a specified game
 * @return Series data with sunburst data containing level and experienceToNextLevel slices
 */
function generateSeries(levelExperienceData)
{
  let series =
  [
    {
      type: 'sunburst',
      data: generateData(levelExperienceData),
      allowTraversingTree: true,
      cursor: 'pointer',
      borderWidth: null,
      dataLabels:
      {
        format: '{point.name}',
        filter:
        {
          property: 'innerArcLength',
          operator: '>',
          value: 16
        }
      },
      levels:
      [
        {
          level: 1,
          levelIsConstant: false,
          dataLabels:
          {
            filter:
            {
              property: 'outerArcLength',
              operator: '>',
              value: 64
            }
          },
          color: levelExperienceData.sunburstChartConfigurations.color
        },
        {
          level: 2,
          colorVariation:
          {
            key: 'brightness',
            to: -0.4
          }
        },
        {
          level: 3,
          colorVariation:
          {
            key: 'brightness',
            to: -0.4
          }
        },
        {
          level: 4,
          colorVariation:
          {
            key: 'brightness',
            to: -0.4
          }
        }
      ]
    }
  ]
  return series;
}

/**
 * Draw the level experienceToNextLevel sunburst graph for the specified game.
 *
 * @param chartHtmlContainerId HTML ID to draw chart at
 * @param levelExperienceData Contains all the data for setting up the visualizations for a specified game
 */
export function drawSunburstGraph(chartHtmlContainerId, levelExperienceData)
{
  // Splice in transparent for the center circle
  Highcharts.getOptions().colors.splice(0, 0, 'transparent');
  
  title.text = levelExperienceData.gameName + ' - Experience Needed For Next Level';
  
  let graphChart = Highcharts.chart(chartHtmlContainerId,
  {
    chart: chart,
    credits: credits,
    title: title,
    tooltip: tooltip,
    plotOptions: plotOptions,
    series: generateSeries(levelExperienceData)
  });
}

/**
 * Find the parent ID of the sunburst slice.
 *
 * @param sunburstChartConfigurations Contains the sunburst chart configurations data
 * @param currentLevel Current sunburst slice level
 * @param start Starting (experience) level of slice range
 * @param end Ending (experience) level of slice range
 * @return Parent ID of sunburst slice
 */
function findParentId(sunburstChartConfigurations, currentLevel, start, end)
{
  if (currentLevel === 0)
  {
    return '';
  }
  
  let parts = sunburstChartConfigurations.levels[currentLevel - 1].parts;
  for (let i = 0; i < parts.length; i++)
  {
    if (start >= parts[i].start && end <= parts[i].end)
    {
      return generateSunburstSectionId(parts[i].start, parts[i].end);
    }
  }
  
  console.warn('Cannot find parent ID for ' + start + '-' + end);
  return '';
}

/**
 * Find the section ID of the sunburst slice.
 *
 * @param start Starting (experience) level of slice range
 * @param end Ending (experience) level of slice range
 * @return Section ID of the sunburst slice
 */
function generateSunburstSectionId(start, end)
{
  return start + '-' + end;
}
