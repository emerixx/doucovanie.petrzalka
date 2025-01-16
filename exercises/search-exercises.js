let search_bar = document.getElementById("exercises_nav_search_bar");
let math_ul=document.getElementById("exercises_nav_ul");
let exercises_math_text = ["Mocniny a odmocniny", "Pytagorova veta", "Kruh, kružnica", "Riešenie lineárnych rovníc", "Riešenie lineárnych nerovníc"];
let exercises_math_lc = exercises_math_text.map(word => word.toLowerCase());


function searchInArray(searchString, array) {
  // Convert the search string to lowercase for case-insensitive comparison
  const lowerCaseSearchString = searchString.toLowerCase();

  // Use filter to find all strings that include the search string
  return array.filter(item => item.toLowerCase().includes(lowerCaseSearchString));
}
function findIndexes(searchString, array) {
  // Convert the search string to lowercase for case-insensitive comparison
  const lowerCaseSearchString = searchString.toLowerCase();

  // Use map to create an array of indexes where the condition is met
  return array
      .map((item, index) => (item.toLowerCase().includes(lowerCaseSearchString) ? index : -1)) // Map to indexes or -1
      .filter(index => index !== -1); // Filter out -1 values to get only valid indexes
}

function convertText() {
  const input = document.getElementById('inputText').value;
  const converted = replaceSlovakCharacters(input);
  document.getElementById('outputText').innerText = converted;
}

function replaceSlovakCharacters(text) {
  const replacements = {
      'á': 'a', 'ä': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 
      'ě': 'e', 'í': 'i', 'ľ': 'l', 'ĺ': 'l', 'ň': 'n', 
      'ó': 'o', 'ô': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 
      'ú': 'u', 'ý': 'y', 'ž': 'z',
      // Add uppercase replacements if needed
      'Á': 'A', 'Ä': 'A', 'Č': 'C', 'Ď': 'D', 
      'É': 'E', 'Í': 'I', 'Ľ': 'L', 
      'Ň': 'N',  'Ó':  'O',  'Ô':  'O',
      // Continue for other uppercase characters...
  };

  return text.replace(/[áäčďéěíľĺňóôřšťúýžÁÄČĎÉÍĽŇÓÔ]/g, match => replacements[match]);
}

function updateNav(indexes, text_arr, ul, dir){
  let html=""
  for (let i = 0; i < indexes.length; i++) {
    console.log(i);
    html+="<a href="+dir+indexes[i]+"><li>"+text_arr[indexes[i]]+"</li></a>"
   }
  ul.innerHTML=html;

}


search_bar.addEventListener('change', function() {
  
  let arg=[];
  arg[0]=replaceSlovakCharacters(this.value).toLowerCase();
  arg[1]=exercises_math_text.map(word => replaceSlovakCharacters(word));;
  
  updateNav(findIndexes(arg[0], arg[1]), exercises_math_text, math_ul, "/exercises/math/");
});

let arg=[];
arg[0]=replaceSlovakCharacters(this.value).toLowerCase();
arg[1]=exercises_math_text.map(word => replaceSlovakCharacters(word));;

updateNav(findIndexes(arg[0], arg[1]), exercises_math_text, math_ul, "/exercises/math/");