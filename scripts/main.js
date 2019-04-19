
import { drawLineGraph } from './levelExperienceLineChart.js';
import { drawSunburstGraph } from './levelExperienceSunburstChart.js';
import levelExperienceDataTable from './levelExperienceDataTable.js';
import levelExperienceReferences from './levelExperienceReferences.js';


const LEVEL_EXPERIENCE_DATA_PATHS_PATH = 'data/LevelExperienceDataPaths.json';

loadLevelExperienceDataPaths(LEVEL_EXPERIENCE_DATA_PATHS_PATH);

/**
 * Load and setup all the games' level experience data.
 *
 * @param levelExperienceDataPathsPath Relative path of the json file that contains the list of relative paths of json files that each point to a game's level experience data
 */
function loadLevelExperienceDataPaths(levelExperienceDataPathsPath)
{
  console.info('Reading: "' + levelExperienceDataPathsPath + '"');
  fetch(levelExperienceDataPathsPath)
    .then(response =>
    {
      if (response.ok)
      {
        return response.json();
      }
      else
      {
        console.error('Configuration was not ok.');
      }
    })
    .then(levelExperienceDataPaths =>
    {
      console.info('levelExperienceDataPaths:');
      console.log(levelExperienceDataPaths);
      
      let levelExperienceDataList = [];
      for (let i = 0; i < levelExperienceDataPaths.length; i++)
      {
        fetch(levelExperienceDataPaths[i])
          .then(response =>
          {
            if (response.ok)
            {
              return response.json();
            }
            else
            {
              console.error('Configuration was not ok.');
            }
          })
          .then(levelExperienceData =>
          {
            levelExperienceDataList.push(levelExperienceData);
          })
          .catch (function(error)
          {
            console.error('Error in fetching: ' + error);
          })
          .finally (function()
          {
            levelExperienceDataList.sort(function(levelExperienceData1, levelExperienceData2)
            {
              return levelExperienceData1.gameName > levelExperienceData2.gameName;
            });
            // TODO: Figure out how to call only once?
            console.info('levelExperienceDataList:');
            console.log(levelExperienceDataList);
            setupSelectMenu(levelExperienceDataList);
            setupReferencesTab(levelExperienceDataList);
          });
      }
    })
    .catch (function(error)
    {
      console.error('Error in fetching: ' + error);
    })
}

/**
 * Setup the main page's select menu, where the user selects which game to load.
 *
 * @param levelExperienceDataList Contains list of all the data for all games
 */
function setupSelectMenu(levelExperienceDataList)
{
  // Creating and setting the select menu list of games
  let levelExperienceSelectHtml = '';
  levelExperienceSelectHtml += `
    <select name="games" id="games">
      <option disabled selected>Choose game</option>
  `;
  for (let i = 0; i < levelExperienceDataList.length; i++)
  {
    levelExperienceSelectHtml += '<option value="' + i + '" titleImageUri="' + levelExperienceDataList[i].titleImageUri + '">' + levelExperienceDataList[i].gameName + '</option>';
  }
  levelExperienceSelectHtml += '</select>';
  document.getElementById("levelExperienceSelectHtmlWrapper").innerHTML = levelExperienceSelectHtml;
  
  // Display what/how the drop-down options are displayed like
  $.widget('custom.iconselectmenu', $.ui.selectmenu,
  {
    _renderItem: function(ul, item)
    {
      let li = $('<li style="text-align: center;">');
      if (item.disabled)
      {
        li.addClass('ui-state-disabled');
      }
      if (!item.element.attr('titleImageUri'))
      {
        li.append('<div style="height: 18px;">' + item.label + '</div>');
      }
      else
      {
        li.append('<div><img src="' + item.element.attr('titleImageUri') + '" alt=" " style="height: 50px;"></div>');
      }
      return li.appendTo(ul);
    }
  });
  
  // Display what/how the selected option should be displayed like
  $('#games')
    .iconselectmenu(
    {
      width: '180px',
      select: function (event, ui)
      {
        $(this).iconselectmenu('widget').text('.');
        $(this).iconselectmenu('widget').attr('style', 'background-image: url(' + ui.item.element.attr('titleImageUri') + '); background-repeat: no-repeat; background-size: cover; background-position: center; height: 51px; padding: 0px;');
        $(this).iconselectmenu('option', 'width', '180px');
      },
      change: function(event, ui)
      {
        console.info('Select Menu Changed: ' + ui.item.value);
        console.log(levelExperienceDataList[ui.item.value]);
        setupTabs(levelExperienceDataList[ui.item.value]);
      }
    })
    .iconselectmenu('menuWidget')
    .addClass('ui-menu-icons');
}

/**
 * Setup all the main page's tabs and put it into the HTML by respective IDs.
 *
 * @param levelExperienceData Contains all the data for setting up the visualizations for a specified game
 */
function setupTabs(levelExperienceData)
{
  // Line Chart
  let lineChartHtmlContainerId = 'lineChartContainer';
  let levelExperienceLineChartHtml = '<div id=' + lineChartHtmlContainerId + ' style="width: 99%; height: 90%; position: absolute;"></div>';
  document.getElementById("levelExperienceLineChartHtmlWrapper").innerHTML = levelExperienceLineChartHtml;
  drawLineGraph(lineChartHtmlContainerId, levelExperienceData);
  
  // Sunburst Chart
  let sunburstChartHtmlContainerId = 'sunburstChartContainer';
  let levelExperienceSunburstChartHtml = '<div id=' + sunburstChartHtmlContainerId + ' style="width: ' + (window.innerHeight - 75) + 'px;"></div>';
  document.getElementById("levelExperienceSunburstChartHtmlWrapper").innerHTML = levelExperienceSunburstChartHtml;
  drawSunburstGraph(sunburstChartHtmlContainerId, levelExperienceData);
  
  // Data Table
  let guildDataTableHtml = levelExperienceDataTable(levelExperienceData.data);
  document.getElementById("levelExperienceDataTableHtmlWrapper").innerHTML = guildDataTableHtml;
}

/**
 * Setup the main page's reference tab and put it into the HTML by respective ID.
 *
 * @param levelExperienceDataList Contains list of all the data for all games
 */
function setupReferencesTab(levelExperienceDataList)
{
  // Reference
  let levelExperienceReferencesHtml = levelExperienceReferences(levelExperienceDataList);
  document.getElementById("levelExperienceReferencesHtmlWrapper").innerHTML = levelExperienceReferencesHtml;
}
