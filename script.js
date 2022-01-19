const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const form = document.querySelector(".search");
const input = document.querySelector(".search__field");
const main = document.querySelector(".slider");
const slide = document.querySelector(".slide");
const error = document.querySelector(".error");
const list = document.querySelector(".list");
let partOfSpeech;
let query = "";
let meaningsData;
//console.log(form);
//console.log(main);
//console.log(document.querySelector(".message"));

const createMain = function (data, index = 0) {
  console.log(data);
  let synonyms = data[index].definitions[0].synonyms;
  let antonyms = data[index].definitions[0].antonyms;

  if (synonyms.length == 0) {
    synonyms = "<p><b>Synonyms:</b>There are no synonyms found!</p>";
  } else {
    let sys = ``;
    synonyms.forEach((el, i) => {
      if (i % 3 == 0 && i != 0)
        sys += `<span class="item" data-index=${i}>${el}</span><br><br>`;
      else sys += `<span class="item" data-index=${i}>${el}</span>`;
    });
    console.log(sys);
    synonyms = `<p><b>Synonyms:</b><br><br>${sys}</p><br>`;
  }

  if (antonyms.length == 0) {
    antonyms = "<p><b>Antonyms:</b>There are no antonyms found!</p>";
  } else {
    let sys = ``;
    antonyms.forEach((el, i) => {
      if (i % 5 == 0 && i != 0)
        sys += `<span class="item" data-index=${i}>${el}</span><br><br>`;
      else sys += `<span class="item" data-index=${i}>${el}</span>`;
    });
    //console.log(sys);
    antonyms = `<p><b>Antonyms:</b><br><br>${sys}</p>`;
  }
  const html = `
    <p><b>Word:</b> ${query}</p>
    <p><b>Part Of Speech:</b> ${data[index].partOfSpeech}</b></p>
    <p><b>Definitions:</b> ${data[index].definitions[0].definition}</p>
    <p><b>Example:</b> ${data[index].definitions[0].example}</p>
    ${synonyms}
    ${antonyms}
    `;
  //console.log(html);
  if (slide) slide.innerHTML = "";
  slide.insertAdjacentHTML("afterbegin", html);
  document.querySelector(".message").classList.add("hidden");
};
const clear = function () {
  query = "";
  if (slide) slide.innerHTML = "";
  if (error) error.innerHTML = "";
  if (list) list.innerHTML = "";
};
const getJson = async function () {
  try {
    if (query == "") query = input.value;
    input.value = "";
    input.blur();
    //console.log(query);
    const res = await fetch(`${API_URL}${query}`);
    //console.log(res);
    const data = await res.json();
    console.log(data);

    if (!res.ok) throw new Error(`${data.title}`);

    const finalData = data[0];

    //partOfSpeech = finalData.meanings[0].partOfSpeech;

    let listHtml = ``;
    finalData.meanings.forEach((word, i) => {
      i == 0
        ? (listHtml += `<p class="item item--active" data-index=${i}>${word.partOfSpeech}</p>`)
        : (listHtml += `<p class="item" data-index=${i}>${word.partOfSpeech}</p>`);
    });
    console.log(listHtml);
    meaningsData = finalData.meanings;
    createMain(finalData.meanings);

    list.insertAdjacentHTML("afterbegin", listHtml);
    list.classList.remove("hidden");
  } catch (err) {
    console.log(err);
    const html = `
    <h1>ERROR!</h1>
    <p>${err.message}</p>
    `;
    document.querySelector(".message").classList.add("hidden");
    error.insertAdjacentHTML("afterbegin", html);
    //main.querySelector(".error").querySelector("p").textContent = err.message;
  }
};

list.addEventListener("click", function (e) {
  const item = e.target.closest(".item");
  if (!item) return;
  e.target
    .closest(".list")
    .querySelectorAll(".item")
    .forEach((el) => {
      //console.log(el);
      el.classList.remove("item--active");
    });
  item.classList.add("item--active");
  //console.log(item.dataset.index);
  createMain(meaningsData, item.dataset.index, "ds");
});

slide.addEventListener("click", function (e) {
  const item = e.target.closest(".item");
  if (!item) return;
  console.log(item.textContent);
  clear();
  query = item.textContent;
  getJson(item.textContent);
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  //main.querySelector(".message").classList.remove("hidden");
  console.log(error);
  //console.log(a);
  clear();
  getJson();
});
