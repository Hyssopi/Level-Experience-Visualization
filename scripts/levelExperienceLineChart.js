
import '../lib/highcharts.js';


let chart =
{
  type: 'line',
  plotBorderWidth: 0,
  plotShadow: false,
  backgroundColor: '#DCDCDC',
  spacingTop: 10,
  spacingBottom: 10,
  zoomType: 'x',
  resetZoomButton:
  {
    position:
    {
      align: 'right',
      verticalAlign: 'top',
      x: -10,
      y: 10
    },
    relativeTo: 'chart',
    theme:
    {
      fill: 'white',
      stroke: 'silver',
      r: 10,
      states:
      {
        hover:
        {
          fill: '#41739D',
          style:
          {
            color: 'white'
          }
        }
      },
      style:
      {
        color: '#000000',
        fontWeight: 'normal',
        fontSize: '22px',
        fontFamily: 'Arial, Liberation Sans, sans-serif'
      }
    }
  },
  panning: true,
  panKey: 'ctrl'
}

let credits =
{
  enabled: false
}

let title =
{
  margin: 25,
  style:
  {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: '26px',
    fontFamily: 'Times New Roman, Liberation Serif, serif'
  }
}

let legend =
{
  enabled: false
};

let xAxis =
{
  type: 'linear',
  lineWidth: 1,
  lineColor: '#000000',
  gridLineWidth: 1,
  gridLineColor: '#C0C0C0',
  labels:
  {
    style:
    {
      color: '#000000',
      fontWeight: 'normal',
      fontSize: '14px',
      fontFamily: 'Arial, Liberation Sans, sans-serif'
    },
    overflow: 'justify'
  },
  allowDecimals: false,
  title:
  {
    text: 'Level',
    style:
    {
      color: '#000000',
      fontWeight: 'bold',
      fontSize: '16px',
      fontFamily: 'Arial, Liberation Sans, sans-serif'
    }
  },
  crosshair:
  {
    width: 2,
    color: 'gray'
  },
  min: 0
}

let yAxis =
{
  tickmarkPlacement: 'on',
  lineWidth: 1,
  lineColor: '#000000',
  gridLineWidth: 1,
  gridLineColor: '#C0C0C0',
  labels:
  {
    format: '{value:,.0f}',
    style:
    {
      color: '#000000',
      fontWeight: 'normal',
      fontSize: '14px',
      fontFamily: 'Arial, Liberation Sans, sans-serif'
    },
    overflow: 'justify'
  },
  title:
  {
    text: 'Experience',
    style:
    {
      color: '#000000',
      fontWeight: 'bold',
      fontSize: '16px',
      fontFamily: 'Arial, Liberation Sans, sans-serif'
    }
  },
  crosshair:
  {
    width: 2,
    color: 'gray'
  }
}

let subtitle =
{
  text: '<span >* Left click + drag to zoom in graph</span>'
        + '<br>'
        + '<span style="color: #000000;">* Hold [Ctrl] to pan with left mouse button</span>',
  style:
  {
    color: '#000000',
    fontWeight: 'normal',
    fontSize: '12px',
    fontFamily: 'Arial, Liberation Sans, sans-serif'
  },
  align: 'left',
  verticalAlign: 'top',
  useHTML: true
}

let tooltip =
{
  crosshairs: true,
  shared: true,
  backgroundColor:
  {
    linearGradient: [0, 0, 0, 60],
    stops:
    [
      [0, '#FFFFFF'],
      [1, '#E0E0E0']
    ]
  },
  borderWidth: 2,
  borderColor: '#A0A0A0'
}

let plotOptions =
{
  series:
  {
    turboThreshold: 0,
    states:
    {
      hover:
      {
        lineWidthPlus: 0
      }
    }
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
 * Extract data from levelExperienceData and fill the series data with levels and cumulativeExperiences for a specified game.
 *
 * @param levelExperienceData Contains all the data for setting up the visualizations for a specified game
 * @return Series data with levels and cumulativeExperiences extracted from levelExperienceData
 */
function generateSeries(levelExperienceData)
{
  let series = [];
  let seriesEntry =
  {
    name: 'EXP',
    color: levelExperienceData.lineChartConfigurations.lineColor,
    data: []
  }
  for (let i = 0; i < levelExperienceData.data.length; i++)
  {
    seriesEntry.data.push(
    {
      x: levelExperienceData.data[i].level,
      y: levelExperienceData.data[i].cumulativeExperience
    });
  }
  series.push(seriesEntry);
  
  // Sort the data points by level
  for (let i = 0; i < series.length; i++)
  {
    series[i].data.sort(function(seriesEntry1, seriesEntry2)
    {
      return seriesEntry1.x - seriesEntry2.x;
    });
  }
  
  return series;
}

/**
 * Draw the level cumulativeExperience line graph for the specified game.
 *
 * @param chartHtmlContainerId HTML ID to draw chart at
 * @param levelExperienceData Contains all the data for setting up the visualizations for a specified game
 */
export function drawLineGraph(chartHtmlContainerId, levelExperienceData)
{
  chart.backgroundColor =
  {
    linearGradient: [0, 0, 0, '100%'],
    stops:
    [
      [0, levelExperienceData.lineChartConfigurations.backgroundColor],
      [1, levelExperienceData.lineChartConfigurations.secondaryBackgroundColor]
    ]
  }
  title.text = levelExperienceData.gameName + ' - Cumulative Experience To Reach Level';
  
  let graphChart = Highcharts.chart(chartHtmlContainerId,
  {
    chart: chart,
    credits: credits,
    title: title,
    legend: legend,
    xAxis: xAxis,
    yAxis: yAxis,
    subtitle: subtitle,
    tooltip: tooltip,
    plotOptions: plotOptions,
    series: generateSeries(levelExperienceData)
  });
}
