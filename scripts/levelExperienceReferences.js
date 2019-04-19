
/**
 * Generates HTML for references.
 *
 * @param levelExperienceDataList Contains list of all the data for all games
 * @return HTML code for references
 */
export default function(levelExperienceDataList)
{
  let referencesHtml = '';
  
  referencesHtml += '<h2 style="margin: 0px;">References</h2>';
  referencesHtml += '<hr>';
  
  for (let i = 0; i < levelExperienceDataList.length; i++)
  {
    referencesHtml += '<div><img src="' + levelExperienceDataList[i].titleImageUri + '" alt="' + levelExperienceDataList[i].gameName + '" style="height: 50px; border: 1px solid black;"></div>';
    referencesHtml += '<ul>';
    for (let j = 0; j < levelExperienceDataList[i].references.length; j++)
    {
      referencesHtml += '<li>' + levelExperienceDataList[i].references[j] + '</li>';
    }
    referencesHtml += '</ul>';
  }
  
  return `
    <div style="margin: 20px 0px 0px 10px; line-height: 1.0; font-size: 26px;">
      ${referencesHtml}
    </div>
  `;
}
