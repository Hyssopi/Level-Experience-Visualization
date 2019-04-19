
import * as utilities from '../util/utilities.js';


/**
 * Generates HTML for level experience data table for an implied given game.
 *
 * @param levelExperienceDataData Raw data containing cumulativeExperiences and experienceToNextLevels at its respective levels
 * @return HTML code to generate level experience data table
 */
export default function(levelExperienceDataData)
{
  let html = '';
  
  html += '<table align="center" style="border-collapse: collapse;">';
  
  html += '<thead>';
  html += generateTableHeader();
  html += '</thead>';
  
  html += '<tbody class="hoverRowHighlight">';
  html += generateTableRows(levelExperienceDataData);
  html += '</tbody>';
  
  html += '<thead>';
  html += generateTableFooter();
  html += '</thead>';
  
  html += '</table>';
  
  return html;
}

/**
 * Generates HTML for level experience data table headers.
 *
 * @return HTML code to generate level experience data table headers
 */
function generateTableHeader()
{
  return `
    <tr>
      <th rowspan="2">Level</th>
      <th rowspan="2">Cumulative Experience</th>
      <th colspan="3">Experience to Next Level</th>
    </tr>
    <tr style="border-bottom: 4px solid black;">
      <th>Experience to Next Level</th>
      <th>% Difference From<br>Last Level</th>
      <th>% of Max Level<br>Experience</th>
    </tr>
  `;
}

/**
 * Generates HTML for level experience data table rows which contains all the level and experience data.
 *
 * @param data Raw data containing cumulativeExperiences and experienceToNextLevels at its respective levels
 * @return HTML code to generate level experience data table rows
 */
function generateTableRows(data)
{
  let lowestCumulativeExperience = Number.MAX_SAFE_INTEGER;
  let highestCumulativeExperience = Number.MIN_SAFE_INTEGER;
  
  let lowestExperienceToNextLevel = Number.MAX_SAFE_INTEGER;
  let highestExperienceToNextLevel = Number.MIN_SAFE_INTEGER;
  
  let experienceToNextLevelPercentageDifferences = [];
  let lowestExperienceToNextLevelPercentageDifferences = Number.MAX_SAFE_INTEGER;
  let highestExperienceToNextLevelPercentageDifferences = Number.MIN_SAFE_INTEGER;
  
  for (let i = 0; i < data.length; i++)
  {
    // Finding the lowest/highest cumulativeExperience
    if (utilities.isNumeric(data[i].cumulativeExperience) && data[i].cumulativeExperience < lowestCumulativeExperience)
    {
      lowestCumulativeExperience = data[i].cumulativeExperience;
    }
    if (utilities.isNumeric(data[i].cumulativeExperience) && data[i].cumulativeExperience > highestCumulativeExperience)
    {
      highestCumulativeExperience = data[i].cumulativeExperience;
    }
    
    // Finding the lowest/highest experienceToNextLevel
    if (utilities.isNumeric(data[i].experienceToNextLevel) && data[i].experienceToNextLevel < lowestExperienceToNextLevel)
    {
      lowestExperienceToNextLevel = data[i].experienceToNextLevel;
    }
    if (utilities.isNumeric(data[i].experienceToNextLevel) && data[i].experienceToNextLevel > highestExperienceToNextLevel)
    {
      highestExperienceToNextLevel = data[i].experienceToNextLevel;
    }
    
    // Calculating the experienceToNextLevelPercentageDifferences and also finding its lowest/highest
    let experienceToNextLevelPercentageDifference = '-';
    if (data[i] && data[i - 1] && utilities.isNumeric(data[i].experienceToNextLevel) && utilities.isNumeric(data[i - 1].experienceToNextLevel))
    {
      experienceToNextLevelPercentageDifference = ((data[i].experienceToNextLevel / data[i - 1].experienceToNextLevel) - 1.0) * 100;
      
      if (experienceToNextLevelPercentageDifference < lowestExperienceToNextLevelPercentageDifferences)
      {
        lowestExperienceToNextLevelPercentageDifferences = experienceToNextLevelPercentageDifference;
      }
      if (experienceToNextLevelPercentageDifference > highestExperienceToNextLevelPercentageDifferences)
      {
        highestExperienceToNextLevelPercentageDifferences = experienceToNextLevelPercentageDifference;
      }
    }
    experienceToNextLevelPercentageDifferences.push(experienceToNextLevelPercentageDifference);
  }
  
  let cumulativeExperienceColorScale = chroma.scale(['#228B22', 'yellow', 'orange', 'red']).domain([lowestCumulativeExperience, highestCumulativeExperience]);
  let experienceToNextLevelPercentageDifferenceColorScale = chroma.scale(['#228B22', 'yellow', 'orange', 'red']).domain([lowestExperienceToNextLevelPercentageDifferences, highestExperienceToNextLevelPercentageDifferences]);
  let experienceToNextLevelColorScale = chroma.scale(['#228B22', 'yellow', 'orange', 'red']).domain([lowestExperienceToNextLevel, highestExperienceToNextLevel]);
  
  let tableRowsContentHtml = '';
  
  for (let i = 0; i < data.length; i++)
  {
    // Calculating background color for each cell for current row
    let cumulativeExperienceBackgroundColor = utilities.isNumeric(data[i].cumulativeExperience) ? cumulativeExperienceColorScale(data[i].cumulativeExperience).hex() : '#DCDCDC';
    let experienceToNextLevelPercentageDifferenceBackgroundColor = utilities.isNumeric(experienceToNextLevelPercentageDifferences[i]) ? experienceToNextLevelPercentageDifferenceColorScale(experienceToNextLevelPercentageDifferences[i]).hex() : '#DCDCDC';
    let experienceToNextLevelBackgroundColor = utilities.isNumeric(data[i].experienceToNextLevel) ? experienceToNextLevelColorScale(data[i].experienceToNextLevel).hex() : '#DCDCDC';
    
    // Formatting values to display for each cell for current row
    let formattedExperienceToNextLevelPercentageDifference = experienceToNextLevelPercentageDifferences[i];
    if (utilities.isNumeric(experienceToNextLevelPercentageDifferences[i]))
    {
      formattedExperienceToNextLevelPercentageDifference = experienceToNextLevelPercentageDifferences[i].toFixed(3) + ' %';
    }
    
    let formattedExperienceToNextLevelPercentOfMaxLevelExperience = '-';
    if (utilities.isNumeric(data[i].experienceToNextLevel))
    {
      formattedExperienceToNextLevelPercentOfMaxLevelExperience = (data[i].experienceToNextLevel / highestCumulativeExperience) * 100;
      
      if (formattedExperienceToNextLevelPercentOfMaxLevelExperience >= 1.0)
      {
        formattedExperienceToNextLevelPercentOfMaxLevelExperience = formattedExperienceToNextLevelPercentOfMaxLevelExperience.toFixed(3);
      }
      else
      {
        formattedExperienceToNextLevelPercentOfMaxLevelExperience = formattedExperienceToNextLevelPercentOfMaxLevelExperience.toExponential(3);
      }
      formattedExperienceToNextLevelPercentOfMaxLevelExperience += ' %';
    }
    
    tableRowsContentHtml += `
      <tr>
        <td nowrap style="text-align: center;">${data[i].level}</td>
        <td nowrap style="text-align: end; background-color: ${cumulativeExperienceBackgroundColor};">${utilities.isNumeric(data[i].cumulativeExperience) ? utilities.thousandsCommaFormatNumber(data[i].cumulativeExperience) : '-'}</td>
        <td nowrap style="text-align: end; background-color: ${experienceToNextLevelBackgroundColor};">${utilities.isNumeric(data[i].experienceToNextLevel) ? utilities.thousandsCommaFormatNumber(data[i].experienceToNextLevel) : '-'}</td>
        <td nowrap style="text-align: end; background-color: ${experienceToNextLevelPercentageDifferenceBackgroundColor};">${formattedExperienceToNextLevelPercentageDifference}</td>
        <td nowrap style="text-align: end; background-color: ${experienceToNextLevelBackgroundColor};">${formattedExperienceToNextLevelPercentOfMaxLevelExperience}</td>
      </tr>
    `;
  }
  
  return `
    ${tableRowsContentHtml}
  `;
}

/**
 * Generates HTML for level experience data table footers.
 *
 * @return HTML code to generate level experience data table footers
 */
function generateTableFooter()
{
  return `
    <tr style="border-top: 4px solid black;">
      <th rowspan="2">Level</th>
      <th rowspan="2">Cumulative Experience</th>
      <th colspan="3">Experience to Next Level</th>
    </tr>
    <tr>
      <th>Experience to Next Level</th>
      <th>% Difference From<br>Last Level</th>
      <th>% of Max Level<br>Experience</th>
    </tr>
  `;
}
