document.body.style.margin = 0;

components = {
  wrapper: document.createElement("div"),
  title: document.createElement("h1"),
  table: document.createElement("table"),
  backButton: document.createElement("button"),
};

function initPage() {
  createWrapper();
  createTitle();
  createTable();
  createBackButton();
}

function createWrapper() {
  components.wrapper.style.display = "flex";
  components.wrapper.style.flexDirection = "column";
  components.wrapper.style.justifyContent = "center";
  components.wrapper.style.alignItems = "center";
  components.wrapper.style.backgroundColor = "#525053";
  components.wrapper.style.width = "100vw";
  components.wrapper.style.height = "100vh";
  document.body.append(components.wrapper);
}

function createTitle() {
  components.title.style.fontSize = "48px";
  components.title.style.color = "white";
  components.title.textContent = "Таблица рекордов";
  components.wrapper.append(components.title);
}

function createTable() {
  components.table.style.border = "1px solid white";
  components.table.style.borderCollapse = "collapse";
  const storage = sortStorage();
  console.log(storage)
  storage.forEach(elem => {
    let tr = document.createElement("tr");

    let key = createTd(elem.key);
    let value = createTd(elem.value);
    tr.append(key, value);

    components.table.append(tr);
  })
  components.wrapper.append(components.table);
}

function sortStorage() {
  const keys = Object.keys(localStorage);
  const keyValuePairs = [];

  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    keyValuePairs.push({ key, value });
  });
  keyValuePairs.sort((a, b) => a.value.localeCompare(b.value));

  return keyValuePairs;
}

function createTd(text) {
  let td = document.createElement("td");
  td.style.border = "1px solid white";
  td.style.borderCollapse = "collapse";
  td.style.padding = 10 + "px";
  td.style.fontSize = 20 + "px";
  td.style.color = "white";
  td.innerText = text;

  return td;
}

function createBackButton() {
  components.backButton.textContent = "Назад";

  components.backButton.style.padding = "10px";
  components.backButton.style.margin = "25px";
  components.backButton.style.fontSize = "20px";
  components.backButton.style.border = "none";
  components.backButton.style.borderRadius = "10px";

  components.backButton.onclick = function () {
    document.location = "/index.html";
  };
  components.wrapper.append(components.backButton);
}

initPage();
