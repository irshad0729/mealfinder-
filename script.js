const search = document.getElementById("search");
const submit = document.getElementById("search-btn");
const random = document.getElementById("random");
const mealEl = document.getElementById("meals");
const resultHeading = document.getElementsByClassName("result-heading");
const single_mealEl = document.getElementById("single-meal");
var tasks = [];
const tasksList = document.getElementById("list");
const favouriteButton = document.getElementById("fav-btn");

//search meals
function seacrhMeal(e) {
  const result = document.getElementById("result");
  result.style.display = "none";
  e.preventDefault(); // prevent from reload the page after submission
  // clear single meal
  single_mealEl.innerHTML = "";
  // get search meal

  const term = search.value;

  // check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        resultHeading.innerHTML = `<h2>Search result for ${term}`;
        if (data.meals === null) {
          resultHeading.innerHTML = `<h2> There are no result for ${term}`;
        } else {
          mealEl.innerHTML = data.meals
            .map(
              (meal) => `
                    <div class="meal shadow p-3 mb-5 bg-body rounded">
                        <img class="imgList" src="${meal.strMealThumb}" alt="${meal.idMeal}">
                            <div class="meal-info" id="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                                <button class="fav-btn" type="submit" >
                                   
                                    <i class="fs-2 fa-solid fa-square-plus" id="${meal.idMeal}"></i>
                                </button>
                            </div>
 
                    </div>
                    
                    `
            )
            .join("");
        }
      });
  } else {
    alert("Please enter value ");
  }
}

function addTask(task) {
  if (task) {
    tasks.push(task);
    return;
  }
}
// used to redirect to favourite page
function redirectFavPage() {
  localStorage.setItem("FavList", JSON.stringify(tasks));
  window.location.href = "favourite.html";
}

//add meal items in an array for suggestion
var search_terms = [
  "chicken",
  "chicken curry",
  "chicken briyani",
  "chicken lollipop",
  "chicken fry",
  "paneer tikka",
  "chilli paneer",
  "paneer bhurji",
  "paneer butter masala",
];

// Search auto complete suggestion function
function autoSuggestion(val) {
  if (val == "") {
    return [];
  }
  var b = search_terms.filter(checkPresent);
  function checkPresent(check) {
    return check.includes(val);
  }
  return b;
}

// show the result on dom using list items
function showResults(val) {
  console.log(val);
  res = document.getElementById("result");
  res.innerHTML = "";
  let list = "";
  let terms = autoSuggestion(val);
  for (i = 0; i < terms.length; i++) {
    list += '<li class="suggestionList">' + terms[i] + "</li>";
  }
  res.innerHTML = "<ul>" + list + "</ul>";
}

function getValueF(e) {
  console.log(e.target.className);
  //show the selected itme from list into search bar
  if (e.target.className === "suggestionList") {
    search.value = e.target.innerHTML;
  }
  // adding items into favourite list
  if (e.target.className === "fs-2 fa-solid fa-square-plus") {
    const mealID = e.target.id;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
      .then((res) => res.json())
      .then((data) => {
        // const meal=data.meal[0];
        console.log(data);
        const favMeal = {
          id: mealID,
          name: data.meals[0].strMeal,
        };
        addTask(favMeal);
      });
  }
  //redirect to meal details page upon clicking images
  if (e.target.className === "imgList" || e.target.className === "meal-info") {
    console.log(e.target.alt);
    const mealID = e.target.id;
    sessionStorage.setItem("mealIdTrfr", mealID);
    window.location.href = "mealdetails.html";
  }
}
// click event used to redirect to favorite page
favouriteButton.addEventListener("click", redirectFavPage);

// submit the search result of search bar
submit.addEventListener("click", seacrhMeal);

// used event delegation to find click object for image and adding favorite
document.addEventListener("click", getValueF);
